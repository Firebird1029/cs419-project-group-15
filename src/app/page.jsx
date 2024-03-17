import NextLink from "next/link";
import { Box, Button, Container, Heading, Link } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container>
      <Heading mt={4} mb={8}>
        Home
      </Heading>

      {/* TODO move these links to navbar etc */}
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

      <Box>
        <Link as={NextLink} href="/account">
          <Button>Profile</Button>
        </Link>
        <br />
        <br />
        <Link as={NextLink} href="/create">
          <Button>Create Game</Button>
        </Link>
        <br />
        <br />
        <form action="/auth/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </Box>
    </Container>
  );
}
