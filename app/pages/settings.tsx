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
  IconButton,
} from "@chakra-ui/react"
import updateUser from "app/users/mutations/updateUser"
import { EditableControls } from "app/core/components/EditableControls"
import { LoadingMain } from "app/core/components/LoadingMain"
import { deleteDataSource, getDataSources, RunnerDataSource } from "app/core/lib/dataSourceStorage"
import { format } from "date-fns"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Field, Form } from "react-final-form"
import { RunnerDataSourceModal } from "app/core/components/RunnerDataSourceModal"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [updateUserMutation] = useMutation(updateUser)
  const [editingName, setEditingName] = useState(currentUser?.name || "Guest")
  const [dataSources, setDataSources] = useState<RunnerDataSource[]>([])
  const onAddDataSource = () => {
    setDataSources(getDataSources())
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const onClickDeleteDataSource = (dataSource: RunnerDataSource) => {
    if (!window.confirm(`Are you sure to delete "${dataSource.name}"?`)) return
    deleteDataSource(dataSource)
    setDataSources(getDataSources())
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
        <Text>
          Set the following values to{" "}
          <Text as="span" color="teal">
            <Link href="/runner">Bdash.app</Link>
          </Text>
          .
        </Text>
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
          Runner
        </Heading>
        <Text>
          Your data sources used in{" "}
          <Text as="span" color="teal">
            <Link href="/runner">Runner</Link>
          </Text>{" "}
          page. These are encrypted and stored in your browser.
        </Text>
        <VStack bg="white" borderRadius="xl" align="stretch" width="100%">
          {dataSources.map((dataSource) => {
            const createdAtString = format(dataSource.createdAt, "(yyyy-MM-dd)")
            return (
              <HStack
                key={dataSource.name}
                justifyContent="space-between"
                alignItems="center"
                paddingInline="4"
                paddingBlockStart="2"
              >
                <HStack>
                  <Text>{dataSource.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {createdAtString}
                  </Text>
                </HStack>
                <Button
                  colorScheme="red"
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    onClickDeleteDataSource(dataSource)
                  }}
                >
                  Delete
                </Button>
              </HStack>
            )
          })}
          <Button leftIcon={<AddIcon />} variant="ghost" onClick={onOpen}>
            Add
          </Button>
        </VStack>
      </VStack>
      <RunnerDataSourceModal isOpen={isOpen} onClose={onClose} onAddDataSource={onAddDataSource} />
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
