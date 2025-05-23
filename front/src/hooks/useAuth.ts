import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.usuario ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
};

export { useAuth };
