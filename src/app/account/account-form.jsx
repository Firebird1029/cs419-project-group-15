/* eslint-disable jsx-a11y/label-has-associated-control */

// https://supabase.com/docs/guides/auth/server-side/nextjs
// TODO page needs styling

"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Input,
  Box,
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Divider,
  Button,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  Spinner,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Container,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Badge,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [nameChanged, setNameChange] = useState(null);
  const [usernameChanged, setUserChange] = useState(null);
  const [avatarChanged, setAvatarChange] = useState(null);
  const [originalName, setOGName] = useState(null);
  const [originalUserName, setOGUserName] = useState(null);
  const [originalAvatar, setOGAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setAvatarUrl(file);
    setAvatarChange(true);
    setSelectedFile(file);
    // You can do further processing with the selected file here
  };

  // const disabledVariant = {
  //   base: {
  //     bg: "gray.200", // Background color for disabled state
  //     _hover: {
  //       bg: "gray.200", // Hover background color for disabled state
  //     },
  //     _active: {
  //       bg: "gray.200", // Active background color for disabled state
  //     },
  //   },
  // };

  const getProfile = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);

        const {
          data,
          error: profileError,
          status: profileStatus,
        } = await supabase
          .from("profiles")
          .select(`full_name, username, website, avatar`)
          .eq("id", user.id)
          .single();

        if (profileError && profileStatus !== 406) {
          throw profileError;
        }

        if (data) {
          setFullname(data.full_name);
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar);

          setOGName(data.full_name);
          setOGUserName(data.username);
          setOGAvatar(data.avatar);
        }
      } catch (profileError) {
        // alert("Error loading user data!");
        // console.log(profileError);
      } finally {
        setLoading(false);
      }
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function getMedia() {
    const { data } = supabase.storage
      .from("pfps")
      .getPublicUrl(`${user.id}/uploaded-pfp`);

    return data;
  }

  async function updateProfile({ website_ }) {
    try {
      setLoading(true);

      // Check if username has changed and if it's already taken
      if (usernameChanged && username !== originalUserName) {
        // console.log("Checking username availability:", username);
        const { data: existingProfile, error: usernameError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .neq("id", user.id) // Exclude current user
          .single();

        if (existingProfile) {
          setError(
            `The username "${username}" is already taken. Please choose a different username.`,
          );
          setLoading(false);
          return;
        }

        if (usernameError && usernameError.code !== "PGRST116") {
          // PGRST116 is "not found" which is what we want
          // console.error("Error checking username availability:", usernameError);
        }
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullname,
          username,
          website_,
          avatar: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (selectedFile) {
        const { error: uploadError } = await supabase.storage
          .from("pfps")
          .upload(`${user.id}/uploaded-pfp`, selectedFile);

        if (uploadError) {
          await supabase.storage
            .from("pfps")
            .update(`${user.id}/uploaded-pfp`, selectedFile, {
              upsert: true,
            });
        }

        const media = await getMedia();
        if (media) {
          // https://stackoverflow.com/questions/77523252/the-image-is-not-re-loaded-from-supabase <Thank god for this
          const url = `${media.publicUrl}?q=${Date.now()}`;
          setAvatarUrl(url);
          await supabase.from("profiles").upsert({
            id: user.id,
            avatar: url,
            updated_at: new Date().toISOString(),
          });
        }
      }

      if (profileUpdateError) throw profileUpdateError;
      setStatus(true);
    } catch (updateError) {
      if (updateError.code === 23505) {
        setError(
          `The username "${username}" is already taken. Please try a different username.`,
        );
      } else {
        setError(`Errored with code ${updateError.code}... Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  }

  function closeSuccess() {
    window.location.reload();
  }

  function closeError() {
    window.location.reload();
  }

  function avatarClicked(url) {
    setAvatarUrl(url);
    if (originalAvatar === url) {
      setAvatarChange(false);
    } else {
      setAvatarChange(true);
    }
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Container maxW="7xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        {/* Status Alerts - Top Priority */}
        {loading && (
          <Alert
            status="info"
            borderRadius="lg"
            mb={6}
            bg={useColorModeValue("blue.50", "blue.900")}
          >
            <AlertIcon />
            <HStack>
              <Spinner size="sm" />
              <Text>Updating your profile...</Text>
            </HStack>
          </Alert>
        )}

        {status && (
          <Alert
            status="success"
            borderRadius="lg"
            mb={6}
            bg={useColorModeValue("green.50", "green.900")}
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your profile has been updated successfully.
              </AlertDescription>
            </Box>
            <CloseButton onClick={() => closeSuccess()} />
          </Alert>
        )}

        {error && (
          <Alert
            status="error"
            borderRadius="lg"
            mb={6}
            bg={useColorModeValue("red.50", "red.900")}
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
            <CloseButton onClick={() => closeError()} />
          </Alert>
        )}

        {/* Header Section */}
        <VStack spacing={6} mb={8}>
          <Badge
            colorScheme="brand"
            variant="subtle"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
          >
            ⚙️ Account Settings
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
            Manage Your Profile
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            textAlign="center"
            maxW="2xl"
          >
            Update your profile information and customize your avatar
          </Text>
        </VStack>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 2fr" }}
          gap={8}
          alignItems="start"
        >
          {/* Profile Preview Card */}
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
                  <Box position="relative">
                    <Avatar
                      src={avatarUrl}
                      size="2xl"
                      border="4px solid"
                      borderColor="brand.200"
                      boxShadow="lg"
                    />
                    {avatarChanged && (
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        bg="green.500"
                        color="white"
                        borderRadius="full"
                        fontSize="xs"
                      >
                        Updated
                      </Badge>
                    )}
                  </Box>
                  <VStack spacing={2} textAlign="center">
                    <Heading
                      size="lg"
                      color="gray.900"
                      _dark={{ color: "white" }}
                    >
                      {fullname || "Your Name"}
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
                      Mind Matrix Member
                    </Badge>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Settings Form */}
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
                <VStack spacing={6} align="stretch">
                  {/* Personal Information */}
                  <Box>
                    <Heading
                      size="md"
                      mb={4}
                      color="gray.900"
                      _dark={{ color: "white" }}
                    >
                      Personal Information
                    </Heading>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel fontWeight="600">Email Address</FormLabel>
                        <Input
                          value={user?.email || ""}
                          disabled
                          bg={useColorModeValue("gray.100", "gray.700")}
                          borderRadius="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="600">Full Name</FormLabel>
                        <Input
                          value={fullname || ""}
                          onChange={(e) => {
                            setFullname(e.target.value);
                            setNameChange(originalName !== e.target.value);
                          }}
                          disabled={loading}
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="600">Username</FormLabel>
                        <Input
                          value={username || ""}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setUserChange(originalUserName !== e.target.value);
                          }}
                          disabled={loading}
                          borderRadius="lg"
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Avatar Selection */}
                  <Box>
                    <Heading
                      size="md"
                      mb={4}
                      color="gray.900"
                      _dark={{ color: "white" }}
                    >
                      Choose Your Avatar
                    </Heading>
                    <Wrap spacing={4} justify="center">
                      {[
                        "profile_0.png",
                        "profile_0.1.png",
                        "profile_0.2.png",
                        "profile_0.3.png",
                        "profile_0.4.png",
                        "profile_0.5.png",
                        "profile_0.6.png",
                        "profile_1.png",
                        "profile_2.png",
                        "profile_3.png",
                        "profile_4.png",
                      ].map((src) => (
                        <WrapItem key={src}>
                          <Avatar
                            src={src}
                            size="lg"
                            cursor="pointer"
                            border={
                              avatarUrl === src ? "3px solid" : "2px solid"
                            }
                            borderColor={
                              avatarUrl === src ? "brand.500" : "transparent"
                            }
                            _hover={{
                              transform: "scale(1.1)",
                              borderColor: "brand.300",
                            }}
                            transition="all 0.2s"
                            onClick={() => avatarClicked(src)}
                          />
                        </WrapItem>
                      ))}
                      <WrapItem>
                        <Box position="relative">
                          <Avatar
                            src="upload-file.png"
                            size="lg"
                            cursor="pointer"
                            border="2px dashed"
                            borderColor="gray.300"
                            _hover={{
                              transform: "scale(1.1)",
                              borderColor: "brand.300",
                            }}
                            transition="all 0.2s"
                            onClick={handleButtonClick}
                          />
                          <Input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            opacity="0"
                            cursor="pointer"
                            accept="image/*"
                          />
                        </Box>
                      </WrapItem>
                    </Wrap>
                  </Box>
                </VStack>
              </CardBody>

              <Divider />

              <CardFooter p={8}>
                <HStack spacing={4} w="full" justify="space-between">
                  <Button
                    bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                    color="white"
                    fontWeight="600"
                    borderRadius="lg"
                    disabled={
                      loading ||
                      (!usernameChanged && !nameChanged && !avatarChanged)
                    }
                    opacity={
                      loading ||
                      (!usernameChanged && !nameChanged && !avatarChanged)
                        ? 0.6
                        : 1
                    }
                    _hover={{
                      transform:
                        loading ||
                        (!usernameChanged && !nameChanged && !avatarChanged)
                          ? "none"
                          : "translateY(-2px)",
                      boxShadow:
                        loading ||
                        (!usernameChanged && !nameChanged && !avatarChanged)
                          ? "none"
                          : "0 15px 30px rgba(59, 130, 246, 0.3)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s ease"
                    onClick={() => updateProfile({ website })}
                  >
                    {(() => {
                      if (loading) return "Saving...";
                      if (!usernameChanged && !nameChanged && !avatarChanged)
                        return "No Changes";
                      return "Save Changes";
                    })()}
                  </Button>

                  <form action="/auth/signout" method="post">
                    <Button
                      type="submit"
                      variant="ghost"
                      color="red.500"
                      fontWeight="600"
                      _hover={{ bg: "red.50", color: "red.600" }}
                      _dark={{ _hover: { bg: "red.900", color: "red.300" } }}
                    >
                      Sign Out
                    </Button>
                  </form>
                </HStack>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
