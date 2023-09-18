import axiosConfig from "../API/axiosConfig";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosConfig.post(
      "/auth/refreshtoken",
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Token refresh successful: " + response);

    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response);
      console.log(response.data.jwtToken);
      //email, firstName, id, jwtToken, roles
      return {
        email: response.data.email,
        firstName: response.data.firstName,
        id: response.data.id,
        jwtToken: response.data.jwtToken,
        roles: response.data.roles,
      };
    });
    return response.data;
  };

  return refresh;
};

export default useRefreshToken;
