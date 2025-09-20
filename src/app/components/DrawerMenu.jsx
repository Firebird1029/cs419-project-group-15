"use client";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  Button,
  IconButton,
  Box,
  Link,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, BellIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import React, { useCallback, useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import createClient from "@/utils/supabase/client";

export default function DrawerMenu({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement] = React.useState("left");
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const supabase = createClient();

  const getProfile = useCallback(async () => {
    if (user) {
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`full_name, username, avatar`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setFullname(data.full_name);
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

  // Stretch TODO: Read which page and initialFocusRef={rightbutton} based on page

  return (
    <>
      <IconButton
        aria-label="Menu Options"
        icon={<HamburgerIcon />}
        variant="ghost"
        size="sm"
        borderRadius="lg"
        onClick={onOpen}
      />
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            pb={4}
          >
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize="sm"
              >
                MM
              </Box>
              <Text
                fontSize="lg"
                fontWeight="700"
                bgGradient="linear(to-r, brand.500, purple.500)"
                bgClip="text"
              >
                Mind Matrix
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody py={4}>
            <VStack spacing={4} align="stretch">
              {/* User Profile Section (if logged in) */}
              {user && (
                <>
                  <Box
                    p={4}
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.700")}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        size="md"
                        src={avatarUrl}
                        name={fullname || username}
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">
                          {fullname || username}
                        </Text>
                        <Text color="gray.500" fontSize="xs">
                          @{username}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                  <Divider />
                </>
              )}

              {/* Navigation Links */}
              <VStack spacing={2} align="stretch">
                <Link as={NextLink} href="/" onClick={onClose}>
                  <Button
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<Text fontSize="lg">🏠</Text>}
                    borderRadius="lg"
                    _hover={{
                      bg: useColorModeValue("brand.50", "brand.900"),
                      color: "brand.600",
                    }}
                  >
                    Home
                  </Button>
                </Link>

                <Link as={NextLink} href="/gallery" onClick={onClose}>
                  <Button
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<Text fontSize="lg">🎮</Text>}
                    borderRadius="lg"
                    _hover={{
                      bg: useColorModeValue("brand.50", "brand.900"),
                      color: "brand.600",
                    }}
                  >
                    Game Gallery
                  </Button>
                </Link>

                <Link as={NextLink} href="/create" onClick={onClose}>
                  <Button
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    leftIcon={<Text fontSize="lg">✨</Text>}
                    borderRadius="lg"
                    _hover={{
                      bg: useColorModeValue("brand.50", "brand.900"),
                      color: "brand.600",
                    }}
                  >
                    Create Game
                  </Button>
                </Link>
              </VStack>

              {/* User Menu Items (if logged in) */}
              {user && (
                <>
                  <Divider />
                  <VStack spacing={2} align="stretch">
                    <Link
                      as={NextLink}
                      href={`/user/?username=${username}`}
                      onClick={onClose}
                    >
                      <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        leftIcon={<Text fontSize="lg">👾</Text>}
                        borderRadius="lg"
                        size="sm"
                      >
                        Your Games
                      </Button>
                    </Link>

                    <Link as={NextLink} href="/account" onClick={onClose}>
                      <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        leftIcon={<Text fontSize="lg">⚙️</Text>}
                        borderRadius="lg"
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Link>

                  </VStack>
                </>
              )}

              {/* Action Buttons */}
              <Divider />
              <VStack spacing={3} align="stretch">
                {/* Quick Actions */}
                <HStack spacing={3}>
                  {user && (
                    <IconButton
                      aria-label="Notifications"
                      icon={<BellIcon />}
                      variant="ghost"
                      size="sm"
                      borderRadius="lg"
                      flex={1}
                    />
                  )}
                  <IconButton
                    aria-label="Toggle theme"
                    icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    size="sm"
                    borderRadius="lg"
                    flex={1}
                  />
                </HStack>

                {/* Auth Buttons (if not logged in) */}
                {!user && (
                  <VStack spacing={2}>
                    <Button
                      as={NextLink}
                      href="/login"
                      variant="ghost"
                      w="full"
                      onClick={onClose}
                    >
                      Sign In
                    </Button>
                    <Button
                      as={NextLink}
                      href="/register"
                      bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      color="white"
                      w="full"
                      borderRadius="lg"
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "lg",
                      }}
                      onClick={onClose}
                    >
                      Get Started
                    </Button>
                  </VStack>
                )}

                {/* Sign Out (if logged in) */}
                {user && (
                  <form action="/auth/signout" method="post">
                    <Button
                      type="submit"
                      variant="ghost"
                      w="full"
                      color="red.500"
                      _hover={{ bg: "red.50", color: "red.600" }}
                      _dark={{ _hover: { bg: "red.900", color: "red.300" } }}
                      borderRadius="lg"
                    >
                      Sign Out
                    </Button>
                  </form>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
