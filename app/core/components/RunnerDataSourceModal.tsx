import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react"
import { useContext, useRef } from "react"
import { Field, Form } from "react-final-form"
import { RunnerDataSourceFormValue } from "types"
import { encryptText } from "../lib/crypto"
import { addDataSource, RunnerDataSource } from "../lib/dataSourceStorage"
import { AppContext } from "app/pages/_app"

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
  const { publicKeyJwk } = useContext(AppContext)

  const onSubmitDataSource = async (values: RunnerDataSourceFormValue) => {
    if (publicKeyJwk == null) return
    const encryptedBody = await encryptText(JSON.stringify(values), publicKeyJwk)
    const newDataSource: RunnerDataSource = {
      type: values.type,
      host: values.host,
      port: values.port,
      username: values.username,
      database: values.database,
      dataSourceName: values.dataSourceName,
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
                      <Input {...input} placeholder="" type="password" />
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
                  * This data source will be encrypted and stored in your browser.
                </Text>
                <Button colorScheme="teal" mr={3} type="submit">
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
