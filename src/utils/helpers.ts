import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { KeyOfType } from "types";
import { UrlObject } from "url";

export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

/**
 * Object.keys() fully typed alias
 */
export const objectKeys = Object.keys as <T extends object>(obj: T) => Array<KeyOfType<T>>;

/**
 * Shallow routing allows you to change the URL without running data fetching methods again, that includes getServerSideProps, getStaticProps, and getInitialProps.
 * You'll receive the updated pathname and the query via the router object (added by useRouter or withRouter), without losing state.
 * @param router Next.js router object added by useRouter or withRouter
 * @param pathname The path for current route file that comes after /pages
 * @param query Query string or object representing the query string to be replaced in the url
 *
 * @example shallowReplaceQuery(router, "/", "page=1&resultsPerPage=10");
 * @example shallowReplaceQuery(router, "/", { page: 1, resultsPerPage: 10 });
 */
export const shallowReplaceQuery = (
  router: NextRouter,
  pathname: UrlObject["pathname"],
  query?: string | null | ParsedUrlQueryInput | undefined
) => {
  router.replace(
    {
      pathname,
      query
    },
    undefined,
    { shallow: true }
  );
};
