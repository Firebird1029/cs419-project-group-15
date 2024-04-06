import NextLink from "next/link";
import { Box, Button, Container, Heading, Link } from "@chakra-ui/react";
import createClient from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();

  // Ensure user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <Container>
      <Heading mt={4} mb={8}>
        Home
      </Heading>

      {/* TODO move these links to navbar etc */}

      {user && (
        <Box mb={16}>
          <Link as={NextLink} href="/account">
            <Button>Profile</Button>
          </Link>
          <br />
          <br />
          <Link as={NextLink} href="/create">
            <Button colorScheme="blue">Create Game</Button>
          </Link>
          <br />
          <br />
          <form action="/auth/signout" method="post">
            <Button type="submit">Sign out</Button>
          </form>
        </Box>
      )}

      {!user && (
        <Box mb={16}>
          <Link as={NextLink} href="/login">
            <Button colorScheme="blue">Login</Button>
          </Link>
          <br />
          <br />
          <Link as={NextLink} href="/register">
            <Button colorScheme="green">Register</Button>
          </Link>
        </Box>
      )}
    </Container>
  );
}
