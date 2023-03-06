import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { getStoryblokApi, ISbStoriesParams } from "@storyblok/react";

export async function getStaticProps({ locale }) {
  const sbContentParams: ISbStoriesParams = {
    version: "draft", // or 'published'
    language: locale,
    fallback_lang: "en"
  };

  const sbDataSourcesParams: ISbStoriesParams = {
    datasource: locale
  };

  const storyblokApi = getStoryblokApi();

  console.log("DATA HOMEPAGE", locale);
  try {
    const { data } = await storyblokApi.get(`cdn/stories/test`, sbContentParams);
    const dataSources = await storyblokApi.get(`cdn/datasource_entries`, sbDataSourcesParams);

    return {
      props: {
        data,
        dataSources
      },
      revalidate: 60
    };
  } catch (e) {
    console.log("ERROR HOMEPAGE", { e });

    return {
      notFound: true,
      revalidate: 60
    };
  }
}

interface TestPageProps {
  data: any;
  dataSources: any;
}

const Test: NextPage<TestPageProps> = ctx => {
  const router = useRouter();
  const { push, locale, pathname, locales, asPath } = router;
  const greeting = ctx.data.story.content.greeting;

  let obj: any = {};

  const dataSources = ctx.dataSources.data.datasource_entries;
  dataSources.forEach((entry: any) => {
    obj[entry.name] = entry.value;
  });

  console.log("DATA SOURCES", obj);
  return (
    <main>
      <h3>Current Locale = {locale}</h3>
      {locales?.map(locale => (
        <Link href={asPath} locale={locale} key={locale}>
          <a>
            <button>Change to {locale}</button>
          </a>
        </Link>
      ))}

      <h1>{obj.greeting}</h1>
      <h2>{obj.welcoming}</h2>
    </main>
  );
};

export default Test;
