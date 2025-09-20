import React from "react";
import "fontsource-inter/500.css";
import NextLink from "next/link";

// https://codesandbox.io/p/sandbox/chakra-carousel-dd8vn?file=%2Fsrc%2Findex.js
import {
  Button,
  VStack,
  HStack,
  Text,
  Link,
  Avatar,
  Card,
  CardBody,
  Badge,
  Box,
  useColorModeValue,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { capsFirst } from "./utils";

// Modern Game Card Component
function GameCard({ game }) {
  const {
    description,
    name,
    type,
    url_tag: url,
    profiles: { username, avatar },
  } = game;

  return (
    <Card
      bg={useColorModeValue("white", "gray.800")}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
        borderColor: useColorModeValue("brand.200", "brand.600"),
      }}
      h="full"
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch" h="full">
          {/* Game Header */}
          <VStack spacing={2} align="start">
            <HStack justify="space-between" w="full">
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {capsFirst(type)}
              </Badge>
            </HStack>

            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              color={useColorModeValue("gray.900", "white")}
              lineHeight="shorter"
              noOfLines={2}
            >
              {capsFirst(name)}
            </Heading>

            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
              lineHeight="tall"
              noOfLines={3}
              flex={1}
            >
              {capsFirst(description)}
            </Text>
          </VStack>

          {/* Creator Info */}
          <Link
            as={NextLink}
            href={`/user/?username=${username}`}
            _hover={{ textDecoration: "none" }}
          >
            <HStack
              spacing={3}
              p={3}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="lg"
              transition="all 0.2s"
              _hover={{
                bg: useColorModeValue("brand.50", "brand.900"),
                transform: "scale(1.02)",
              }}
            >
              <Avatar src={avatar} size="sm" />
              <VStack spacing={0} align="start" flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color={useColorModeValue("gray.700", "gray.200")}
                >
                  {username}
                </Text>
                <Text
                  fontSize="xs"
                  color={useColorModeValue("gray.500", "gray.400")}
                >
                  Game Creator
                </Text>
              </VStack>
            </HStack>
          </Link>

          {/* Play Button */}
          <Button
            as={Link}
            href={`/g/${url}`}
            bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
            color="white"
            fontWeight="600"
            borderRadius="lg"
            rightIcon={<ArrowForwardIcon />}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s ease"
            w="full"
          >
            Play Now
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default function App({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg={useColorModeValue("gray.50", "gray.700")}
        borderRadius="xl"
        border="2px dashed"
        borderColor={useColorModeValue("gray.200", "gray.600")}
      >
        <VStack spacing={4}>
          <Text fontSize="4xl" opacity={0.5}>
            🎮
          </Text>
          <VStack spacing={2}>
            <Text
              fontSize="lg"
              fontWeight="600"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              No games found
            </Text>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.500")}
            >
              No games have been created yet. Be the first to create one!
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="full">
      {/* Modern Grid Layout for Better Responsiveness */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
        {data.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
