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
  FormHelperText,
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
  Progress,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import NextLink from "next/link";
import createClient from "@/utils/supabase/client";
import register from "./actions";

export default function Register() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
  );

  // Username validation
  const validateUsername = (usernameValue) => {
    if (usernameValue.length < 3)
      return "Username must be at least 3 characters";
    if (usernameValue.length > 20)
      return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue))
      return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  // Email validation
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue))
      return "Please enter a valid email address";
    return null;
  };

  // Password strength validation
  const validatePassword = (passwordValue) => {
    if (passwordValue.length < 8)
      return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(passwordValue))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(passwordValue))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(passwordValue))
      return "Password must contain at least one number";
    return null;
  };

  // Password strength calculator
  const calculatePasswordStrength = (passwordValue) => {
    let strength = 0;
    if (passwordValue.length >= 8) strength += 25;
    if (/(?=.*[a-z])/.test(passwordValue)) strength += 25;
    if (/(?=.*[A-Z])/.test(passwordValue)) strength += 25;
    if (/(?=.*\d)/.test(passwordValue)) strength += 25;
    if (/(?=.*[@$!%*?&])/.test(passwordValue)) strength += 25; // Special characters bonus
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(password);
  const getStrengthColor = (strength) => {
    if (strength < 50) return "red";
    if (strength < 75) return "yellow";
    return "green";
  };

  const getStrengthText = (strength) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    if (strength < 100) return "Strong";
    return "Very Strong";
  };

  // Real-time validation
  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Username is required";
    } else {
      const usernameError = validateUsername(username);
      if (usernameError) newErrors.username = usernameError;
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const result = await register({ username, email, password });

      if (result?.error) {
        setAlertMessage(
          result.error.message || "Registration failed. Please try again.",
        );
        setAlertType("error");
      } else if (result?.success) {
        setAlertMessage(result.message);
        setAlertType("success");
        // Clear the form after successful registration
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setAlertMessage("An unexpected error occurred. Please try again.");
        setAlertType("error");
      }
    } catch (error) {
      // console.error("Registration error:", error);
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
              🚀 Join Us
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="800"
              textAlign="center"
              letterSpacing="-1px"
            >
              Create Your Account
            </Heading>
            <Text fontSize="lg" color="white/80" maxW="md" lineHeight="1.6">
              Join our community and start creating amazing games today
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

      {/* Register Form */}
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

                {/* Username Field */}
                <FormControl isInvalid={errors.username}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Username
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Text fontSize="lg">👤</Text>
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                          const newErrors = { ...errors };
                          delete newErrors.username;
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
                    {errors.username}
                  </FormErrorMessage>
                  {!errors.username && username && (
                    <FormHelperText fontSize="xs">
                      3-20 characters, letters, numbers, and underscores only
                    </FormHelperText>
                  )}
                </FormControl>

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
                      placeholder="Create a strong password"
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
                  {!errors.password && password && (
                    <VStack spacing={2} align="stretch" mt={2}>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.600">
                          Password Strength:
                        </Text>
                        <Text
                          fontSize="xs"
                          color={`${getStrengthColor(passwordStrength)}.500`}
                          fontWeight="600"
                        >
                          {getStrengthText(passwordStrength)}
                        </Text>
                      </HStack>
                      <Progress
                        value={passwordStrength}
                        size="sm"
                        colorScheme={getStrengthColor(passwordStrength)}
                        borderRadius="full"
                      />
                    </VStack>
                  )}
                </FormControl>

                {/* Confirm Password Field */}
                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          const newErrors = { ...errors };
                          delete newErrors.confirmPassword;
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
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        icon={
                          showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: "gray.600" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="sm">
                    {errors.confirmPassword}
                  </FormErrorMessage>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                  color="white"
                  size="lg"
                  fontWeight="600"
                  borderRadius="12px"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Creating Account..."
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s ease"
                  isDisabled={isSubmitting}
                >
                  Create Account
                </Button>

                {/* Sign In Link */}
                <VStack spacing={4} pt={4}>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    Already have an account?
                  </Text>
                  <Button
                    as={NextLink}
                    href="/login"
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
                    Sign In
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
