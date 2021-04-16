import React, { Suspense, useCallback, useState } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Head, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  VStack,
  Avatar,
  Text,
  Code,
  Button,
  Editable,
  EditablePreview,
  EditableInput,
  HStack,
  Heading,
  Spinner,
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
      {currentUser && (
        <Link href="/user/[userId]" as={`/user/${currentUser.id}`}>
          <a>
            <Button marginTop={2} colorScheme="teal">
              Queries
            </Button>
          </a>
        </Link>
      )}
      <VStack align="flex-start">
        <Heading as="h2" fontSize="2xl" marginTop={3}>
          Bdash client config
        </Heading>
        <Text>Set the following values to Bdash client config.</Text>
        <Text>
          Access Token: <Code colorScheme="blackAlpha">{currentUser?.accessToken}</Code>
        </Text>
        <Text>
          GitHub Enterprise URL:
          <Code colorScheme="blackAlpha">{`${window.location.protocol}//${window.location.host}/api/bdash-query`}</Code>
        </Text>
      </VStack>
    </VStack>
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
