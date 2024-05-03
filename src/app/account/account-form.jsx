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
    setAvatarChange(true)
    setSelectedFile(file);
    // You can do further processing with the selected file here
  };

  const disabledVariant = {
    base: {
      bg: "gray.200", // Background color for disabled state
      _hover: {
        bg: "gray.200", // Hover background color for disabled state
      },
      _active: {
        bg: "gray.200", // Active background color for disabled state
      },
    },
  };

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
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
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  
  const checkFileExists = async (bucketName, filePath) => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath)

    if (error) {
      console.error(error)
      return false
  }
  return true;
};

  async function updateProfile({website_}) {
    try {
      setLoading(true);
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullname,
        username: username,
        website_,
        avatar: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      
      if (selectedFile) {
        var exists = await checkFileExists('pfps', user.id + "/uploaded-pfp");
        if (!exists) {
          const { data, error } = await supabase
            .storage
            .from('pfps')
            .upload(user.id + "/uploaded-pfp", selectedFile)
        } else {
          const { data, error } = await supabase
            .storage
            .from('pfps')
            .update(user.id + "/uploaded-pfp", selectedFile, {
              cacheControl: '3600',
              upsert: true
            })
        }
        getMedia();
      }

      if (error) throw error;
      setStatus(true);
    } catch (error) {
      if (error.code == 23505) {
        setError("The username \"" + username + "\" is already taken. Please try a different username.")
      } else {
        setError("Errored with code " + error.code + "... Please try again.")
      }
    } finally {
      setLoading(false);
    }
  }

  async function getMedia() {
    const { data } = supabase
      .storage
      .from('pfps')
      .getPublicUrl(user.id + "/uploaded-pfp")

    if (data) {
      setAvatarUrl(data.publicUrl);
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar: avatarUrl,
        updated_at: new Date().toISOString(),
      });
    } else {
      console.log(71, error);
    }
  }

  function closeSuccess() {
    location.reload();
  }

  function closeError() {
    location.reload();
  }

  function avatarClicked(url) {
    setAvatarUrl(url); 
    if (originalAvatar == url) {
      setAvatarChange(false);
    } else {
      setAvatarChange(true);
    }
  }

  return (
    <Box>
          <Flex color='white'>
        <Box margin='9'>
          <Card maxW='sm' margin=''>
              <CardBody>
                <Box align='center'>
                  <Avatar
                    src={avatarUrl}
                    alt='Users profile pic'
                    size="3xl"
                  />
                </Box>
                
                <Stack mt='6' spacing='3'>
                  <Heading align='center' size='md'>{fullname} @ {username}</Heading>
                  {/* <Text align='center'>
                    This sofa is perfect for modern tropical spaces, baroque inspired
                    spaces, earthy toned spaces and for people who love a chic design with a
                    sprinkle of vintage design.
                  </Text> */}
                  {/* <Text color='blue.600' fontSize='2xl'>
                    $450
                  </Text> */}
                </Stack>
              </CardBody>
                  
            
          </Card>
        </Box>
        <Box flex='1' margin='9'>
          <Card>
            <CardBody>
              <label htmlFor="email">Email</label>
              <Input id="email" type="text" value={user.email} disabled />
              <label htmlFor="fullName">Full Name</label>
              <Input
                id="fullName"
                type="text"
                value={fullname || ""}
                onChange={function nameChanged(e) {
                  setFullname(e.target.value); 
                  if (originalName == e.target.value) {
                    setNameChange(false);
                  } else {
                    setNameChange(true);
                  }
                }}
                disabled={loading}
              />
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={function usernameChanged(e) {
                  setUsername(e.target.value); 
                  if (originalUserName == e.target.value) {
                    setUserChange(false);
                  } else {
                    setUserChange(true);
                  }
                }}
                disabled={loading}
              />
              <Box margin='5'>
                <Divider />
              </Box>
              <Box margin='2'>
                <Wrap>
                  <WrapItem>
                    <Avatar src='profile_0.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.1.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.1.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.2.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.2.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.3.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.3.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.4.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.4.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.5.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.5.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.6.png'
                      onClick={function avatarClick() {avatarClicked('profile_0.6.png')}
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_1.png'
                      onClick={function avatarClick() {avatarClicked('profile_1.png')}
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_2.png'
                      onClick={function avatarClick() {avatarClicked('profile_2.png')}
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_3.png'
                      onClick={function avatarClick() {avatarClicked('profile_3.png')}
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_4.png'
                      onClick={function avatarClick() {avatarClicked('profile_4.png')}
                    }/>
                  </WrapItem>
                  {/* TODO: */}
                  {/* https://codesandbox.io/p/sandbox/basic-image-upload-e0e6d?file=%2Fsrc%2Findex.tsx */}
                  <WrapItem>
                    <Button
                      borderRadius='full'
                      boxSize='55px'
                      onClick={handleButtonClick} // Trigger file input click on button click
                    >
                      <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange} // Capture file selection
                        height="100%"
                        width="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        opacity="0"
                        aria-hidden="true"
                        accept="image/*" // Adjust accept attribute to only accept image files
                      />
                      <Avatar src='upload-file.png' />
                    </Button>
                    
                  </WrapItem>
                </Wrap>
              </Box>
            </CardBody>

            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
              <Button 
                // variant='solid' 
                colorScheme='blue'
                type="button"
                className="button primary block"
                disabled={loading || (!usernameChanged && !nameChanged && !avatarChanged)}
                variant={loading || (!usernameChanged && !nameChanged && !avatarChanged) ? "disabled" : "solid"}
                pointerEvents={loading || (!usernameChanged && !nameChanged && !avatarChanged) ? "none" : "auto"} // Disable pointer events when button is disabled
                onClick={() =>
                  updateProfile({
                    website,
                  })
                }
              >
                {loading ? "Loading ..." : (!usernameChanged && !nameChanged && !avatarChanged) ? "No Changes" : "Save Changes"}
              </Button>

                <form action="/auth/signout" method="post">
                  <Button variant='ghost' colorScheme='blue' className="button block" type="submit">
                    Log Out
                  </Button>
                </form>
                
              </ButtonGroup>
            </CardFooter>

          </Card>
        </Box>
        
      </Flex>
      <Box>
        {loading && (
          <Alert status='info' height='40' alignItems='center'
          justifyContent='center'>
            <AlertIcon />
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              margin='10'/>
               Website is loading
          </Alert>)
        }
        {status && (
            <Alert status='success'
            alignItems='center'
            justifyContent='center'
            height='40'>
            <AlertIcon />
            <Box>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your account settings have been updated. Please close this alert to reload and apply your changes.
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf='flex-start'
              position='relative'
              right={-1}
              top={-1}
              onClick={closeSuccess}
            />
          </Alert>
          )
        }
        {error && (
            <Alert status='error'
            alignItems='center'
            justifyContent='center'
            height='40'>
            <AlertIcon />
            <Box>
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                Error updating the data. {error}
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf='flex-start'
              position='relative'
              right={-1}
              top={-1}
              onClick={closeError}
            />
          </Alert>
          )
        }
      </Box>
    </Box>
    
  
    //   <div>
    //     <label htmlFor="website">Website</label>
    //     <Input
    //       id="website"
    //       type="url"
    //       value={website || ""}
    //       onChange={(e) => setWebsite(e.target.value)}
    //       disabled={loading}
    //     />
    //   </div>

  );
}
