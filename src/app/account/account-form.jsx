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
          WrapItem, AbsoluteCenter, Alert, AlertIcon, Spinner, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

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
      if (error) throw error;
      setStatus(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function closeSuccess() {
    location.reload();
  }

  function closeError() {
    location.reload();
  }

  return (
    <Box>
          <Flex color='white'>
        {/* <Center w='100px' bg='green.500' size='300px'>
          <Text>Box 1</Text>
        </Center> */}
        {/* <Square bg='blue.500' size='200px'>
          <Text>Box 2</Text>
        </Square> */}
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
                onChange={(e) => setFullname(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <Box margin='5'>
                <Divider />
              </Box>
              <Box margin='2'>
                <Wrap>
                  <WrapItem>
                    <Avatar src='profile_0.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.1.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.1.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.2.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.2.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.3.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.3.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.4.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.4.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.5.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.5.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_0.6.png'
                    onClick={() =>
                      setAvatarUrl('profile_0.6.png')
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_1.png'
                    onClick={() =>
                      setAvatarUrl('profile_1.png')
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_2.png'
                    onClick={() =>
                      setAvatarUrl('profile_2.png')
                    }/>
                  </WrapItem>

                  <WrapItem>
                    <Avatar src='profile_3.png'
                    onClick={() =>
                      setAvatarUrl('profile_3.png')
                    }/>
                  </WrapItem>
                  
                  <WrapItem>
                    <Avatar src='profile_4.png'
                    onClick={() =>
                      setAvatarUrl('profile_4.png')
                    }/>
                  </WrapItem>
                  {/* TODO: */}
                  {/* https://codesandbox.io/p/sandbox/basic-image-upload-e0e6d?file=%2Fsrc%2Findex.tsx */}
                  <WrapItem>
                    <Avatar src='upload.png'
                    onClick={() =>
                      setAvatarUrl('upload.png')
                    }/>
                  </WrapItem>
                </Wrap>
              </Box>
            </CardBody>

            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button 
                  variant='solid' 
                  colorScheme='blue'
                  type="button"
                  className="button primary block"
                  onClick={() =>
                    updateProfile({
                      website,
                    })
                  }
                  disabled={loading}
                >
                  {loading ? "Loading ..." : "Save Changes"}
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
                Error updating the data... Please try again.
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
