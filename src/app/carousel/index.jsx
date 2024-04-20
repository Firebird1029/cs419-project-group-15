import React, { useState, useEffect, useCallback } from "react";
import { capsFirst } from "./utils";
import "fontsource-inter/500.css";
import ReactDOM from "react-dom";
import theme from "./theme";
import createClient from "@/utils/supabase/client";

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
  Link
} from "@chakra-ui/react";

import ChakraCarousel from "./ChakraCarousel";

export default function App() {
  const supabase = createClient();
  // const [data, setData] = useState([]);
  const [data, setData] = useState([]);
  const [idarray, setId] = useState([]);
  const [namearray, setName] = useState([]);
  const [typearray, setType] = useState([]);
  const [urlarray, setUrl] = useState([]);
  const [profilearray, setProfile] = useState([]);
  const [userarray, setUser] = useState([]);


  const allGames = useCallback(async () => {
    try {
      const { data: allGameData, error, status} = await supabase.from("games").select("*, profiles!inner(username)");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        var ids = [];
        var names = [];
        var types = [];
        var urls = [];
        var profiles = [];
        var usernames = [];
        {allGameData.map(
          ({ id, name, type, url_tag: url, profiles: { username } }) => (
            function() {
              console.log("goerejfldsa")
              ids.push(id);
              names.push(name);
              types.push(type);
              urls.push(url);
              profiles.push(profiles);
              usernames.push(username);
            }
          ),)};
        setId(ids);
        setName(names);
        setType(types);
        setUrl(urls);
        setProfile(profiles);
        setUser(usernames);
        // setData(allGameData);
      }
    } catch (error) {
      // alert("Error loading user data!");
      console.log(error);
    }
  }, [supabase]);

  // useEffect(() => {
  //   allGames();
  //   // console.log(data)
  //   {namearray.map(
  //     ({name}) => (
  //       console.log("GOT HERE111")
  //     ),)};
  //   // {data.map(
  //   //   ({ id, name, type, url_tag: url, profiles: { username } }) => (
  //   //     // console.log("name: ", name);
  //   //     console.log("JFKLASJKLDJFL")
  //   //   ),)};
  // }, [allGames]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch data from server-side route
  //       const response = await fetch('/api/getData');
  //       const responseData = await response.json();
  //       setData(responseData);
  //     } catch (error) {
  //       console.error('Error fetching data from server:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  return (
    
    <ChakraProvider theme={extendTheme(theme)}>
      {/* <Text>{data}</Text> */}
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
          {data.slice(5, 15).map((post, index) => (
              // <Text>{name}</Text>
            <Flex
              // key={index}
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
                  {capsFirst(post.title)}
                </Heading>
                <Text w="full">{capsFirst(post.body)}</Text>
              </VStack>

              <Flex justifyContent="space-between">
                <HStack spacing={2}>
                  <Tag size="sm" variant="outline" colorScheme="green">
                    User: {post.userId}
                  </Tag>
                  <Tag size="sm" variant="outline" colorScheme="cyan">
                    Type: {post.id - 5}
                  </Tag>
                </HStack>
                {/* <Link href={`/g/${name}`}> */}
                  <Button
                    colorScheme="green"
                    fontWeight="bold"
                    color="gray.900"
                    size="sm"
                  >
                    More
                  </Button>
                {/* </Link> */}
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
