import { BreakpointsValuesType, minWidth, maxWidth } from "styles";
import { useState, useEffect, useMemo } from "react";

/**
 * @example const [isMediumScreenDevice] = useMediaQuery({ type: "max", breakpoint: "M" });
 */
export const useMediaQuery = (query: {
  type: "min" | "max";
  breakpoint: keyof BreakpointsValuesType;
}) => {
  const [breakpointMatched, setBreakpointMatched] = useState(false);

  const mediaQuery = useMemo(
    () => (query.type === "max" ? maxWidth[query.breakpoint] : minWidth[query.breakpoint]),
    [query]
  );

  useEffect(() => {
    const mediaQueryHandler = (event: MediaQueryListEvent) => {
      setBreakpointMatched(event.matches);
    };

    if (window.matchMedia(mediaQuery).matches) {
      setBreakpointMatched(true);
    }

    window.matchMedia(mediaQuery).addEventListener("change", mediaQueryHandler);

    return () => {
      window.matchMedia(mediaQuery).removeEventListener("change", mediaQueryHandler);
    };
  }, [mediaQuery]);

  return [breakpointMatched];
};
