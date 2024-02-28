import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Register
function register(username, email, password) {
  console.log("hi");
  return api.post("/auth/register", { username, email, password });
}

// Login
function login(username, password) {
  return api.post("/auth/login", { username, password });
}

// export the service
export { register, login };
