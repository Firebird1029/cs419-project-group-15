"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Text,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  HStack,
  VStack,
  Badge,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  SearchIcon,
  StarIcon,
  TriangleUpIcon as PlayIcon,
  ArrowForwardIcon,
  ChevronDownIcon,
  ViewIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import createClient from "@/utils/supabase/client";

function GameCard({ game }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Link
      href={`/g/${game.url_tag}`}
      style={{ textDecoration: "none" }}
      passHref
      scroll={false}
    >
      <Card
        as="a"
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "xl",
          borderColor: "brand.300",
        }}
        transition="all 0.3s ease"
        cursor="pointer"
        tabIndex={0}
      >
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            {/* Game Header */}
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2} flex={1}>
                <Heading
                  size="md"
                  fontWeight="700"
                  color="gray.900"
                  _dark={{ color: "white" }}
                  noOfLines={2}
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

            {/* Creator Info */}
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

            {/* Play Button */}
            <Button
              as={Link}
              href={`/g/${game.url_tag}`}
              bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
              color="white"
              size="sm"
              rightIcon={<ArrowForwardIcon />}
              fontWeight="600"
              w="full"
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
              tabIndex={-1}
            >
              Play Now
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}

function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
}) {
  return (
    <Stack
      spacing={4}
      direction={{ base: "column", md: "row" }}
      align="stretch"
    >
      {/* Search */}
      <InputGroup maxW={{ base: "full", md: "300px" }}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search games..."
          borderRadius="lg"
          bg={useColorModeValue("white", "gray.700")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          _focus={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Filters */}
      <Stack direction={{ base: "column", md: "row" }} spacing={3} flex={1}>
        <Select
          placeholder="All Categories"
          maxW={{ base: "full", md: "200px" }}
          borderRadius="lg"
          bg={useColorModeValue("white", "gray.700")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            borderRadius="lg"
            bg={useColorModeValue("white", "gray.700")}
            w={{ base: "full", md: "auto" }}
          >
            {sortBy === "newest" && "Newest"}
            {sortBy === "oldest" && "Oldest"}
            {sortBy === "name" && "Name A-Z"}
            {sortBy === "creator" && "Creator A-Z"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSortBy("newest")}>Newest</MenuItem>
            <MenuItem onClick={() => setSortBy("oldest")}>Oldest</MenuItem>
            <MenuItem onClick={() => setSortBy("name")}>Name A-Z</MenuItem>
            <MenuItem onClick={() => setSortBy("creator")}>
              Creator A-Z
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </Stack>
  );
}

export default function GalleryPage() {
  const supabase = createClient();
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadGames() {
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*, profiles!inner(username, avatar)");

        if (error) {
          setError(error);
        } else {
          setAllGames(data || []);
          setFilteredGames(data || []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [supabase]);

  // Filter and sort games whenever search term, category, or sort option changes
  useEffect(() => {
    let filtered = [...allGames];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.profiles?.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((game) => game.type === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "creator":
        filtered.sort((a, b) =>
          a.profiles?.username.localeCompare(b.profiles?.username),
        );
        break;
      default:
        break;
    }

    setFilteredGames(filtered);
  }, [allGames, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <Box minH="100vh" pt={{ base: 4, md: 8 }}>
        <Container maxW="7xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
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
                🎮 Game Gallery
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="800"
                textAlign="center"
                color="gray.900"
                _dark={{ color: "white" }}
                letterSpacing="-1px"
              >
                Loading Games...
              </Heading>
            </VStack>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
              spacing={6}
              w="full"
            >
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  h="200px"
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                  borderRadius="2xl"
                  animate="pulse"
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={8}>
          <Heading>Oops! Something went wrong</Heading>
          <Text color="gray.600">
            We could not load the games. Please try again later.
          </Text>
          <Button
            as={Link}
            href="/"
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
            Go Home
          </Button>
        </VStack>
      </Container>
    );
  }

  // Get unique categories from all games
  const categories = [
    ...new Set(allGames.map((game) => game.type).filter(Boolean)),
  ];

  // Group filtered games by category for tabs
  const gamesByType = filteredGames.reduce((acc, game) => {
    const type = game.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(game);
    return acc;
  }, {});

  const tabCategories = Object.keys(gamesByType);

  return (
    <Box minH="100vh" pt={{ base: 4, md: 8 }}>
      <Container maxW="7xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        {/* Header Section */}
        <VStack spacing={{ base: 6, md: 8 }} mb={{ base: 8, md: 12 }}>
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
              🎮 Game Gallery
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="800"
              textAlign="center"
              color="gray.900"
              _dark={{ color: "white" }}
              letterSpacing="-1px"
            >
              Discover Amazing Games
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="center"
              maxW="2xl"
              lineHeight="1.6"
            >
              Explore thousands of user-created games. From brain-bending
              puzzles to strategic challenges, find your next favorite game.
            </Text>
          </VStack>

          {/* Filter Bar */}
          <Box w="full">
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
            />
          </Box>
        </VStack>

        {/* Games Display */}
        {/* Show search/filter results count */}
        {(searchTerm || selectedCategory) && (
          <Text color="gray.600" fontSize="sm" mb={4}>
            {filteredGames.length} result{filteredGames.length !== 1 ? "s" : ""}{" "}
            found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </Text>
        )}

        <Tabs variant="soft-rounded" colorScheme="brand">
          <TabList
            mb={{ base: 6, md: 8 }}
            flexWrap="wrap"
            gap={2}
            overflowX="auto"
          >
            <Tab fontWeight="600" fontSize="sm">
              All Games ({filteredGames.length})
            </Tab>
            {tabCategories.map((category) => (
              <Tab
                key={category}
                fontWeight="600"
                fontSize="sm"
                textTransform="capitalize"
              >
                {category} ({gamesByType[category].length})
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {/* All Games Tab */}
            <TabPanel px={0}>
              {filteredGames.length === 0 ? (
                <VStack spacing={4} py={12}>
                  <Text fontSize="lg" color="gray.600">
                    No games found matching your criteria
                  </Text>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </VStack>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                  spacing={6}
                >
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>

            {/* Category Tabs */}
            {tabCategories.map((category) => (
              <TabPanel key={category} px={0}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                  spacing={6}
                >
                  {gamesByType[category].map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Stats Section */}
        <Box
          mt={{ base: 12, md: 20 }}
          p={{ base: 6, md: 8 }}
          bg={useColorModeValue("brand.50", "brand.900")}
          borderRadius="2xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="lg" color="brand.600" _dark={{ color: "brand.300" }}>
              Join Our Gaming Community
            </Heading>
            <VStack>
              <Text fontSize="3xl" fontWeight="800" color="brand.600">
                {allGames.length}
              </Text>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Games Available
              </Text>
            </VStack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              pt={4}
              w="full"
              justify="center"
            >
              <Button
                as={Link}
                href="/create"
                bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                color="white"
                size="lg"
                borderRadius="12px"
                fontWeight="600"
                w={{ base: "full", sm: "auto" }}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease"
              >
                Create Your Game
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="outline"
                size="lg"
                w={{ base: "full", sm: "auto" }}
              >
                Join Community
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
