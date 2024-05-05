// AuthContext.js
// import { createContext, useContext, useState } from 'react';

// import createClient from "@/utils/supabase/server";


// const AuthContext = createContext();

export default async function checkUser() {
  
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const { data: allGames } = await supabase.from("games").select("*, profiles!inner(username)");
  return (user);
};

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // User state, null if not logged in

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
