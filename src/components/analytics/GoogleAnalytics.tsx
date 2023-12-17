import { useLocalStorage } from "@mantine/hooks";
import Script from "next/script";
import { isProduction } from "~/utils/environment";
import CookieBanner from "../CookieBanner";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

export enum CookieBannerAction {
  ACCEPT = "ACCEPT",
  DECLINE = "DECLINE",
}

const GoogleAnalytics = () => {
  const [rendered, setRendered] = useState(false);
  const [analytics, setAnalytics] = useLocalStorage<boolean | undefined>({
    key: "analytics",
    defaultValue: undefined,
  });

  const [showCookieBanner, setShowCookieBanner] = useLocalStorage<boolean | undefined>({
    key: "cookie-banner",
    defaultValue: true,
  });

  const gTagId = env.NEXT_PUBLIC_GTAG_ID;

  console.log("GTAG-ID: ", gTagId);
  console.log("NODE_ENV: ", env.NODE_ENV);

  useEffect(() => {
    setRendered(true);
  }, []);

  const handleCookieBannerButtonClick = (action: CookieBannerAction) => {
    if (action === CookieBannerAction.ACCEPT) {
      acceptCookies();
    } else if (action === CookieBannerAction.DECLINE) {
      declineCookies();
    }
  };

  const acceptCookies = () => {
    setAnalytics(true);
    setShowCookieBanner(false);
  };

  const declineCookies = () => {
    setAnalytics(false);
    setShowCookieBanner(false);
  };

  if (!isProduction || !gTagId) return <></>; // dont use Analytics in other environment than production

  return (
    <>
      {showCookieBanner && rendered && <CookieBanner onButtonClick={handleCookieBannerButtonClick} />}
      {analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gTagId}`} />
          <Script id="google-analytics">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', ${gTagId} );
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default GoogleAnalytics;
