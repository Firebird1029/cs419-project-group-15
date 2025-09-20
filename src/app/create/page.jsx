"use client";

// TODO add enter key to submit form handlers

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Heading,
  Input,
  Select,
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Grid,
  GridItem,
  Textarea,
} from "@chakra-ui/react";
import { createGame } from "@/services/apiService";
import createClient from "@/utils/supabase/client";

// Riddle Type Game Configuration
// riddles consist of two settings: question and answer
function NewRiddle({ setGameDetails, setGameDetailsReady }) {
  const [userQuestion, setUserQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    // notify parent component CreateNewGamePage that form is submittable (enable Create button)
    setGameDetails({ question: userQuestion, answer: userAnswer });
    setGameDetailsReady(userQuestion && userAnswer);
  }, [userQuestion, userAnswer]);

  useEffect(() => {
    // reset game configuration state when component is unmounted
    return () => {
      setGameDetails({});
      setGameDetailsReady(false);
    };
  }, []);

  return (
    <Card
      bg={useColorModeValue("white", "gray.800")}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
    >
      <CardHeader pb={3}>
        <HStack spacing={3}>
          <Box
            w={10}
            h={10}
            bg="linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="lg"
          >
            🧩
          </Box>
          <VStack align="start" spacing={0}>
            <Heading
              size="md"
              fontWeight="700"
              color={useColorModeValue("gray.900", "white")}
            >
              Riddle Configuration
            </Heading>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Set up your riddle question and answer
            </Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel
              fontWeight="600"
              color={useColorModeValue("gray.700", "gray.200")}
            >
              Riddle Question
            </FormLabel>
            <Textarea
              placeholder="Enter your riddle question here..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              borderRadius="lg"
              rows={3}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            <FormHelperText>
              Make it challenging but solvable! This is what players will see.
            </FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel
              fontWeight="600"
              color={useColorModeValue("gray.700", "gray.200")}
            >
              Correct Answer
            </FormLabel>
            <Input
              placeholder="Enter the answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              borderRadius="lg"
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            <FormHelperText>
              Keep it simple and clear. Players need to match this exactly.
            </FormHelperText>
          </FormControl>

          {userQuestion && userAnswer && (
            <Alert
              status="success"
              borderRadius="lg"
              bg={useColorModeValue("green.50", "green.900")}
            >
              <AlertIcon />
              <Text fontSize="sm">
                Great! Your riddle is ready to challenge players.
              </Text>
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

// display correct configuration for selected game type
function SelectGameQuestions({ type, setGameDetails, setGameDetailsReady }) {
  switch (type) {
    // Riddle Type Game
    case "riddle":
      return (
        <NewRiddle
          setGameDetails={setGameDetails}
          setGameDetailsReady={setGameDetailsReady}
        />
      );

    // Unimplemented Game Types (should never be reached)
    default:
      return "";
  }
}

export default function CreateNewGamePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameDetails, setGameDetails] = useState({});
  const [gameDetailsReady, setGameDetailsReady] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Ensure user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleCreateGame = async () => {
    setIsCreating(true);
    setCreateError("");

    try {
      // call API service to create new game
      const res = await createGame({
        name: gameName,
        type: gameType,
        description: gameDescription,
        details: JSON.stringify(gameDetails),
      });

      if (res.success) {
        // redirect user to newly-created game
        router.push(`/g/${res.data[0].url_tag}`);
      } else {
        setCreateError(
          res.message || "Failed to create game. Please try again.",
        );
      }
    } catch (error) {
      setCreateError("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg={useColorModeValue("gray.50", "gray.900")}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            Loading...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="4xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        {/* Header Section */}
        <VStack spacing={6} mb={10}>
          <Badge
            colorScheme="brand"
            variant="subtle"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
          >
            ✨ Create New Game
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="800"
            textAlign="center"
            color={useColorModeValue("gray.900", "white")}
            letterSpacing="-1px"
          >
            Bring Your Ideas to Life
          </Heading>
          <Text
            fontSize="lg"
            color={useColorModeValue("gray.600", "gray.400")}
            textAlign="center"
            maxW="2xl"
          >
            Create engaging games that challenge minds and bring joy to players
            around the world!
          </Text>
        </VStack>

        {/* Error Alert */}
        {createError && (
          <Alert status="error" borderRadius="lg" mb={6}>
            <AlertIcon />
            <Text>{createError}</Text>
          </Alert>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          {/* Game Information */}
          <GridItem>
            <Card
              bg={useColorModeValue("white", "gray.800")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
            >
              <CardHeader pb={3}>
                <HStack spacing={3}>
                  <Box
                    w={10}
                    h={10}
                    bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    🎮
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Heading
                      size="md"
                      fontWeight="700"
                      color={useColorModeValue("gray.900", "white")}
                    >
                      Game Information
                    </Heading>
                    <Text
                      fontSize="sm"
                      color={useColorModeValue("gray.600", "gray.400")}
                    >
                      Basic details about your game
                    </Text>
                  </VStack>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={6} align="stretch">
                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="600"
                      color={useColorModeValue("gray.700", "gray.200")}
                    >
                      Game Name
                    </FormLabel>
                    <Input
                      placeholder="Enter a catchy game name..."
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      borderRadius="lg"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    <FormHelperText>
                      Choose something memorable and exciting!
                    </FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="600"
                      color={useColorModeValue("gray.700", "gray.200")}
                    >
                      Game Description
                    </FormLabel>
                    <Textarea
                      placeholder="Describe what makes your game special..."
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      borderRadius="lg"
                      rows={3}
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    <FormHelperText>
                      Help players understand what they're getting into.
                    </FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      fontWeight="600"
                      color={useColorModeValue("gray.700", "gray.200")}
                    >
                      Game Type
                    </FormLabel>
                    <Select
                      placeholder="Choose your game type..."
                      value={gameType}
                      onChange={(e) => setGameType(e.target.value)}
                      borderRadius="lg"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    >
                      <option value="riddle">🧩 Riddle</option>
                    </Select>
                    <FormHelperText>
                      More game types coming soon!
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Game Configuration */}
          <GridItem>
            {gameType ? (
              <SelectGameQuestions
                type={gameType}
                setGameDetails={setGameDetails}
                setGameDetailsReady={setGameDetailsReady}
              />
            ) : (
              <Card
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={useColorModeValue("gray.200", "gray.600")}
                borderWidth="2px"
                borderStyle="dashed"
                borderRadius="xl"
                p={8}
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Text fontSize="4xl" opacity={0.5}>
                    🎯
                  </Text>
                  <VStack spacing={2}>
                    <Text
                      fontSize="lg"
                      fontWeight="600"
                      color={useColorModeValue("gray.600", "gray.400")}
                    >
                      Select a Game Type
                    </Text>
                    <Text
                      fontSize="sm"
                      color={useColorModeValue("gray.500", "gray.500")}
                    >
                      Choose a game type to configure your game settings
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            )}
          </GridItem>
        </Grid>

        {/* Create Button */}
        <Box mt={10} textAlign="center">
          <Button
            bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
            color="white"
            size="lg"
            fontWeight="600"
            borderRadius="xl"
            px={12}
            py={6}
            fontSize="lg"
            isDisabled={!gameName || !gameType || !gameDetailsReady}
            isLoading={isCreating}
            loadingText="Creating Game..."
            onClick={handleCreateGame}
            _hover={{
              transform:
                !gameName || !gameType || !gameDetailsReady
                  ? "none"
                  : "translateY(-2px)",
              boxShadow:
                !gameName || !gameType || !gameDetailsReady
                  ? "none"
                  : "0 20px 40px rgba(59, 130, 246, 0.3)",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s ease"
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
            }}
          >
            {isCreating ? (
              <HStack>
                <Spinner size="sm" />
                <Text>Creating Your Game...</Text>
              </HStack>
            ) : (
              "🚀 Create Game"
            )}
          </Button>

          {(!gameName || !gameType || !gameDetailsReady) && (
            <Text
              mt={3}
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Complete all fields to create your game
            </Text>
          )}
        </Box>
      </Container>
    </Box>
  );
}
