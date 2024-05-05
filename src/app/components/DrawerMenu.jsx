'use client'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  Button,
  IconButton,
  Box,
  Link,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from "react";
import React, { useRef } from 'react';
import createClient from "@/utils/supabase/client";
import NextLink from "next/link";

export default function DrawerMenu({user}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement] = React.useState('left')
    const [username, setUsername] = useState(null);
    const supabase = createClient();
    
    const getProfile = useCallback(async () => {
      if (user) {
        try {
          const { data, error, status } = await supabase
            .from("profiles")
            .select(`username`)
            .eq("id", user.id)
            .single();
    
          if (error && status !== 406) {
            throw error;
          }
    
          if (data) {
            setUsername(data.username);
          }
        } catch (error) {
          // alert("Error loading user data!");
          console.log(error);
        }
      }
    }, [user, supabase]);

    useEffect(() => {
      getProfile();
    }, [user, getProfile]);
  

    // Stretch TODO: Read which page and initialFocusRef={rightbutton} based on page
  
    return (
      <>
        <Button as={IconButton} aria-label='Menu Options' icon={<HamburgerIcon />} variant='outline' onClick={onOpen}>
          Open
        </Button>
        <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={"xs"} >
          <DrawerOverlay />
          <DrawerContent>
          <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>Site Navigator</DrawerHeader>
            <DrawerBody>
              <Stack>
                <Box>
                  <Link as={NextLink} href="/">
                    <Button boxSize={"full"} height={10}>
                      Home
                    </Button>
                  </Link>
                </Box>

                <Box>
                  <Link as={NextLink} href="/gallery">
                    <Button boxSize={"full"} height={10}>
                      Game Gallery
                    </Button>
                  </Link>
                </Box>

                {user && (<Box>
                  <Link as={NextLink} href={`user/?username=`+username} passHref>
                    <Button boxSize={"full"} height={10} >
                      Account
                    </Button>
                  </Link>
                </Box>)}
                
                <Link as={NextLink} href="/create">
                    <Box>
                    <Button boxSize={"full"} height={10}>
                      Create Game
                    </Button>
                  </Box>
                </Link>
                
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }