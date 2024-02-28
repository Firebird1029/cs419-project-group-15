"use client";

import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import { register } from "@/services/apiService";

export default function Register() {
  return (
    <Container>
      <Heading mt={4} mb={8}>
        Create an Account
      </Heading>
      <Stack spacing={4}>
        <p>Username:</p>
        <Input placeholder="" />
        <p>Email:</p>
        <Input placeholder="" />
        <p>Password:</p>
        <Input placeholder="" type="password" />
        <Button colorScheme="blue" onClick={() => register()}>
          Sign Up
        </Button>
      </Stack>

      <Stack spacing={4} mt={16}>
        <Center>Already have an account?</Center>
        <Link href="/login" w="100%">
          <Button colorScheme="green" w="100%">
            Log In
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
