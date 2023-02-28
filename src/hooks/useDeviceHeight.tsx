import { useCallback, useEffect, useState } from "react";

/**
 * @remarks used to fix unexpected behavior of css value 100vh on mobile devices
 * @returns [deviceHeight: number]
 * @example const [deviceHeight] = useDeviceHeight();
 */
export const useDeviceHeight = () => {
  const [deviceHeight, setDeviceHeight] = useState(0);

  const resizeHandler = useCallback(() => {
    setDeviceHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    setDeviceHeight(window.innerHeight);

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeHandler]);

  return [deviceHeight];
};
