import { useSessionStorage } from "@mantine/hooks";
import Script from "next/script";
import { isProduction } from "~/utils/environment";
import CookieBanner from "../CookieBanner";

const GoogleAnalytics = () => {
  const [analytics, setAnalytics] = useSessionStorage<boolean | undefined>({
    key: "analytics",
    defaultValue: undefined,
  });

  const acceptCookies = () => setAnalytics(true);

  if (!isProduction) return <></>;

  return (
    <>
      {!analytics && <CookieBanner onAcceptCookies={acceptCookies} />}
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
