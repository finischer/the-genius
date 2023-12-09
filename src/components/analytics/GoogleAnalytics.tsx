import { useSessionStorage } from "@mantine/hooks";
import Script from "next/script";
import { isProduction } from "~/utils/environment";
import CookieBanner from "../CookieBanner";
import { useState } from "react";

export enum CookieBannerAction {
  ACCEPT = "ACCEPT",
  DECLINE = "DECLINE",
}

const GoogleAnalytics = () => {
  const [analytics, setAnalytics] = useSessionStorage<boolean | undefined>({
    key: "analytics",
    defaultValue: undefined,
  });

  const [showCookieBanner, setShowCookieBanner] = useState(true);

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

  if (!isProduction) return <></>; // dont use Analytics in other environment than production

  return (
    <>
      {!analytics && showCookieBanner && <CookieBanner onButtonClick={handleCookieBannerButtonClick} />}
      {analytics && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-76C2HLVDTN" />
          <Script id="google-analytics">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-76C2HLVDTN');
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default GoogleAnalytics;
