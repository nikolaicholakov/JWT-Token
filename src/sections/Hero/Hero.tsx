import React, { RefObject, useEffect, useState } from "react";
import * as S from "./elements";
import { useConnect, useAccount, useSigner } from "wagmi";
import { authAxios } from "services";
import { signIn, useSession } from "next-auth/react";

interface HeroProps {
  ref?: RefObject<HTMLDivElement>;
}

export const Hero: React.FC<HeroProps> = ({ ...props }) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [error, setError] = useState("");
  const { data } = useSession();

  const { data: signer, refetch } = useSigner();

  const login = async (address: string) => {
    if (!signer) {
      refetch();
      return alert("Signer was not loaded, try one more time");
    }
    try {
      const nonce = await authAxios.GET.nonce(address);
      const signature = await signer?.signMessage(nonce);
      const user = await signIn("credentials", {
        address,
        signature,
        message: nonce,
        redirect: false
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  console.log("data", data);

  return (
    <S.Container {...props}>
      <span>{data?.user.jwt}</span>
      {address ? (
        <>
          <span>adress : {address}</span>
          <button onClick={() => login(address)}>Login</button>
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
