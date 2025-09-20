"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  TimeIcon,
  CheckCircleIcon,
  WarningIcon,
  ArrowBackIcon,
  InfoIcon,
  TriangleUpIcon as PlayIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import createClient from "@/utils/supabase/client";
import { getGame, updateScoreboard } from "@/services/apiService";

// Modern Riddle Game Component
function Riddle({ question, answer, saveToScoreboard, gameName }) {
  const router = useRouter();
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [timer, setTimer] = useState(60);
  const [stopTimer, setStop] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  function checkAnswer() {
    if (guess.toLowerCase().trim() === answer.toLowerCase().trim()) {
      setResult("correct");
      setStop(true);
      saveToScoreboard(timer);
    } else {
      setResult("incorrect");
      setTimeout(() => setResult(""), 2000);
    }
  }

  useEffect(() => {
    if (!stopTimer && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [stopTimer, timer]);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    if (timer === 0 && !stopTimer) {
      setResult("timeout");
      setStop(true);
    }
  }, [timer, stopTimer]);

  const getTimerColor = () => {
    if (timer > 30) return "green";
    if (timer > 15) return "yellow";
    return "red";
  };

  if (result === "correct") {
    return (
      <Container maxW="4xl" py={8}>
        <Card
          bg={cardBg}
          borderColor="green.200"
          borderWidth="2px"
          borderRadius="2xl"
        >
          <CardBody p={8} textAlign="center">
            <VStack spacing={6}>
              <Icon as={CheckCircleIcon} w={16} h={16} color="green.500" />
              <Heading size="lg" color="green.600">
                Congratulations! 🎉
              </Heading>
              <Text fontSize="lg" color="gray.600">
                You solved "{gameName}" in {formatTime(60 - timer)}!
              </Text>
              <HStack spacing={4}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  onClick={() => router.back()}
                  variant="outline"
                >
                  Go Back
                </Button>
                <Button
                  as={Link}
                  href="/gallery"
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                >
                  Play More Games
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (result === "timeout") {
    return (
      <Container maxW="4xl" py={8}>
        <Card
          bg={cardBg}
          borderColor="red.200"
          borderWidth="2px"
          borderRadius="2xl"
        >
          <CardBody p={8} textAlign="center">
            <VStack spacing={6}>
              <Icon as={TimeIcon} w={16} h={16} color="red.500" />
              <Heading size="lg" color="red.600">
                Time&apos;s Up! ⏰
              </Heading>
              <Text fontSize="lg" color="gray.600">
                The answer was:{" "}
                <Text as="span" fontWeight="bold" color="brand.600">
                  {answer}
                </Text>
              </Text>
              <Text fontSize="md" color="gray.500">
                You&apos;ll get it next time!
              </Text>
              <HStack spacing={4}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  onClick={() => router.back()}
                  variant="outline"
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                >
                  Try Again
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        {/* Main Game Area */}
        <GridItem>
          <Card
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="2xl"
          >
            <CardBody p={8}>
              <VStack spacing={8}>
                {/* Game Header */}
                <VStack spacing={4} textAlign="center">
                  <Badge
                    bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    color="white"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontWeight="600"
                  >
                    Riddle Challenge
                  </Badge>
                  <Heading
                    size="lg"
                    color="gray.900"
                    _dark={{ color: "white" }}
                    textAlign="center"
                  >
                    {question}
                  </Heading>
                </VStack>

                {/* Timer Display */}
                <Box textAlign="center">
                  <CircularProgress
                    value={(timer / 60) * 100}
                    color={getTimerColor()}
                    size="120px"
                    thickness="8px"
                  >
                    <CircularProgressLabel fontSize="lg" fontWeight="bold">
                      {formatTime(timer)}
                    </CircularProgressLabel>
                  </CircularProgress>
                </Box>

                {/* Answer Input */}
                <VStack spacing={4} w="full" maxW="md">
                  <Input
                    type="text"
                    placeholder="Enter your answer..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    size="lg"
                    borderRadius="xl"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    border="2px solid"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                  />
                  <Button
                    onClick={checkAnswer}
                    bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    color="white"
                    size="lg"
                    w="full"
                    isDisabled={!guess.trim() || stopTimer}
                    borderRadius="12px"
                    fontWeight="600"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s ease"
                  >
                    Submit Answer
                  </Button>
                </VStack>

                {/* Result Display */}
                {result === "incorrect" && (
                  <Alert status="error" borderRadius="xl">
                    <AlertIcon />
                    <AlertTitle>Incorrect!</AlertTitle>
                    <AlertDescription>
                      Try again, you've got this!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Hint Section */}
                {/* <Box w="full">
                  <Button
                    leftIcon={<InfoIcon />}
                    onClick={() => setShowHint(!showHint)}
                    variant="ghost"
                    size="sm"
                    color="gray.500"
                  >
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </Button>
                  {showHint && (
                    <Box
                      mt={4}
                      p={4}
                      bg={useColorModeValue("yellow.50", "yellow.900")}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={useColorModeValue(
                        "yellow.200",
                        "yellow.700",
                      )}
                    >
                      <Text
                        fontSize="sm"
                        color="yellow.800"
                        _dark={{ color: "yellow.200" }}
                      >
                        💡 Think about words that rhyme or have similar
                        meanings!
                      </Text>
                    </Box>
                  )}
                </Box> */}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Sidebar */}
        <GridItem>
          <VStack spacing={6}>
            {/* Game Info */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              borderWidth="1px"
              borderRadius="xl"
              w="full"
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Game Info</Heading>
                  <Divider />
                  <VStack spacing={3} align="start" w="full">
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        Time Limit:
                      </Text>
                      <Text fontSize="sm" fontWeight="500">
                        60 seconds
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        Difficulty:
                      </Text>
                      <Badge colorScheme="orange" size="sm">
                        Medium
                      </Badge>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              borderWidth="1px"
              borderRadius="xl"
              w="full"
            >
              <CardBody p={6}>
                <VStack spacing={4}>
                  <Heading size="md">Quick Actions</Heading>
                  <Divider />
                  <VStack spacing={3} w="full">
                    <Button
                      leftIcon={<ArrowBackIcon />}
                      onClick={() => router.back()}
                      variant="outline"
                      size="sm"
                      w="full"
                    >
                      Go Back
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="ghost"
                      size="sm"
                      w="full"
                    >
                      Restart Game
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}

// render correct component for the type of game
function SelectGameType({ type, game, saveToScoreboard, gameName }) {
  switch (type) {
    case "riddle":
    case "math": // Handle math games the same as riddles
      return (
        <Riddle
          question={game.question}
          answer={game.answer}
          saveToScoreboard={saveToScoreboard}
          gameName={gameName}
        />
      );

    // unimplemented game types
    case "":
    default:
      return (
        <Container maxW="4xl" py={20}>
          <Card borderColor="red.200" borderWidth="2px" borderRadius="2xl">
            <CardBody p={8} textAlign="center">
              <VStack spacing={6}>
                <Icon as={WarningIcon} w={16} h={16} color="red.500" />
                <Heading size="lg" color="red.600">
                  Game Type Not Supported
                </Heading>
                <Text color="gray.600">
                  This game type is not yet implemented. Please try another
                  game.
                </Text>
                <Button
                  as={Link}
                  href="/gallery"
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                >
                  Browse Other Games
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      );
  }
}

export default function GamePage({ params: { slug } }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  // on page load, call API to get game details from slug (game's url tag)
  useEffect(() => {
    getGame(slug)
      .then((res) => {
        if (res.success) {
          if (res.count > 0) {
            setGame(res.data[0]);
          } else {
            setError("Game not found");
          }
        } else {
          setError(res.message || "Failed to load game");
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Network error occurred");
        setLoading(false);
      });
  }, [slug]);

  // function that calls API service to update scoreboard
  const saveToScoreboard = useCallback(
    async (timer) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          return;
        }

        const res = await updateScoreboard(slug, game.id, 60 - timer);
        if (!res.success) {
          console.error(res.message);
        }
      } catch (err) {
        console.error("Error saving to scoreboard:", err);
      }
    },
    [game, slug, supabase],
  );

  if (loading) {
    return (
      <Container maxW="4xl" py={20}>
        <Card borderRadius="2xl">
          <CardBody p={8} textAlign="center">
            <VStack spacing={6}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Heading size="lg" color="gray.600">
                Loading Game...
              </Heading>
              <Text color="gray.500">Preparing your gaming experience</Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="4xl" py={20}>
        <Card borderColor="red.200" borderWidth="2px" borderRadius="2xl">
          <CardBody p={8} textAlign="center">
            <VStack spacing={6}>
              <Icon as={WarningIcon} w={16} h={16} color="red.500" />
              <Heading size="lg" color="red.600">
                Oops! Something went wrong
              </Heading>
              <Text color="gray.600">{error}</Text>
              <HStack spacing={4}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  onClick={() => router.back()}
                  variant="outline"
                >
                  Go Back
                </Button>
                <Button
                  as={Link}
                  href="/gallery"
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                >
                  Browse Games
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Box minH="100vh" pt={8}>
      {/* Game Header */}
      <Container maxW="4xl" mb={8}>
        <VStack spacing={4} textAlign="center">
          <Badge
            colorScheme="brand"
            variant="subtle"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
          >
            🎮 Now Playing
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="800"
            color="gray.900"
            _dark={{ color: "white" }}
          >
            {game.name}
          </Heading>
          {game.description && (
            <Text
              fontSize="lg"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="center"
              maxW="2xl"
            >
              {game.description}
            </Text>
          )}
          <HStack spacing={4}>
            <Button
              as={Link}
              href={`/g/${slug}/details`}
              leftIcon={<InfoIcon />}
              variant="outline"
              size="sm"
            >
              Game Details
            </Button>
            <Badge
              bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
              color="white"
              px={3}
              py={1}
              borderRadius="8px"
              fontWeight="600"
            >
              {game.type}
            </Badge>
          </HStack>
        </VStack>
      </Container>

      {/* Game Content */}
      {SelectGameType({
        type: game.type,
        game: JSON.parse(game.details),
        saveToScoreboard,
        gameName: game.name,
      })}
    </Box>
  );
}
