"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Link,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Spinner,
  Center,
  Card,
  CardBody,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import NextLink from "next/link";
import createClient from "@/utils/supabase/client";
import login from "./actions";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
  );

  // Email validation
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  // Password validation
  const validatePassword = (passwordValue) => {
    return passwordValue.length >= 6;
  };

  // Real-time validation
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage("Please fix the errors below");
      setAlertType("error");
      return;
    }

    setIsSubmitting(true);
    setAlertMessage("");

    try {
      const result = await login({ email, password });

      if (result?.error) {
        setAlertMessage(
          result.error.message ||
            "Login failed. Please check your credentials.",
        );
        setAlertType("error");
      } else {
        // If no error returned, the action redirected successfully
        setAlertMessage("Login successful! Redirecting...");
        setAlertType("success");
        // The redirect happens in the server action, no need for manual redirect
      }
    } catch (error) {
      // Handle redirect case - this is expected for successful login
      if (error?.message?.includes("NEXT_REDIRECT")) {
        setAlertMessage("Login successful! Redirecting...");
        setAlertType("success");
        // Let the redirect happen naturally
        return;
      }

      // console.error("Login error:", error);
      setAlertMessage("An unexpected error occurred. Please try again.");
      setAlertType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/account");
      } else {
        setLoading(false);
      }
    })().catch(() => {
      // console.error(err);
      setLoading(false);
    });
  }, [router, supabase.auth]);

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
                Loading...
              </Text>
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
        py={{ base: 12, md: 16 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack spacing={4} textAlign="center">
            <Badge
              bg="white/20"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
            >
              🔐 Sign In
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="800"
              textAlign="center"
              letterSpacing="-1px"
            >
              Welcome Back
            </Heading>
            <Text fontSize="lg" color="white/80" maxW="md" lineHeight="1.6">
              Sign in to your account to create and play amazing games
            </Text>
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

      {/* Login Form */}
      <Box py={16} px={6}>
        <Container maxW="md">
          <Card
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="2xl"
            overflow="hidden"
          >
            <CardBody p={8}>
              <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                {/* Alert Messages */}
                {alertMessage && (
                  <Alert status={alertType} borderRadius="lg" variant="subtle">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">
                        {alertType === "success" ? "Success!" : "Error!"}
                      </AlertTitle>
                      <AlertDescription fontSize="sm">
                        {alertMessage}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* Email Field */}
                <FormControl isInvalid={errors.email}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          const newErrors = { ...errors };
                          delete newErrors.email;
                          setErrors(newErrors);
                        }
                      }}
                      onKeyPress={handleKeyPress}
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
                  </InputGroup>
                  <FormErrorMessage fontSize="sm">
                    {errors.email}
                  </FormErrorMessage>
                </FormControl>

                {/* Password Field */}
                <FormControl isInvalid={errors.password}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          const newErrors = { ...errors };
                          delete newErrors.password;
                          setErrors(newErrors);
                        }
                      }}
                      onKeyPress={handleKeyPress}
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
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: "gray.600" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="sm">
                    {errors.password}
                  </FormErrorMessage>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  color="white"
                  size="lg"
                  fontWeight="600"
                  borderRadius="12px"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Signing In..."
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                  isDisabled={isSubmitting}
                >
                  Sign In
                </Button>

                {/* Sign Up Link */}
                <VStack spacing={4} pt={4}>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    Don&apos;t have an account?
                  </Text>
                  <Button
                    as={NextLink}
                    href="/register"
                    variant="outline"
                    size="lg"
                    fontWeight="600"
                    borderRadius="12px"
                    w="full"
                    borderColor="brand.500"
                    color="brand.500"
                    _hover={{
                      bg: "brand.50",
                      transform: "translateY(-1px)",
                    }}
                    _dark={{
                      borderColor: "brand.300",
                      color: "brand.300",
                      _hover: {
                        bg: "brand.900",
                      },
                    }}
                  >
                    Create Account
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
