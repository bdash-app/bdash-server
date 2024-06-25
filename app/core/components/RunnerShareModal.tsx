import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react"
import { useRef } from "react"

export const RunnerShareModal = ({
  modalTitle,
  openButtonLabel,
  primaryButtonLabel,
  onClickPrimaryButton,
  textFieldLabel,
  textFieldPlaceholder,
  initialText,
  isLoading,
}: {
  modalTitle: string
  openButtonLabel: string
  primaryButtonLabel: string
  onClickPrimaryButton: (text: string) => void
  textFieldLabel: string
  textFieldPlaceholder?: string
  initialText?: string
  isLoading: boolean
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const textFieldRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" variant="outline">
        {openButtonLabel}
      </Button>
      <Modal initialFocusRef={textFieldRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{textFieldLabel}</FormLabel>
              <Input
                ref={textFieldRef}
                placeholder={textFieldPlaceholder}
                defaultValue={initialText}
                onFocus={(event) => {
                  event.target.select()
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                textFieldRef.current && onClickPrimaryButton(textFieldRef.current.value)
              }}
              colorScheme="teal"
              mr={3}
              isLoading={isLoading}
            >
              {primaryButtonLabel}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
