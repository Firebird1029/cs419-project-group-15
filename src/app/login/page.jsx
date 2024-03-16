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
import login from "./actions";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          Login
        </Heading>
        <Stack spacing={4}>
          <p>Username/Email:</p>
          <Input
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Password:</p>
          <Input
            placeholder=""
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button colorScheme="blue" onClick={() => login({ email, password })}>
            Log In
          </Button>
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
    )
  );
}
