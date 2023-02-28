import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://ercworldauth20230222200210.azurewebsites.net",
  timeout: 1000
});

const getNonce = async (wallet: string) => {
  const nonceEndPoint = `/nonce?wallet=${wallet}`;
  const { data } = await axiosBase.get(nonceEndPoint);

  return data.nonce;
};

const loginWithWalletAndSignature = async (wallet: string, signature: string, message: string) => {
  const loginEndPoint = `/login/wallet`;
  const { data } = await axiosBase.post(loginEndPoint, {
    address: wallet,
    msg: message,
    sig: signature
  });

  return data;
};

export const authAxios = {
  GET: {
    nonce: getNonce
  },
  POST: {
    login: {
      wallet: loginWithWalletAndSignature
    }
  }
};
