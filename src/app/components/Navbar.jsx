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
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Link,
  HStack,
  IconButton,
  Badge,
  Divider,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useState } from "react";

import NextLink from "next/link";
import Drawer from "./DrawerMenu";
import createClient from "@/utils/supabase/client";

function NavLink({ children, href, isActive = false }) {
  return (
    <Link
      as={NextLink}
      href={href}
      px={4}
      py={2}
      rounded="lg"
      fontWeight="500"
      fontSize="sm"
      color={isActive ? "brand.600" : useColorModeValue("gray.600", "gray.300")}
      bg={isActive ? useColorModeValue("brand.50", "brand.900") : "transparent"}
      _hover={{
        textDecoration: "none",
        color: useColorModeValue("brand.600", "brand.300"),
        bg: useColorModeValue("brand.50", "brand.900"),
        transform: "translateY(-1px)",
      }}
      transition="all 0.2s ease"
    >
      {children}
    </Link>
  );
}

export default function Nav({ user }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const supabase = createClient();
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
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
          setAvatarUrl(data.avatar);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <Box
      bg={useColorModeValue("white/80", "gray.900/80")}
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      position="sticky"
      top={0}
      zIndex={1000}
      px={{ base: 4, md: 6 }}
      py={{ base: 3, md: 4 }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Logo and Brand */}
        <HStack spacing={{ base: 4, md: 8 }}>
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={{ base: 2, md: 3 }}>
              <Box
                w={{ base: 8, md: 10 }}
                h={{ base: 8, md: 10 }}
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
              >
                MM
              </Box>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                bgGradient="linear(to-r, brand.500, purple.500)"
                bgClip="text"
                letterSpacing="-0.5px"
                display={{ base: "none", sm: "block" }}
              >
                Mind Matrix
              </Text>
            </HStack>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <HStack spacing={1} display={{ base: "none", md: "flex" }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/create">Create</NavLink>
          </HStack>
        </HStack>

        {/* Right side actions */}
        <HStack spacing={{ base: 2, md: 4 }}>
          {/* Theme toggle - hidden on smaller screens */}
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            borderRadius="lg"
            display={{ base: "none", sm: "flex" }}
          />

          {/* User menu or auth buttons */}
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                p={1}
                borderRadius="full"
                _hover={{ bg: "gray.100" }}
                _dark={{ _hover: { bg: "gray.700" } }}
              >
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    src={avatarUrl}
                    name={fullname || username}
                    border="2px solid"
                    borderColor="brand.200"
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    display={{ base: "none", md: "block" }}
                  >
                    {username}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList
                borderRadius="xl"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                boxShadow="xl"
                py={4}
                minW="200px"
                maxW="250px"
              >
                <Box px={4} pb={3}>
                  <HStack spacing={3}>
                    <Avatar
                      size="md"
                      src={avatarUrl}
                      name={fullname || username}
                    />
                    <Box>
                      <Text fontWeight="600" fontSize="sm">
                        {fullname}
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        @{username}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Divider />
                <Box py={2}>
                  <MenuItem
                    as={NextLink}
                    href={`/user/?username=${username}`}
                    borderRadius="md"
                  >
                    👾 Your Games
                  </MenuItem>
                  <MenuItem as={NextLink} href="/account" borderRadius="md">
                    ⚙️ Settings
                  </MenuItem>
                </Box>
                <Divider />
                <Box py={2}>
                  <form action="/auth/signout" method="post">
                    <MenuItem
                      type="submit"
                      borderRadius="md"
                      color="red.500"
                      _hover={{
                        bg: useColorModeValue("red.50", "red.900"),
                        color: useColorModeValue("red.600", "red.300"),
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </form>
                </Box>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={{ base: 2, md: 3 }}>
              <Button
                as={NextLink}
                href="/login"
                variant="ghost"
                size="sm"
                fontWeight="500"
                display={{ base: "none", sm: "flex" }}
              >
                Sign In
              </Button>
              <Button
                as={NextLink}
                href="/register"
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                color="white"
                size="sm"
                fontWeight="600"
                borderRadius="12px"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease"
              >
                <Text display={{ base: "none", sm: "block" }}>Get Started</Text>
                <Text display={{ base: "block", sm: "none" }}>Join</Text>
              </Button>
            </HStack>
          )}

          {/* Mobile menu trigger */}
          <Box display={{ base: "block", md: "none" }}>
            <Drawer user={user} />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
}
