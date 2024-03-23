import { Container, Heading } from "@chakra-ui/react";

// TODO style this page

export default function ErrorPage() {
  return (
    <Container>
      <Heading mt={4} mb={8}>
        Uh Oh!
      </Heading>
      <p>Sorry, something went wrong.</p>
    </Container>
  );
}
