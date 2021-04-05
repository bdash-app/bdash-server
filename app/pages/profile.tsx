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
  useEditableControls,
  Flex,
  ButtonGroup,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  HStack,
} from "@chakra-ui/react"
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
import updateUser from "app/users/mutations/updateUser"

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
      <Text>
        Access Token: <Code colorScheme="blackAlpha">{currentUser?.accessToken}</Code>
      </Text>
      {currentUser && (
        <Link href="/user/[userId]" as={`/user/${currentUser.id}`}>
          <a>
            <Button marginTop={2} colorScheme="teal">
              Queries
            </Button>
          </a>
        </Link>
      )}
    </VStack>
  )
}

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton icon={<CheckIcon />} {...(getSubmitButtonProps() as any)} />
      <IconButton icon={<CloseIcon />} {...(getCancelButtonProps() as any)} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="sm" icon={<EditIcon />} {...(getEditButtonProps() as any)} />
    </Flex>
  )
}

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>{`Profile | Bdash Server`}</title>
      </Head>
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>
    </>
  )
}

ProfilePage.authenticate = true
ProfilePage.getLayout = (page) => <Layout>{page}</Layout>

export default ProfilePage
