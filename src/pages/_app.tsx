import { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyles } from "styles";
import { Header, Footer } from "collections";
import { configureChains, createClient, goerli, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { SessionProvider } from "next-auth/react";
import { authAxios } from "services";

const tagManagerArgs = {
  gtmId: "GTM-XXXXXXX"
};

interface AppProps {
  Component: React.FC;
  pageProps: any;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    document.addEventListener(
      "visibilitychange",
      authAxios.POST.token.renewJwtOnWindowVisibilityChange
    );
    authAxios.POST.token.autoRefreshJwtToken();
    return () => {
      document.removeEventListener(
        "visibilitychange",
        authAxios.POST.token.renewJwtOnWindowVisibilityChange
      );
    };
  }, []);

  const { chains, provider, webSocketProvider } = configureChains(
    [goerli, mainnet],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider
  });

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>app title goes here</title>
        <meta name='description' content='app description goes here' />

        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no' />

        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GlobalStyles />
      <WagmiConfig client={client}>
        <SessionProvider session={session}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </SessionProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
