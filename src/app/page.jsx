"use client"
import { useCallback, useEffect, useState } from "react";
import Carousel from "./carousel/index"
import createClient from "@/utils/supabase/client";
import GetGames from "./carousel/getGames";
import { Box, Container, Heading } from "@chakra-ui/react";

export default function Home() {
  
  return (
    <Box padding="50px">
      <Container maxW='container.xl'>
        <Heading color='#8fffb2'>Featured Games</Heading>
        <Carousel />
      </Container>
    </Box>
    
  )
}
