import React, { createContext, useState, type ReactNode } from "react";
import { type IUsuario } from "@/types/usuario";
import { type IRol } from "@/types/rol";
import { apiInstance } from "@/lib/api";

// Define the type for the authentication state
type AuthState = {
  usuario?: IUsuario;
  rol?: IRol;
  accessToken?: string;
};

// Define the context type
type AuthContextType = {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logOut: () => void;
};

// Create the initial context with empty values
const initialAuthContext: AuthContextType = {
  auth: {
    usuario: undefined,
    rol: undefined,
    accessToken: undefined
  },
  setAuth: () => { },
  logOut: () => { },
};

// Create the authentication context
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// Create the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    usuario: undefined,
    rol: undefined,
    accessToken: undefined,
  });


  const logOut = async () => {

    await apiInstance.post("/auth/logout");

    setAuth({
      usuario: undefined,
      rol: undefined,
      accessToken: undefined,
    });

  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
