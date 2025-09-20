"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container maxW="7xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          {/* Main Footer Content */}
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 8, md: 12 }}
            justify="space-between"
            align={{ base: "center", md: "flex-start" }}
            w="full"
            textAlign={{ base: "center", md: "left" }}
          >
            {/* Brand Section */}
            <VStack spacing={4} align={{ base: "center", md: "flex-start" }}>
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
              <Text
                fontSize="sm"
                maxW="250px"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Challenge your mind with engaging games and puzzles created by
                our community.
              </Text>
            </VStack>

            {/* Navigation Links */}
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 6, sm: 12 }}
            >
              <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                <Text fontWeight="600" fontSize="sm">
                  Platform
                </Text>
                <VStack
                  spacing={2}
                  align={{ base: "center", md: "flex-start" }}
                >
                  <Text
                    as={NextLink}
                    href="/gallery"
                    fontSize="sm"
                    _hover={{ color: "brand.500" }}
                    transition="color 0.2s"
                  >
                    Game Gallery
                  </Text>
                  <Text
                    as={NextLink}
                    href="/create"
                    fontSize="sm"
                    _hover={{ color: "brand.500" }}
                    transition="color 0.2s"
                  >
                    Create Game
                  </Text>
                </VStack>
              </VStack>

              <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                <Text fontWeight="600" fontSize="sm">
                  Account
                </Text>
                <VStack
                  spacing={2}
                  align={{ base: "center", md: "flex-start" }}
                >
                  <Text
                    as={NextLink}
                    href="/login"
                    fontSize="sm"
                    _hover={{ color: "brand.500" }}
                    transition="color 0.2s"
                  >
                    Sign In
                  </Text>
                  <Text
                    as={NextLink}
                    href="/register"
                    fontSize="sm"
                    _hover={{ color: "brand.500" }}
                    transition="color 0.2s"
                  >
                    Get Started
                  </Text>
                </VStack>
              </VStack>
            </Stack>
          </Stack>

          <Divider />

          {/* Bottom Section */}
          <Box w="full" textAlign="center">
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              © 2023 Mind Matrix.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
