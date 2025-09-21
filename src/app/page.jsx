"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Avatar,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  StarIcon,
  TriangleUpIcon as PlayIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import createClient from "@/utils/supabase/client";

// Fun falling animation component
function FallingElements() {
  const fallingItems = ["🎲", "🎯", "🎪", "🎭", "🎨", "🎵", "💡", "⭐"];

  // Predefined positions to avoid hydration mismatch
  const floatingPositions = [
    { top: "25%", left: "15%", delay: "0s", duration: "6s", scale: "0.9" },
    { top: "45%", left: "75%", delay: "1s", duration: "8s", scale: "1.1" },
    { top: "65%", left: "25%", delay: "2s", duration: "7s", scale: "0.8" },
    { top: "35%", left: "85%", delay: "3s", duration: "9s", scale: "1.0" },
    { top: "75%", left: "60%", delay: "4s", duration: "6s", scale: "0.9" },
    { top: "55%", left: "45%", delay: "5s", duration: "8s", scale: "1.2" },
    { top: "85%", left: "20%", delay: "2.5s", duration: "7s", scale: "0.7" },
    { top: "15%", left: "65%", delay: "1.5s", duration: "9s", scale: "1.0" },
  ];

  const sparklePositions = [
    { top: "20%", left: "30%", delay: "0s", duration: "3s" },
    { top: "80%", left: "70%", delay: "1s", duration: "4s" },
    { top: "50%", left: "10%", delay: "2s", duration: "5s" },
    { top: "30%", left: "90%", delay: "1.5s", duration: "3.5s" },
    { top: "70%", left: "40%", delay: "0.5s", duration: "4.5s" },
    { top: "90%", left: "80%", delay: "2.5s", duration: "3s" },
  ];

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="full"
      h="full"
      overflow="hidden"
      pointerEvents="none"
    >
      {/* Gently floating elements */}
      {floatingPositions.map((pos, i) => (
        <Box
          key={`floating-${pos.top}-${pos.left}`}
          position="absolute"
          top={pos.top}
          left={pos.left}
          animation={`gentleFloat ${pos.duration} ease-in-out infinite`}
          sx={{
            "@keyframes gentleFloat": {
              "0%, 100%": {
                transform: "translateY(0px) translateX(0px) rotate(0deg)",
                opacity: 0.6,
              },
              "25%": {
                transform: "translateY(-10px) translateX(5px) rotate(5deg)",
                opacity: 0.8,
              },
              "50%": {
                transform: "translateY(-5px) translateX(-3px) rotate(-3deg)",
                opacity: 0.7,
              },
              "75%": {
                transform: "translateY(-15px) translateX(8px) rotate(8deg)",
                opacity: 0.9,
              },
            },
          }}
          style={{
            animationDelay: pos.delay,
          }}
        >
          <Text
            fontSize="xl"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            transform={`scale(${pos.scale})`}
          >
            {fallingItems[i % fallingItems.length]}
          </Text>
        </Box>
      ))}

      {/* Subtle background sparkles */}
      {sparklePositions.map((pos) => (
        <Box
          key={`sparkle-${pos.top}-${pos.left}`}
          position="absolute"
          w="3px"
          h="3px"
          bg="white"
          borderRadius="50%"
          top={pos.top}
          left={pos.left}
          animation={`twinkle ${pos.duration} ease-in-out infinite`}
          sx={{
            "@keyframes twinkle": {
              "0%, 100%": { opacity: 0.2, transform: "scale(1)" },
              "50%": { opacity: 0.8, transform: "scale(1.2)" },
            },
          }}
          style={{
            animationDelay: pos.delay,
          }}
        />
      ))}
    </Box>
  );
}

