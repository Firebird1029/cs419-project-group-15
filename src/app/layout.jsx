import { Inter } from "next/font/google";

import CustomChakraProvider from "@/components/ChakraProvider";
import WithSubnavigation from "./components/Navbar";
import Footer from "./components/Footer";
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
  const { data: allGames } = await supabase
    .from("games")
    .select("*, profiles!inner(username)");

  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <CustomChakraProvider>
          <div>
            <WithSubnavigation user={user} />
            {children}
            <Footer />
          </div>
        </CustomChakraProvider>
      </body>
    </html>
  );
}
