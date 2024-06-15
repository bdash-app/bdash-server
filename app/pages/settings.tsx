import React, { Suspense, useCallback, useEffect, useState } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Head, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  VStack,
  Avatar,
  Text,
  Editable,
  EditablePreview,
  EditableInput,
  HStack,
  Heading,
  Input,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Checkbox,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react"
import updateUser from "app/users/mutations/updateUser"
import { EditableControls } from "app/core/components/EditableControls"
import { LoadingMain } from "app/core/components/LoadingMain"
import { getDataSources, RunnerDataSource } from "app/core/lib/dataSourceStorage"
import { format } from "date-fns"
import { AddIcon } from "@chakra-ui/icons"
import { Field, Form } from "react-final-form"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [updateUserMutation] = useMutation(updateUser)
  const [editingName, setEditingName] = useState(currentUser?.name || "Guest")
  const [dataSources, setDataSources] = useState<RunnerDataSource[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const onSubmitName = useCallback(
    async (updatedName: string) => {
      if (currentUser === null) {
        return
      }
      try {
        await updateUserMutation({
          id: currentUser.id,
          name: updatedName,
        })
      } catch (error) {
        console.error(error)
        window.alert("Failed to update user name")
        setEditingName(currentUser.name)
      }
    },
    [currentUser, updateUserMutation]
  )

  useEffect(() => {
    setDataSources(getDataSources())
  }, [])

  const required = (value) => (value ? undefined : "Required")
  const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined)
  const onSubmitDataSource = (values: RunnerDataSource) => {
    console.log("🔥", JSON.stringify(values, null, 2))
    // TODO: NEXT_PUBLIC_PUBLIC_KEY_JWT で暗号化して addDataSource する
  }

  return (
    <VStack align="center">
      <Avatar size="lg" src={currentUser?.icon} />
      <Editable
        value={editingName}
        onChange={setEditingName}
        isPreviewFocusable={false}
        onSubmit={onSubmitName}
        onCancel={setEditingName}
        submitOnBlur={false}
      >
        <HStack>
          <EditablePreview />
          <EditableInput />
          <EditableControls />
        </HStack>
      </Editable>
      <VStack align="flex-start" width={{ base: 300, md: 500 }}>
        <Heading as="h2" fontSize="2xl" marginTop={3}>
          Bdash.app
        </Heading>
        <Text>Set the following values to Bdash.app.</Text>
        <Heading as="h3" fontSize="lg">
          Your Access Token
        </Heading>
        <CopyableText text={currentUser?.accessToken || ""} />
        <Heading as="h3" fontSize="lg">
          Bdash Server URL
        </Heading>
        <CopyableText text={`${window.location.protocol}//${window.location.host}/`} />
      </VStack>
      <VStack align="flex-start" width={{ base: 300, md: 500 }}>
        <Heading as="h2" fontSize="2xl" marginTop={3}>
          Data Source
        </Heading>
        <Text>
          Used by{" "}
          <Text as="span" color="teal">
            <Link href="/runner">Bdash Server Runner</Link>
          </Text>
          .
        </Text>
        <VStack bg="white" borderRadius="xl" align="stretch" width="100%">
          {dataSources.map((dataSource) => {
            const createdAtString = format(dataSource.createdAt, "(yyyy-MM-dd)")
            return (
              <Button key={dataSource.name} variant="ghost">
                <HStack justify="space-between">
                  <Text>{dataSource.name}</Text>
                  <Text>{createdAtString}</Text>
                </HStack>
              </Button>
            )
          })}
          <Button leftIcon={<AddIcon />} variant="ghost" onClick={onOpen}>
            Add
          </Button>
        </VStack>
      </VStack>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Data Source</ModalHeader>
          <ModalCloseButton />
          <Form
            onSubmit={onSubmitDataSource}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb={6}>
                  <Field name="dataSourceName" validate={required}>
                    {({ input, meta }) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Data Source Name</FormLabel>
                        <Input {...input} ref={initialRef} placeholder="My Database" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <FormControl mt={4}>
                    <FormLabel>Type</FormLabel>
                    <Field
                      name="type"
                      component="select"
                      validate={required}
                      initialValue="postgres"
                    >
                      {({ input }) => (
                        <Select {...input} variant="outline">
                          <option value="postgres">Postgres</option>
                        </Select>
                      )}
                    </Field>
                  </FormControl>

                  <Field name="host" validate={required}>
                    {({ input, meta }) => (
                      <FormControl mt={4} isInvalid={meta.error && meta.touched}>
                        <FormLabel>Host</FormLabel>
                        <Input {...input} placeholder="" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="port" validate={mustBeNumber}>
                    {({ input, meta }) => (
                      <FormControl mt={4} isInvalid={meta.error && meta.touched}>
                        <FormLabel>Port</FormLabel>
                        <Input {...input} placeholder="5432" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="username" validate={required}>
                    {({ input, meta }) => (
                      <FormControl mt={4} isInvalid={meta.error && meta.touched}>
                        <FormLabel>Username</FormLabel>
                        <Input {...input} placeholder="" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password" validate={required}>
                    {({ input, meta }) => (
                      <FormControl mt={4} isInvalid={meta.error && meta.touched}>
                        <FormLabel>Password</FormLabel>
                        <Input {...input} placeholder="" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="database" validate={required}>
                    {({ input, meta }) => (
                      <FormControl mt={4} isInvalid={meta.error && meta.touched}>
                        <FormLabel>Database</FormLabel>
                        <Input {...input} placeholder="" />
                        {meta.error && meta.touched && (
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  </Field>

                  <Field name="ssl" type="checkbox" initialValue={true as any}>
                    {({ input, meta }) => (
                      <FormControl mt={4}>
                        <FormLabel>SSL</FormLabel>
                        <Checkbox {...input} defaultChecked>
                          SSL
                        </Checkbox>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit">
                    Save
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </form>
            )}
          />
        </ModalContent>
      </Modal>
    </VStack>
  )
}

const CopyableText = ({ text }: { text: string }) => {
  const select = (e: any) => {
    e.currentTarget.select()
  }
  return (
    <Input
      value={text}
      readOnly={true}
      bg="gray.700"
      color="white"
      borderRadius={6}
      size="sm"
      width="100%"
      onFocus={select}
      onClick={select}
    />
  )
}

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>{`Profile | Bdash Server`}</title>
      </Head>
      <Suspense fallback={<LoadingMain />}>
        <UserInfo />
      </Suspense>
    </>
  )
}

ProfilePage.authenticate = true
ProfilePage.getLayout = (page) => <Layout>{page}</Layout>

export default ProfilePage
