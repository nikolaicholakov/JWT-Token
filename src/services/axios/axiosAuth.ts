import axios from "axios";
import Cookies from "universal-cookie";
import { decode, JwtPayload } from "jsonwebtoken";
import { Cookie } from "universal-cookie/cjs/types";
import { formatToSeconds, formatToMSForSetInterval } from "utils";

const cookies = new Cookies();

interface JWTToken extends JwtPayload {
  exp: number;
}

const renewJwtOnWindowVisibilityChange = async () => {
  if (document.visibilityState === "visible") {
    const newJwt = await renewJWT();
  } else return;
};

const autoRefreshJwtToken = async () => {
  const jwt = cookies.get("jwt-auth");
  if (!jwt) return;
  const decodedJwt: JWTToken | any = decode(jwt);
  if (!decodedJwt) return;

  const autoRenewJwtToken = async () => {
    const newToken: { jwt: string } = await renewJWT();
    if (newToken) {
      const decodedJWT: Cookie = decode(newToken.jwt);
      if (decodedJWT) {
        cookies.set("jwt-auth", newToken.jwt, {
          // x1000 because new Date expects unix time in milliseconds and decodedJWT.exp is in seconds
          expires: new Date(decodedJWT.exp * 1000)
        });

        // devided by 1000 to convert to seconds because Date.now() returns unix time in milliseconds
        const currentDate = formatToSeconds(Date.now() / 1000);
        const expDate = formatToSeconds(decodedJWT.exp);
        const ms = formatToMSForSetInterval(expDate, currentDate);
        // -5000 to make sure the token is renewed before it expires
        setTimeout(autoRenewJwtToken, ms - 5000);
      }
    }
  };
  autoRenewJwtToken();
};

// AXIOS BASES

const axiosNoAuthBase = axios.create({
  baseURL: "https://ercworldauth20230222200210.azurewebsites.net",
  timeout: 10000
});

const axiosAuthBase = axios.create({
  baseURL: "https://ercworldauth20230222200210.azurewebsites.net",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${cookies.get("jwt-auth")}`
  }
});

// GET

const getNonce = async (wallet: string) => {
  const nonceEndPoint = `/nonce?wallet=${wallet}`;
  try {
    const { data } = await axiosNoAuthBase.get(nonceEndPoint);
    return data.nonce;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

// POST

const loginWithWalletAndSignature = async (wallet: string, signature: string, message: string) => {
  const loginEndPoint = `/login/wallet`;
  try {
    const { data } = await axiosNoAuthBase.post(loginEndPoint, {
      address: wallet,
      msg: message,
      sig: signature
    });
    if (data.jwt) {
      const decodedJWT: Cookie = decode(data.jwt);
      if (decodedJWT && decodedJWT.exp) {
        cookies.set("jwt-auth", data.jwt, {
          // x1000 because new Date expects unix time in milliseconds and decodedJWT.exp is in seconds
          expires: new Date(decodedJWT.exp * 1000)
        });
      }
    }
    return data.jwt;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

const renewJWT = async () => {
  const renewEndPoint = `/renew/wallet`;
  const jwt = cookies.get("jwt-auth");
  if (!jwt) return null;
  try {
    const { data } = await axiosAuthBase.post(renewEndPoint);
    if (data.jwt) {
      const decodedJWT: Cookie = decode(data.jwt);
      if (decodedJWT) {
        cookies.set("jwt-auth", data.jwt, {
          // x1000 because new Date expects unix time in milliseconds and decodedJWT.exp is in seconds
          expires: new Date(decodedJWT.exp * 1000)
        });
      }
    }
    return data;
  } catch (error: any) {
    const Error = error.response.data;
    console.log(Error);
    return null;
  }
};

export const authAxios = {
  GET: {
    nonce: getNonce
  },
  POST: {
    login: {
      wallet: loginWithWalletAndSignature
    },
    token: {
      renewJWT: renewJWT,
      renewJwtOnWindowVisibilityChange,
      autoRefreshJwtToken
    }
  }
};
