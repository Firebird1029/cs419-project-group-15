import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";

export default function Login() {
  return (
    <Container>
      <Heading mt={4} mb={8}>
        Login
      </Heading>
      <Stack spacing={4}>
        <p>Username/Email:</p>
        <Input placeholder="" />
        <p>Password:</p>
        <Input placeholder="" type="password" />
        <Button colorScheme="blue">Log In</Button>
      </Stack>

      <Stack spacing={4} mt={16}>
        <Center>Don&apos;t have an account?</Center>

        <Link href="/register" w="100%">
          <Button colorScheme="green" w="100%">
            Sign Up
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
