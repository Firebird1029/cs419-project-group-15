import React, { useState, useEffect, useCallback } from "react";
import { capsFirst } from "./utils";
import "fontsource-inter/500.css";
import ReactDOM from "react-dom";
import theme from "./theme";
import createClient from "@/utils/supabase/client";
import NextLink from "next/link";

//https://codesandbox.io/p/sandbox/chakra-carousel-dd8vn?file=%2Fsrc%2Findex.js
import {
  ChakraProvider,
  extendTheme,
  Container,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Tag,
  Link,
  Avatar
} from "@chakra-ui/react";

import ChakraCarousel from "./ChakraCarousel";

export default function App({data}) {
  return (
    
    <ChakraProvider theme={extendTheme(theme)}>
      <Container
        py={8}
        px={0}
        maxW={{
          base: "100%",
          sm: "35rem",
          md: "43.75rem",
          lg: "57.5rem",
          xl: "75rem",
          xxl: "87.5rem"
        }}
      >
        <ChakraCarousel gap={32}>
          {/* TODO: instead of just limiting data from query, try to sort by rating for featured games */}
          {data.map(({id, description, name, type, url_tag: url, profiles: { username, avatar }}) => (
            <Flex
              key={id}
              boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
              justifyContent="space-between"
              flexDirection="column"
              overflow="hidden"
              color="gray.300"
              bg="base.d100"
              rounded={5}
              flex={1}
              p={5}
            >
              <VStack mb={6}>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  textAlign="left"
                  w="full"
                  mb={2}
                >
                  {capsFirst(name)}
                </Heading>
                <Text w="full">{capsFirst(description)}</Text>
              </VStack>

              <Flex justifyContent="space-between">
                <HStack spacing={2}>
                  <Link as={NextLink} href={`user/?username=`+username} passHref>
                      <HStack>
                        <Avatar src={avatar} />
                        <Tag size="sm" variant="outline" colorScheme="green">
                          User: {username}
                        </Tag>
                      </HStack>
                    </Link>
                  <Tag size="sm" variant="outline" colorScheme="cyan">
                    Type: {type}
                  </Tag>
                </HStack>
                <Link href={`/g/${url}`}>
                  <Button
                    colorScheme="green"
                    fontWeight="bold"
                    color="gray.900"
                    size="sm"
                  >
                    Play
                  </Button>
                </Link>
              </Flex>
            </Flex>
          ),
        )}
        </ChakraCarousel>
      </Container>
    </ChakraProvider>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
