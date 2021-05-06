import React, { Suspense, useCallback, useState } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Head, useMutation } from "blitz"
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
  Spinner,
  Input,
} from "@chakra-ui/react"
import updateUser from "app/users/mutations/updateUser"
import { EditableControls } from "app/core/components/EditableControls"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [updateUserMutation] = useMutation(updateUser)
  const [editingName, setEditingName] = useState(currentUser?.name || "Guest")

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

  return (
    <VStack>
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
      <VStack align="flex-start">
        <Heading as="h2" fontSize="2xl" marginTop={3}>
          Bdash client config
        </Heading>
        <Text>Set the following values to Bdash client config.</Text>
        <Heading as="h3" fontSize="lg">
          Access Token
        </Heading>
        <CopyableText text={currentUser?.accessToken || ""} />
        <Heading as="h3" fontSize="lg">
          Bdash Server URL
        </Heading>
        <CopyableText text={`${window.location.protocol}//${window.location.host}/`} />
      </VStack>
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
      width={500}
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
      <Suspense fallback={<Spinner color="teal" />}>
        <UserInfo />
      </Suspense>
    </>
  )
}

ProfilePage.authenticate = true
ProfilePage.getLayout = (page) => <Layout>{page}</Layout>

export default ProfilePage