function GameCard({ game }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Link href={`/g/${game.url_tag}`} style={{ textDecoration: "none" }}>
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "xl",
          borderColor: "brand.300",
        }}
        transition="all 0.3s ease"
        cursor="pointer"
      >
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2} flex={1}>
                <Heading
                  size="md"
                  fontWeight="700"
                  color="gray.900"
                  _dark={{ color: "white" }}
                >
                  {game.name}
                </Heading>
                <Badge
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  size="sm"
                  px={3}
                  py={1}
                  borderRadius="8px"
                  fontWeight="600"
                >
                  {game.type}
                </Badge>
              </VStack>
              <Icon as={PlayIcon} w={5} h={5} color="brand.500" />
            </HStack>

            <Link
              href={`/user/?username=${game.profiles?.username}`}
              _hover={{ textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <HStack
                spacing={3}
                p={2}
                borderRadius="lg"
                _hover={{ bg: "gray.50" }}
                _dark={{ _hover: { bg: "gray.700" } }}
              >
                <Avatar
                  size="sm"
                  src={game.profiles?.avatar}
                  name={game.profiles?.username}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    {game.profiles?.username}
                  </Text>
                </VStack>
              </HStack>
            </Link>

            <Button
              bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
              color="white"
              size="sm"
              rightIcon={<ArrowForwardIcon />}
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
              onClick={(e) => e.stopPropagation()}
            >
              Play Now
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}

function StatCard({ number, label, color = "brand" }) {
  return (
    <VStack spacing={1}>
      <Heading
        size="lg"
        bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
        bgClip="text"
        fontWeight="800"
      >
        {number}
      </Heading>
      <Text
        fontSize="sm"
        color="gray.600"
        _dark={{ color: "gray.400" }}
        fontWeight="500"
      >
        {label}
      </Text>
    </VStack>
  );
}

export default function Home() {
  const supabase = createClient();
  const [featuredGames, setFeaturedGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
  );

  const loadGames = useCallback(async () => {
    try {
      const {
        data: allGameData,
        error,
        status,
      } = await supabase
        .from("games")
        .select("*, profiles!inner(username, avatar)")
        .limit(12);

      if (error && status !== 406) {
        throw error;
      }

      if (allGameData) {
        setFeaturedGames(allGameData.slice(0, 6));
        setRecentGames(allGameData.slice(6, 12));
      }
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bg={heroBg}
        color="white"
        py={{ base: 20, md: 32 }}
        position="relative"
        overflow="hidden"
      >
        {/* Falling Elements Animation */}
        <FallingElements />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={12}
            alignItems="center"
          >
            <GridItem>
              <VStack spacing={8} align="start">
                <VStack spacing={4} align="start">
                  <Badge
                    bg="white/20"
                    color="white"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    🎮 Gaming Platform
                  </Badge>
                  <Heading
                    as="h1"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="800"
                    lineHeight="1.1"
                    letterSpacing="-2px"
                  >
                    Challenge Your
                    <br />
                    <Text
                      as="span"
                      bgGradient="linear(to-r, #FFD700, #FFA500)"
                      bgClip="text"
                    >
                      Mind Matrix
                    </Text>
                  </Heading>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    color="white/80"
                    maxW="md"
                    lineHeight="1.6"
                  >
                    Create, share, and play amazing games with our community.
                    Challenge friends, climb leaderboards, and unlock your
                    potential.
                  </Text>
                </VStack>

                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    as={Link}
                    href="/gallery"
                    size="lg"
                    variant="solid"
                    bg="white"
                    color="brand.600"
                    _hover={{
                      bg: "gray.100",
                      transform: "translateY(-2px)",
                    }}
                    rightIcon={<ArrowForwardIcon />}
                    fontWeight="700"
                  >
                    Explore Games
                  </Button>
                  <Button
                    as={Link}
                    href="/create"
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="white/30"
                    _hover={{
                      bg: "white/10",
                      borderColor: "white",
                    }}
                    fontWeight="600"
                  >
                    Create Game
                  </Button>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem display={{ base: "none", lg: "block" }}>
              <Box
                w="full"
                h="400px"
                bg="white/10"
                borderRadius="3xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                backdropFilter="blur(10px)"
                border="1px solid white/20"
                position="relative"
                overflow="hidden"
              >
                {/* Floating Game Icons Animation */}
                <Box position="relative" w="full" h="full">
                  {/* Game controller icon */}
                  <Box
                    position="absolute"
                    top="20%"
                    left="20%"
                    animation="float 3s ease-in-out infinite"
                    sx={{
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-20px)" },
                      },
                    }}
                  >
                    <Text fontSize="4xl">🎮</Text>
                  </Box>

                  {/* Trophy icon */}
                  <Box
                    position="absolute"
                    top="60%"
                    right="25%"
                    animation="float 2.5s ease-in-out infinite reverse"
                    sx={{
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-15px)" },
                      },
                    }}
                  >
                    <Text fontSize="3xl">🏆</Text>
                  </Box>

                  {/* Brain icon */}
                  <Box
                    position="absolute"
                    top="40%"
                    right="15%"
                    animation="pulse 2s ease-in-out infinite"
                    sx={{
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)", opacity: 0.8 },
                        "50%": { transform: "scale(1.1)", opacity: 1 },
                      },
                    }}
                  >
                    <Text fontSize="3xl">🧠</Text>
                  </Box>

                  {/* Puzzle piece */}
                  <Box
                    position="absolute"
                    top="25%"
                    right="50%"
                    animation="wiggle 4s ease-in-out infinite"
                    sx={{
                      "@keyframes wiggle": {
                        "0%, 100%": { transform: "rotate(0deg)" },
                        "25%": { transform: "rotate(5deg)" },
                        "75%": { transform: "rotate(-5deg)" },
                      },
                    }}
                  >
                    <Text fontSize="3xl">🧩</Text>
                  </Box>

                  {/* Lightning bolt */}
                  <Box
                    position="absolute"
                    bottom="30%"
                    left="30%"
                    animation="flash 1.5s ease-in-out infinite"
                    sx={{
                      "@keyframes flash": {
                        "0%, 100%": { opacity: 0.6 },
                        "50%": { opacity: 1, transform: "scale(1.2)" },
                      },
                    }}
                  >
                    <Text fontSize="2xl">⚡</Text>
                  </Box>

                  {/* Target/bullseye */}
                  <Box
                    position="absolute"
                    bottom="20%"
                    right="40%"
                    animation="spin 8s linear infinite"
                    sx={{
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  >
                    <Text fontSize="3xl">🎯</Text>
                  </Box>

                  {/* Central floating text */}
                  <VStack
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    spacing={4}
                    textAlign="center"
                    animation="fadeInOut 4s ease-in-out infinite"
                    sx={{
                      "@keyframes fadeInOut": {
                        "0%, 100%": { opacity: 0.8 },
                        "50%": { opacity: 1 },
                      },
                    }}
                  >
                    <Text
                      color="white"
                      fontSize={{ base: "2xl", lg: "4xl" }}
                      fontWeight="800"
                      textShadow="0 2px 4px rgba(0,0,0,0.3)"
                      letterSpacing="-0.5px"
                    >
                      Start Playing Today!
                    </Text>
                    {/* <Text
                      color="white/90"
                      fontSize={{ base: "lg", lg: "xl" }}
                      fontWeight="600"
                      textShadow="0 1px 2px rgba(0,0,0,0.2)"
                    >
                      Challenge Your Mind
                    </Text> */}
                  </VStack>

                  {/* Background particles */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <Box
                      key={`decoration-particle-${i}`}
                      position="absolute"
                      w="4px"
                      h="4px"
                      bg="white/30"
                      borderRadius="full"
                      top={`${Math.random() * 100}%`}
                      left={`${Math.random() * 100}%`}
                      animation={`twinkle ${2 + Math.random() * 3}s ease-in-out infinite`}
                      sx={{
                        "@keyframes twinkle": {
                          "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
                          "50%": { opacity: 1, transform: "scale(1.5)" },
                        },
                      }}
                      style={{
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>

        {/* Background decorations */}
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

      {/* Featured Games Section */}
      <Box py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }}>
        <Container maxW="7xl">
          <VStack spacing={12}>
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
                ⭐ Featured
              </Badge>
              <Heading
                as="h2"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="700"
                textAlign="center"
                color="gray.900"
                _dark={{ color: "white" }}
              >
                Popular Games
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                textAlign="center"
                maxW="2xl"
              >
                Discover the most loved games by our community. From brain
                teasers to strategy games, find your next favorite challenge.
              </Text>
            </VStack>

            {loading ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                w="full"
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <Box
                    key={`skeleton-${i}`}
                    h="200px"
                    bg="gray.100"
                    _dark={{ bg: "gray.700" }}
                    borderRadius="2xl"
                    animate="pulse"
                  />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                w="full"
              >
                {featuredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </SimpleGrid>
            )}

            <Button
              as={Link}
              href="/gallery"
              variant="outline"
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              fontWeight="600"
            >
              View All Games
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Recent Games Section */}
      {recentGames.length > 0 && (
        <Box
          py={{ base: 12, md: 20 }}
          px={{ base: 4, md: 6 }}
          bg={useColorModeValue("gray.50", "gray.900")}
        >
          <Container maxW="7xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="600"
                >
                  🆕 Fresh
                </Badge>
                <Heading
                  as="h2"
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="700"
                  textAlign="center"
                  color="gray.900"
                  _dark={{ color: "white" }}
                >
                  Recently Added
                </Heading>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                w="full"
              >
                {recentGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      )}
    </Box>
  );
}
