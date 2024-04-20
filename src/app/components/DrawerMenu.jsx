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
  NextLink
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';
import React from 'react'
// import NextLink from "next/link";

export default function DrawerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement] = React.useState('left')

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
                  <Link as={NextLink} href="/">
                    <Button boxSize={"full"} height={10}>
                      Game Gallery
                    </Button>
                  </Link>
                </Box>

                <Box>
                  <Button boxSize={"full"} height={10}>
                    Account
                  </Button>
                </Box>

                <Box>
                  <Button boxSize={"full"} height={10}>
                    Create Game
                  </Button>
                </Box>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }