/* eslint-disable jsx-a11y/label-has-associated-control */

// https://supabase.com/docs/guides/auth/server-side/nextjs
// TODO page needs styling

"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Input,
  Box,
  Avatar,
  Flex,
  Center,
  Text,
  Square,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  Image,
  Wrap,
  WrapItem,
  IconButton,
  Alert,
  AlertIcon,
  Spinner,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Container,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";
import Carousel from "../carousel/index";

// import {useParams} from 'react-router-dom';

export default function AccountForm() {
  const supabase = createClient();
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUserID] = useState(null);
  const [createdGames, setCreatedGames] = useState([]);
  const [reviews, setReviews] = useState([]);

  // let search = window.location.search;
  // let params = new URLSearchParams(search);
  // const name = params.get('username'); //Get user from url query params

  async function setUserInformation(userid) {
    // SET BASIC USER INFORMATION
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar`)
        .eq("id", userid)
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
      // alert("Error loading user data!");
      console.log(error);
    }

    // SET CREATED GAMES
    try {
      const { data, error, status } = await supabase
        .from("games")
        .select("*, profiles!inner(username, avatar)")
        .eq("owner", userid);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCreatedGames(data);
      }
    } catch (error) {
      // alert("Error loading user data!");
      console.log(error);
    }

    // SET REVIEWS
    try {
      const { data, error, status } = await supabase
        .from("ratings")
        .select(`game_id, rating, comment, created_at`)
        .eq("user_id", userid);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setReviews(data);
      }
    } catch (error) {
      // alert("Error loading user data!");
      console.log(error);
    }
  }

  const getProfile = useCallback(
    async (name) => {
      if (name != null) {
        try {
          const { data, error1, status1 } = await supabase
            .from("profiles")
            .select(`id`)
            .eq("username", name)
            .single();

          if (data) {
            setUserID(data.id);
            setUserInformation(data.id);
          }
        } catch (error) {
          console.log("GOT HERE 4");
          // alert("Error loading user data!");
          console.log(error);
        }
      }
    },
    [user, supabase],
  );

  useEffect(() => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const name = params.get("username"); // Get user from url query params
    getProfile(name);
  }, [user, getProfile]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="7xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        {/* Header Section */}
        <VStack spacing={6} mb={8}>
          <Badge
            colorScheme="purple"
            variant="subtle"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
          >
            👾 User Profile
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="800"
            textAlign="center"
            color="gray.900"
            _dark={{ color: "white" }}
            letterSpacing="-1px"
          >
            {fullname || username || "Loading..."}
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            textAlign="center"
            maxW="2xl"
          >
            @{username || "username"} • Mind Matrix Creator
          </Text>
        </VStack>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 2fr" }}
          gap={8}
          alignItems="start"
        >
          {/* Profile Card */}
          <GridItem>
            <Card
              bg={useColorModeValue("white", "gray.800")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              borderWidth="1px"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
            >
              <CardBody p={8}>
                <VStack spacing={6}>
                  <Avatar
                    src={avatarUrl}
                    size="2xl"
                    border="4px solid"
                    borderColor="brand.200"
                    boxShadow="lg"
                  />
                  <VStack spacing={2} textAlign="center">
                    <Heading
                      size="lg"
                      color="gray.900"
                      _dark={{ color: "white" }}
                    >
                      {fullname || username || "User Name"}
                    </Heading>
                    <Text
                      fontSize="md"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      @{username || "username"}
                    </Text>
                    <Badge
                      colorScheme="purple"
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      Game Creator
                    </Badge>
                  </VStack>

                  <Divider />

                  {/* Stats */}
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <VStack spacing={1}>
                      <Text fontSize="2xl" fontWeight="800" color="brand.500">
                        {createdGames?.length || 0}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: "gray.400" }}
                        fontWeight="500"
                      >
                        Games Created
                      </Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="2xl" fontWeight="800" color="purple.500">
                        {reviews?.length || 0}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: "gray.400" }}
                        fontWeight="500"
                      >
                        Reviews
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Games Content */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Created Games Section */}
              <Card
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                borderWidth="1px"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="xl"
              >
                <CardBody p={8}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading
                          size="lg"
                          color="gray.900"
                          _dark={{ color: "white" }}
                        >
                          Created Games
                        </Heading>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Games developed by {username}
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme="brand"
                        variant="outline"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {createdGames?.length || 0} Games
                      </Badge>
                    </HStack>

                    {createdGames && createdGames.length > 0 ? (
                      <Box w="full">
                        <Carousel data={createdGames} />
                      </Box>
                    ) : (
                      <VStack spacing={4} py={8}>
                        <Text fontSize="6xl" opacity={0.3}>
                          🎮
                        </Text>
                        <VStack spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="gray.600"
                            _dark={{ color: "gray.400" }}
                          >
                            No games created yet
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            _dark={{ color: "gray.500" }}
                            textAlign="center"
                          >
                            This user hasn't created any games yet. Check back
                            later!
                          </Text>
                        </VStack>
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Recent Activity / Reviews Section */}
              <Card
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                borderWidth="1px"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="xl"
              >
                <CardBody p={8}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading
                          size="lg"
                          color="gray.900"
                          _dark={{ color: "white" }}
                        >
                          Recent Activity
                        </Heading>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Game reviews and ratings
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme="purple"
                        variant="outline"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {reviews?.length || 0} Reviews
                      </Badge>
                    </HStack>

                    {reviews && reviews.length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {reviews.slice(0, 3).map((review, index) => (
                          <Box
                            key={index}
                            p={4}
                            bg={useColorModeValue("gray.50", "gray.700")}
                            borderRadius="lg"
                            borderLeft="4px solid"
                            borderLeftColor="purple.500"
                          >
                            <VStack align="start" spacing={2}>
                              <HStack justify="space-between" w="full">
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color="gray.700"
                                  _dark={{ color: "gray.300" }}
                                >
                                  Game Review
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  _dark={{ color: "gray.500" }}
                                >
                                  {new Date(
                                    review.created_at,
                                  ).toLocaleDateString()}
                                </Text>
                              </HStack>
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                _dark={{ color: "gray.400" }}
                              >
                                "{review.comment}"
                              </Text>
                              <HStack>
                                <Text fontSize="xs" color="gray.500">
                                  Rating:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color="orange.500"
                                >
                                  {review.rating}/5 ⭐
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <VStack spacing={4} py={8}>
                        <Text fontSize="6xl" opacity={0.3}>
                          📝
                        </Text>
                        <VStack spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="gray.600"
                            _dark={{ color: "gray.400" }}
                          >
                            No reviews yet
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            _dark={{ color: "gray.500" }}
                            textAlign="center"
                          >
                            This user hasn't reviewed any games yet.
                          </Text>
                        </VStack>
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
