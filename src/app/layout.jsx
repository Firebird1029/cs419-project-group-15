// "use client"
import { Inter } from "next/font/google";

import { ChakraProvider } from "@chakra-ui/react"
import WithSubnavigation from "./components/Navbar"
// import Providers from "./providers"; <Do we even need this file?
import createClient from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

// TODO
// export const metadata = {
//   title: "Games",
//   description: "Games",
// };

export default async function RootLayout({ children }) {
  
  const supabase = createClient();

  // Ensure user is logged in
  const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
  const { data: allGames } = await supabase.from("games").select("*, profiles!inner(username)");
  
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ChakraProvider>
          <div>
            <WithSubnavigation user={user}/>
            {children}
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
}
