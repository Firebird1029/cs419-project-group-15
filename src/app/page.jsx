"use client"
import { useCallback, useEffect, useState } from "react";
import Carousel from "./carousel/index"
import createClient from "@/utils/supabase/client";
import { Box, Container, Heading } from "@chakra-ui/react";

export default function Home() {
  const supabase = createClient();
  const [data, setData] = useState([]);

  const allGames = useCallback(async () => {
    try {
      const { data: allGameData, error, status} = await supabase.from("games").select("*, profiles!inner(username)");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setData(allGameData);
      }
    } catch (error) {
      alert("Error loading games!");
      console.log(error);
    }
  }, [supabase]);

  useEffect(() => {
    allGames();
  }, [allGames]);

  return (
    <Box padding="50px">
      <Container maxW='container.xl'>
        <Heading color='#8fffb2'>Featured Games</Heading>
        <Carousel data={data}/>
      </Container>
    </Box>
    
  )
}
