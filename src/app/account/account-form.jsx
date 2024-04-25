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
          Image} from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

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
        setAvatarUrl("profile_"+data.avatar+".png");
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

  async function updateProfile({ username_, website_, avatarUrl_ }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullname,
        username_,
        website_,
        avatarUrl_,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              
        <Divider />
        <CardFooter>
          <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue'>
              Buy now
            </Button>
            <Button variant='ghost' colorScheme='blue'>
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
    <Box flex='1' bg='tomato'>
      <label htmlFor="email">Email</label>
      <Input id="email" type="text" value={user.email} disabled />
    </Box>
  </Flex>



    // <div className="form-widget">
    //   <Box>
    //     <Avatar></Avatar>
    //   </Box>
    //   <div>
    //     <label htmlFor="email">Email</label>
    //     <Input id="email" type="text" value={user.email} disabled />
    //   </div>
    //   <div>
    //     <label htmlFor="fullName">Full Name</label>
    //     <Input
    //       id="fullName"
    //       type="text"
    //       value={fullname || ""}
    //       onChange={(e) => setFullname(e.target.value)}
    //       disabled={loading}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="username">Username</label>
    //     <Input
    //       id="username"
    //       type="text"
    //       value={username || ""}
    //       onChange={(e) => setUsername(e.target.value)}
    //       disabled={loading}
    //     />
    //   </div>
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

    //   <div>
    //     <button
    //       type="button"
    //       className="button primary block"
    //       onClick={() =>
    //         updateProfile({
    //           fullname,
    //           username,
    //           website,
    //           avatar_url: avatarUrl,
    //         })
    //       }
    //       disabled={loading}
    //     >
    //       {loading ? "Loading ..." : "Update"}
    //     </button>
    //   </div>

    //   <div>
    //     <form action="/auth/signout" method="post">
    //       <button className="button block" type="submit">
    //         Sign out
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}
