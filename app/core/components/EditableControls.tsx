import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
import { ButtonGroup, Flex, IconButton, useEditableControls } from "@chakra-ui/react"

export const EditableControls = () => {
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
