/* eslint-disable jsx-a11y/label-has-associated-control */

// https://supabase.com/docs/guides/auth/server-side/nextjs
// TODO page needs styling

"use client";

import { useCallback, useEffect, useState } from "react";
import { Input, 
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
          WrapItem, IconButton, Alert, AlertIcon, Spinner, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";
import React, { useRef } from 'react';
import Carousel from "../carousel/index"

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
    //SET BASIC USER INFORMATION
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
      alert("Error loading user data!");
      console.log(error);
    }

    //SET CREATED GAMES
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
      alert("Error loading user data!");
      console.log(error);
    }

    //SET REVIEWS
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
      alert("Error loading user data!");
      console.log(error);
    }
  }

  const getProfile = useCallback(async (name) => {
    if (name != null) {
      try {

        const {data, error1, status1 } = await supabase
          .from("profiles")
          .select(`id`)
          .eq("username", name)
          .single();
        
        if (data) {
          setUserID(data.id);
          setUserInformation(data.id)
        }
        
      } catch (error) {
        
      console.log("GOT HERE 4");
        alert("Error loading user data!");
        console.log(error);
      }
      
    }
    
  }, [user, supabase]);

  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    const name = params.get('username'); //Get user from url query params
    getProfile(name);
  }, [user, getProfile]);

  return (
    <Box>
        <Flex >
        <Box margin='9'>
          <Card maxW='sm' margin=''>
              <CardBody>
                <Box align='center'>
                  <Avatar
                    src={avatarUrl}
                    height="330px"
                    width="330px"
                    borderRadius='50%'
                    alt='Users profile pic'
                    object-fit= "cover"
                  />
                </Box>
                <Stack mt='6' spacing='3'>
                  <Heading align='center' size='md'>{fullname} @ {username}</Heading>
                </Stack>
              </CardBody>
          </Card>
        </Box>
        <Box flex='1' margin='9'>
          <Card>
            <CardBody>
              <Box>
                <Heading>Created Games</Heading> 
                  <Carousel data={createdGames}/>
              </Box>
            </CardBody>

            <Divider />
            <CardFooter>
              
            </CardFooter>

          </Card>
        </Box>
        
      </Flex>
      <Box>
        
        
      </Box>
    </Box>

  );
}
