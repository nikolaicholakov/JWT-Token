import React, { RefObject, useEffect, useState } from "react";
import * as S from "./elements";
import { useConnect, useAccount, useSigner } from "wagmi";
import { authAxios } from "services";
import Cookies from "universal-cookie";

interface HeroProps {
  ref?: RefObject<HTMLDivElement>;
}

const cookies = new Cookies();

const jwtCookie = cookies.get("jwt-auth");

export const Hero: React.FC<HeroProps> = ({ ...props }) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [error, setError] = useState("");
  const { data: signer, refetch } = useSigner();

  const login = async (address: string) => {
    if (!signer) {
      return alert("Signer was not loaded, try one more time");
    }
    try {
      const nonce = await authAxios.GET.nonce(address);
      const signature = await signer?.signMessage(nonce);
      const jwt = await authAxios.POST.login.wallet(address, signature, nonce);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renewToken = async () => {
    if (!jwtCookie) return alert("No jwt in cookies");
    try {
      const renewedJwt = await authAxios.POST.token.renewJWT();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <S.Container {...props}>
      {jwtCookie && <span>JWT Token: {jwtCookie}</span>}
      <br />
      {address ? (
        <>
          <span>adress : {address}</span>
          <button onClick={() => login(address)}>Get Token</button>
          <button onClick={() => renewToken()}>Renew Token</button>
        </>
      ) : (
        <>
          {connectors.map(connector => (
            <S.Btn key={connector.name} onClick={() => connect({ connector })}>
              <div key={connector.id}>
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
              </div>
            </S.Btn>
          ))}
        </>
      )}
    </S.Container>
  );
};
