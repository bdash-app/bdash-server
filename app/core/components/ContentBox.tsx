import { Box, BoxProps } from "@chakra-ui/react"

export const ContentBox: React.FC<BoxProps> = (props) => {
  return (
    <Box
      bg="white"
      pl={{ base: 3, md: 10 }}
      pr={{ base: 3, md: 10 }}
      pt={{ base: 3, md: 5 }}
      pb={{ base: 3, md: 5 }}
      borderRadius="xl"
      {...props}
    >
      {props.children}
    </Box>
  )
}
