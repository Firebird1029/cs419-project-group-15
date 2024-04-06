import {
  Button,
  Container,
  Heading,
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import createClient from "@/utils/supabase/server";

export default async function GalleryPage() {
  const supabase = createClient();

  // get all games from Supabase
  // TODO move to Python API using api service
  const { data: allGames, error } = await supabase
    .from("games")
    .select("*, profiles!inner(username)");

  if (error) {
    console.error(error); // TODO display error message in GUI
    return <Container>Something went wrong!</Container>;
  }

  return (
    <Container>
      <Heading mt={4} mb={8}>
        Gallery
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Browse user-created games!</TableCaption>
          <Thead>
            <Tr>
              <Th>Game</Th>
              <Th>Type</Th>
              <Th>Created By</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {allGames.map(({ id, name, type, profiles: { username } }) => (
              <Tr key={id}>
                <Td>{name}</Td>
                <Td>{type}</Td>
                <Td>{username}</Td>
                <Td>
                  <Button colorScheme="green">Play</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Game</Th>
              <Th>Type</Th>
              <Th>Created By</Th>
              <Th />
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Container>
  );
}
