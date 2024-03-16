"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";

import createClient from "@/utils/supabase/client";
import register from "./actions";

export default function Register() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // already logged in
        router.push("/account");
      } else {
        setLoading(false);
      }
    })().catch((err) => {
      console.error(err);
      router.push("/error");
    });
  }, []);

  return (
    !loading && (
      <Container>
        <Heading mt={4} mb={8}>
          Create an Account
        </Heading>
        <Stack spacing={4}>
          <p>Username:</p>
          <Input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p>Email:</p>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Password:</p>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            colorScheme="blue"
            onClick={() => register({ username, email, password })}
          >
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
    )
  );
}
