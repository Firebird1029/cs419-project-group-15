"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  Link,
} from "@chakra-ui/react";

// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from "react";

import NextLink from "next/link";
import Drawer from "./DrawerMenu";
// import checkUser from '../AuthContext';
import createClient from "@/utils/supabase/client";

function NavLink(props) {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
}

export default function Nav({ user }) {
  // const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const supabase = createClient();
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const getProfile = useCallback(async () => {
    if (user) {
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`full_name, username, website, avatar`)
          .eq("id", user.id)
          .single();
  
        if (error && status !== 406) {
          throw error;
        }
  
        if (data) {
          setFullname(data.full_name);
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar);
        }
      } catch (error) {
        // alert("Error loading user data! :(");
        console.log(error);
      }
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <Box bg={"#121212ff"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Drawer user={user} />
        <Box>
          <Link as={NextLink} href="/">
            <Image
              width="100%"
              maxWidth="280px" // Set maximum width
              maxHeight="auto"
              objectFit="cover"
              borderRadius="full"
              src="/mindmatrix.png"
              alt="Logo of the website"
            />
          </Link>
        </Box>
        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            {/* <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button> */}
            {user && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={avatarUrl} />
                </MenuButton>
                <MenuList alignItems={"center"} zIndex={"999"}>
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={avatarUrl} />
                  </Center>
                  <br />
                  <Center>
                    <p>
                      {fullname} @{username}
                    </p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem as={NextLink} href={`user/?username=`+username} passHref>
                    Your Games
                  </MenuItem>
                  <MenuItem as={NextLink} href={"/account"}>
                    Account Settings
                  </MenuItem>
                  <form action="/auth/signout" method="post">
                    <MenuItem className="button block" type="submit">
                      Logout
                    </MenuItem>
                  </form>
                </MenuList>
              </Menu>
            )}
            {!user && (
              <Box>
                <Link as={NextLink} href="/login">
                  <Button colorScheme="blue" marginRight={2}>
                    Login
                  </Button>
                </Link>
                <Link as={NextLink} href="/register">
                  <Button colorScheme="green">Register</Button>
                </Link>
              </Box>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
