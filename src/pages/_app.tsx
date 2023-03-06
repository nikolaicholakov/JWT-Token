import { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyles } from "styles";
import { Header, Footer } from "collections";
import { configureChains, createClient, goerli, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { authAxios } from "services";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// i18n imports
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const bgLocales = require("locales/bg/translation.json");
const enLocales = require("locales/en/translation.json");
const enOne = require("locales/en/home.json");
const bgOne = require("locales/bg/home.json");
// i18n imports

const tagManagerArgs = {
  gtmId: "GTM-XXXXXXX"
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    // initilizes the refresh token timeout
    authAxios.POST.token.autoRefreshJwtToken();

    // adds a listener to renew the jwt token when window tab is visible again
    document.addEventListener(
      "visibilitychange",
      authAxios.POST.token.renewJwtOnWindowVisibilityChange
    );
    return () => {
      document.removeEventListener(
        "visibilitychange",
        authAxios.POST.token.renewJwtOnWindowVisibilityChange
      );
    };
  }, []);

  // MetaMask Connection Using Wagmi Init
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

  // Content Managment StoryBlok Init
  storyblokInit({
    accessToken: process?.env?.NEXT_PUBLIC_STORYBLOK_PREVIEW_API_KEY,
    use: [apiPlugin]
  });

  // Inerationalization Init
  i18n
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .init({
      debug: true,
      resources: {
        en: {
          translation: enLocales,
          one: enOne
        },
        bg: {
          translation: bgLocales,
          one: bgOne
        }
      },
      fallbackLng: "en",

      interpolation: {
        escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      }
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
        <Header />
        <Component {...pageProps} />
        <Footer />
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
