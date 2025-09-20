"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Table,
  Textarea,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Avatar,
  Divider,
  useColorModeValue,
  Icon,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  NumberInput,
  NumberInputField,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
} from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";
import {
  createRating,
  getGame,
  getRatings,
  getScoreboard,
} from "@/services/apiService";

function Scoreboard({ scores }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const sortedScores = scores
    .filter((score) => score.details) // Only show scores with completion times
    .sort((a, b) => {
      // Parse time strings and sort by fastest completion (lowest time first)
      const parseTime = (timeStr) => {
        if (!timeStr) return Infinity;
        // Handle various time formats: "X seconds", "X sec", or just "X"
        const match = timeStr.toString().match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : Infinity;
      };

      const timeA = parseTime(a.details);
      const timeB = parseTime(b.details);

      // Sort ascending (lowest time = fastest = best = first place)
      return timeA - timeB;
    });

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
    >
      <CardHeader pb={3}>
        <HStack spacing={3}>
          <Box
            w={10}
            h={10}
            bg="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="lg"
          >
            🏆
          </Box>
          <VStack align="start" spacing={0}>
            <Heading
              size="lg"
              fontWeight="700"
              color="gray.900"
              _dark={{ color: "white" }}
            >
              Leaderboard
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Top performers
            </Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        {sortedScores.length === 0 ? (
          <VStack spacing={4} py={8} textAlign="center">
            <Text fontSize="lg" color="gray.500">
              🎯 No scores yet!
            </Text>
            <Text fontSize="sm" color="gray.400">
              Be the first to complete this game
            </Text>
          </VStack>
        ) : (
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th color="gray.600" fontSize="xs" fontWeight="600">
                    Rank
                  </Th>
                  <Th color="gray.600" fontSize="xs" fontWeight="600">
                    Player
                  </Th>
                  <Th color="gray.600" fontSize="xs" fontWeight="600">
                    Time
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedScores.map((score, index) => (
                  <Tr
                    key={score.id}
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                  >
                    <Td>
                      <HStack spacing={2}>
                        {index === 0 && <Text fontSize="lg">🥇</Text>}
                        {index === 1 && <Text fontSize="lg">🥈</Text>}
                        {index === 2 && <Text fontSize="lg">🥉</Text>}
                        <Text
                          fontWeight="600"
                          color={index < 3 ? "brand.600" : "gray.700"}
                          _dark={{
                            color: index < 3 ? "brand.300" : "gray.300",
                          }}
                        >
                          #{index + 1}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={score.profiles.username} />
                        <Text
                          fontWeight="500"
                          color="gray.700"
                          _dark={{ color: "gray.300" }}
                        >
                          {score.profiles.username}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={(() => {
                          if (index === 0) return "yellow";
                          if (index === 1) return "gray";
                          if (index === 2) return "orange";
                          return "blue";
                        })()}
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="lg"
                        fontWeight="600"
                      >
                        {score.details?.includes("second")
                          ? score.details
                          : `${score.details} sec`}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </CardBody>
    </Card>
  );
}

function Ratings({ ratings }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const sortedRatings = ratings.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  ); // Sort by newest reviews first

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
          ratings.length
        ).toFixed(1)
      : 0;

  const renderStars = (rating) => {
    const stars = [];
    const numRating = Math.round(parseFloat(rating)); // Round to nearest whole number
    for (let i = 1; i <= numRating; i++) {
      stars.push(
        <Text key={i} as="span" color="yellow.400" fontSize="lg">
          ⭐
        </Text>,
      );
    }
    return stars;
  };

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
    >
      <CardHeader pb={3}>
        <HStack justify="space-between" align="start">
          <HStack spacing={3}>
            <Box
              w={10}
              h={10}
              bg="linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="lg"
            >
              ⭐
            </Box>
            <VStack align="start" spacing={0}>
              <Heading
                size="lg"
                fontWeight="700"
                color="gray.900"
                _dark={{ color: "white" }}
              >
                Reviews & Ratings
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Community feedback
              </Text>
            </VStack>
          </HStack>
          {ratings.length > 0 && (
            <VStack spacing={1} align="end">
              <HStack spacing={1}>{renderStars(averageRating)}</HStack>
              <Text fontSize="sm" fontWeight="600" color="gray.600">
                {averageRating}/5 ({ratings.length} review
                {ratings.length !== 1 ? "s" : ""})
              </Text>
            </VStack>
          )}
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        {sortedRatings.length === 0 ? (
          <VStack spacing={4} py={8} textAlign="center">
            <Text fontSize="lg" color="gray.500">
              💭 No reviews yet!
            </Text>
            <Text fontSize="sm" color="gray.400">
              Be the first to share your thoughts
            </Text>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            {sortedRatings.map((rating) => (
              <Box
                key={rating.id}
                p={4}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.100", "gray.600")}
              >
                <HStack justify="space-between" align="start" mb={3}>
                  <HStack spacing={3}>
                    <Avatar size="sm" name={rating.profiles.username} />
                    <VStack align="start" spacing={0}>
                      <Text
                        fontWeight="600"
                        fontSize="sm"
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                      >
                        {rating.profiles.username}
                      </Text>
                      <HStack spacing={1}>{renderStars(rating.rating)}</HStack>
                    </VStack>
                  </HStack>
                  <Badge
                    colorScheme={(() => {
                      if (rating.rating >= 4) return "green";
                      if (rating.rating >= 3) return "yellow";
                      return "red";
                    })()}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="lg"
                    fontWeight="600"
                  >
                    {rating.rating}/5
                  </Badge>
                </HStack>
                {rating.comment && (
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                    lineHeight="1.5"
                  >
                    &quot;{rating.comment}&quot;
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}

function CreateRating({
  user,
  callCreateRating,
  rating,
  setRating,
  comment,
  setComment,
  ratingCreated,
}) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!user) {
    return (
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
      >
        <CardBody>
          <VStack spacing={4} textAlign="center" py={6}>
            <Text fontSize="lg" color="gray.500">
              🔐 Sign in to leave a review
            </Text>
            <Button
              as={Link}
              href="/login"
              bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
              color="white"
              size="md"
              fontWeight="600"
              borderRadius="12px"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
              }}
              transition="all 0.2s ease"
            >
              Sign In
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (ratingCreated) {
    return (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="2xl"
        py={8}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Review Submitted!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Thank you for sharing your feedback. Your review helps other players
          discover great games.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
    >
      <CardHeader pb={3}>
        <HStack spacing={3}>
          <Box
            w={10}
            h={10}
            bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="lg"
          >
            ✍️
          </Box>
          <VStack align="start" spacing={0}>
            <Heading
              size="lg"
              fontWeight="700"
              color="gray.900"
              _dark={{ color: "white" }}
            >
              Write a Review
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Share your experience
            </Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              _dark={{ color: "gray.300" }}
              mb={2}
            >
              Rating
            </Text>
            <NumberInput
              value={rating}
              onChange={(value) => setRating(value)}
              min={1}
              max={5}
              precision={0}
            >
              <NumberInputField
                placeholder="Rate from 1-5 stars"
                borderRadius="lg"
                bg={useColorModeValue("gray.50", "gray.700")}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                  bg: useColorModeValue("white", "gray.600"),
                }}
              />
            </NumberInput>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              _dark={{ color: "gray.300" }}
              mb={2}
            >
              Review (Optional)
            </Text>
            <Textarea
              placeholder="Tell other players what you thought about this game..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              borderRadius="lg"
              bg={useColorModeValue("gray.50", "gray.700")}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                bg: useColorModeValue("white", "gray.600"),
              }}
              resize="vertical"
            />
          </Box>

          <Button
            onClick={callCreateRating}
            bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
            color="white"
            size="lg"
            fontWeight="600"
            borderRadius="12px"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s ease"
            isDisabled={!rating || rating < 1 || rating > 5}
          >
            Submit Review
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default function GameDetailsPage({ params: { slug } }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [ratingCreated, setRatingCreated] = useState(false);

  const callCreateRating = useCallback(() => {
    createRating(slug, game.id, rating, comment).then((res) => {
      if (res.success) {
        setRatingCreated(true);

        getRatings(slug)
          .then((ratingsRes) => {
            if (ratingsRes.success) {
              setRatings(ratingsRes.data);
            } else {
              console.error(ratingsRes);
            }
          })
          .catch((e) => {
            console.error(e);
            router.push("/error");
          });
      } else {
        console.error(res.message);
      }
    });
  }, [game, rating, comment]);

  useEffect(() => {
    getGame(slug)
      .then((res) => {
        if (res.success) {
          if (res.count > 0) {
            setGame(res.data[0]);

            getScoreboard(slug)
              .then((scoreboardRes) => {
                if (scoreboardRes.success) {
                  setScores(scoreboardRes.data);
                } else {
                  console.error(scoreboardRes);
                }
              })
              .catch((e) => {
                console.error(e);
                router.push("/error");
              });

            getRatings(slug)
              .then((ratingsRes) => {
                if (ratingsRes.success) {
                  setRatings(ratingsRes.data);
                } else {
                  console.error(ratingsRes);
                }
              })
              .catch((e) => {
                console.error(e);
                router.push("/error");
              });
          }
        } else {
          console.error(res);
        }

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        router.push("/error");
      });
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { user: _user },
      } = await supabase.auth.getUser();

      setUser(_user);
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!ratings) {
      return;
    }
    ratings.forEach((_rating) => {
      if (_rating.profiles.id === user.id) {
        setRatingCreated(true);
      }
    });
  }, [user, ratings]);

  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
  );

  if (loading) {
    return (
      <Box minH="100vh" pt={8}>
        <Container maxW="7xl" py={16}>
          <Center>
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Loading game details...
              </Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box minH="100vh" pt={8}>
        <Container maxW="7xl" py={16}>
          <Center>
            <VStack spacing={6} textAlign="center">
              <Text fontSize="6xl">🎮</Text>
              <Heading size="lg" color="gray.700" _dark={{ color: "gray.300" }}>
                Game Not Found
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                The game you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </Text>
              <Button
                as={Link}
                href="/gallery"
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                color="white"
                size="lg"
                fontWeight="600"
                borderRadius="12px"
              >
                Browse Games
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bg={heroBg}
        color="white"
        py={{ base: 16, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <Badge
              bg="white/20"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
            >
              🎮 Game Details
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="800"
              textAlign="center"
              letterSpacing="-1px"
            >
              {game.name}
            </Heading>
            {game.description && (
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                textAlign="center"
                maxW="3xl"
                opacity={0.9}
                lineHeight="tall"
              >
                {game.description}
              </Text>
            )}
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Badge
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                color="white"
                px={4}
                py={2}
                borderRadius="lg"
                fontWeight="600"
                fontSize="sm"
              >
                {game.type}
              </Badge>
              {game.profiles && (
                <HStack
                  spacing={2}
                  bg="white/10"
                  px={4}
                  py={2}
                  borderRadius="lg"
                >
                  <Avatar
                    size="xs"
                    src={game.profiles.avatar}
                    name={game.profiles.username}
                  />
                  <Text fontSize="sm" fontWeight="500">
                    by {game.profiles.username}
                  </Text>
                </HStack>
              )}
            </HStack>
            <Button
              onClick={() => router.push(`/g/${slug}`)}
              size="lg"
              bg="white"
              color="brand.600"
              fontWeight="700"
              borderRadius="12px"
              px={8}
              _hover={{
                bg: "gray.100",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 30px rgba(255, 255, 255, 0.3)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              🎯 Play Now
            </Button>
          </VStack>
        </Container>

        {/* Background decoration */}
        <Box
          position="absolute"
          top="-50%"
          right="-20%"
          w="80%"
          h="200%"
          bg="white/5"
          borderRadius="50%"
          filter="blur(100px)"
        />
      </Box>

      {/* Content Section */}
      <Box py={16} px={6}>
        <Container maxW="7xl">
          <VStack spacing={12} align="stretch">
            {/* Scoreboard */}
            {scores && <Scoreboard scores={scores} />}

            {/* Ratings */}
            <Ratings ratings={ratings} />

            {/* Create Rating */}
            <CreateRating
              user={user}
              callCreateRating={callCreateRating}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              ratingCreated={ratingCreated}
            />
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
