import React, { Suspense, useCallback, useState } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Head, useMutation, Image } from "blitz"
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
  Textarea,
  Code,
} from "@chakra-ui/react"
import updateUser from "app/users/mutations/updateUser"
import { EditableControls } from "app/core/components/EditableControls"
import { LoadingMain } from "app/core/components/LoadingMain"

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

  const baseUrl = `${window.location.protocol}//${window.location.host}/`

  const mcpConfig = {
    url: `${baseUrl}api/mcp`,
    headers: {
      Authorization: `Bearer ${currentUser?.accessToken}`,
    },
  }

  const mcpJson = {
    mcpServers: {
      "Bdash Server": mcpConfig,
    },
  }

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
        <Heading as="h2" fontSize="2xl" marginTop={4}>
          Bdash Client Configuration
        </Heading>
        <Text>Configure your Bdash client with the following values.</Text>
        <Heading as="h3" fontSize="lg">
          Access Token
        </Heading>
        <CopyableText text={currentUser?.accessToken || ""} />
        <Heading as="h3" fontSize="lg">
          Bdash Server URL
        </Heading>
        <CopyableText text={baseUrl} />
        {currentUser?.accessToken && (
          <>
            <Heading as="h2" fontSize="2xl" marginTop={8}>
              MCP Server
            </Heading>
            <Text>You can use the MCP server to search for queries on Bdash Server.</Text>
            For Cursor:
            <AddToCursor mcpConfig={mcpConfig} />
            <Code>mcp.json</Code>
            <Textarea
              value={JSON.stringify(mcpJson, null, 2)}
              readOnly={true}
              bg="gray.700"
              color="white"
              borderRadius={6}
              size="sm"
              width={{ base: 300, md: 500 }}
              height="12lh"
              wordBreak="break-all"
            />
          </>
        )}
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
      width={{ base: 300, md: 500 }}
      onFocus={select}
      onClick={select}
    />
  )
}

const AddToCursor = ({ mcpConfig }: { mcpConfig: Record<string, any> }) => {
  return (
    <a
      href={`https://cursor.com/install-mcp?name=Bdash%20Server&config=${encodeURIComponent(
        btoa(JSON.stringify(mcpConfig))
      )}`}
    >
      <Image
        src="https://cursor.com/deeplink/mcp-install-dark.svg"
        alt="Add Bdash Server MCP to Cursor"
        width="144"
        height="32"
        unoptimized
      />
    </a>
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
