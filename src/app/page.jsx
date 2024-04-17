// 'use client' < -- breaks cookies in server
import NextLink from "next/link";
// import { Box, Button, Container, Heading, Link, Flex } from "@chakra-ui/react";
// https://chakra-templates.vercel.app/navigation/navbar
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Link,
} from "@chakra-ui/react";
// import {
//   HamburgerIcon,
//   CloseIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
// } from '@chakra-ui/icons'

import createClient from "@/utils/supabase/server";

export default async function Home() {
  // Asynch function due to awaiting supbase response
  const supabase = createClient();

  // Ensure user is logged in
  // const { data: allGames } = await supabase.from("games").select("*, profiles!inner(username)");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // const { isOpen, onToggle } = useDisclosure()

  return (
    <Box>
      <Flex
        // bg={useColorModeValue('white', 'gray.800')}
        // color={useColorModeValue('gray.600', 'white')}
        bg={"black"}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={3} // Make navbar border bigger
        borderStyle={"solid"}
        borderColor={"#13770C"} // border color of navbar (matrix green)
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            // onClick={onToggle}
            // icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={{ base: "center", md: "left" }}
            fontFamily={"heading"}
            // color={useColorModeValue('gray.800', 'white')}>
          >
            {/* Remember to put images into public folder in top level! */}
            <img
              src={"/mindmatrix.png"}
              width={280}
              alt={"Logo of the website"}
            />
            MindMatrix
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            {/* <DesktopNav /> */}
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Link as={NextLink} href="/account">
            <Button colorScheme="blue">Sign In</Button>
          </Link>
          <Link as={NextLink} href="/create">
            <Button colorScheme="green">Sign Up</Button>
          </Link>
        </Stack>
      </Flex>

      {/* <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse> */}
    </Box>

    // <Container>
    //   <Heading mt={4} mb={8}>
    //     Home
    //   </Heading>

    //   {/* TODO move these links to navbar etc */}

    //   <Box mb={12}>
    //     <Link as={NextLink} href="/gallery">
    //       <Button colorScheme="blue">Game Gallery</Button>
    //     </Link>
    //   </Box>

    //   {user && (
    //     <Box mb={16}>
    //       <Link as={NextLink} href="/account">
    //         <Button>Profile</Button>
    //       </Link>
    //       <br />
    //       <br />
    //       <Link as={NextLink} href="/create">
    //         <Button colorScheme="blue">Create Game</Button>
    //       </Link>
    //       <br />
    //       <br />
    //       <form action="/auth/signout" method="post">
    //         <Button type="submit">Sign out</Button>
    //       </form>
    //     </Box>
    //   )}

    //   {!user && (
    //     <Box mb={16}>
    //       <Link as={NextLink} href="/login">
    //         <Button colorScheme="blue">Login</Button>
    //       </Link>
    //       <br />
    //       <br />
    //       <Link as={NextLink} href="/register">
    //         <Button colorScheme="green">Register</Button>
    //       </Link>
    //     </Box>
    //   )}

    //   <Box mb = {34}>
    //     Featured Games
    //     <Box>
    //       {allGames.map(
    //         ({ id, name, type, url_tag: url, profiles: { username } }) => (
    //             <Box key={id}>
    //               <Box>{name}</Box>
    //               <Box>{type}</Box>
    //               <Box>{username}</Box>
    //               <Box>
    //                 <Link href={`/g/${url}`}>
    //                   <Button colorScheme="green">Play</Button>
    //                 </Link>
    //               </Box>
    //             </Box>
    //           ),
    //         )}
    //     </Box>
    //   </Box>
    // </Container>
  );
}
