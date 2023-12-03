import Script from "next/script";
import React from "react";
import { isProduction } from "~/utils/environment";

const GoogleAnalytics = () => {
  if (!isProduction) return <></>;

  return (
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
  );
};

export default GoogleAnalytics;
