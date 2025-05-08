import { apiInstance } from "../lib/api";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, logOut } = useAuth();

  const refreshToken = async () => {
    try {

      const response = await apiInstance.get("/auth/refresh-token", {
        withCredentials: true,
      });

      if (response.status === 200 && response.data?.data?.accessToken) {
        setAuth({
          usuario: response.data.data.usuario,
          rol: response.data.data.rol,
          accessToken: response.data.data.accessToken,
        });

        return response.data.data.accessToken;
      }
    } catch (error) {
      await logOut();
    }

    return null;
  };

  return { refreshToken };
};

export default useRefreshToken;
