import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Checkbox,
  ModalFooter,
  Button,
  Text,
  Box,
} from "@chakra-ui/react"
import { useRef } from "react"
import { Form, Field } from "react-final-form"
import { RunnerDataSourceFormValue } from "types"
import { encryptText } from "../lib/crypto"
import { addDataSource, RunnerDataSource } from "../lib/dataSourceStorage"

export const RunnerDataSourceModal = ({
  isOpen,
  onClose,
  onAddDataSource,
}: {
  isOpen: boolean
  onClose: () => void
  onAddDataSource: (addedDataSource: RunnerDataSource) => void
}) => {
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const required = (value) => (value ? undefined : "Required")
  const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined)

  const onSubmitDataSource = async (values: RunnerDataSourceFormValue) => {
    const publicKeyJwt: JsonWebKey = JSON.parse(process.env.NEXT_PUBLIC_PUBLIC_KEY_JWK!)
    const encryptedBody = await encryptText(JSON.stringify(values), publicKeyJwt)
    const newDataSource = {
      name: values.dataSourceName,
      encryptedBody,
      createdAt: new Date(),
    }
    addDataSource(newDataSource)
    onAddDataSource(newDataSource)
  }

  return (
    <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Data Source</ModalHeader>
        <ModalCloseButton />
        <Form
          onSubmit={onSubmitDataSource}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody>
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
                  <Field name="type" component="select" validate={required} initialValue="postgres">
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
                      <Checkbox {...input} defaultChecked ref={finalRef}>
                        SSL
                      </Checkbox>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Text fontSize="xs" style={{ textWrap: "balance" } as any}>
                  * This data source will be encrypted and stored in your browser's local storage.
                </Text>
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
  )
}
