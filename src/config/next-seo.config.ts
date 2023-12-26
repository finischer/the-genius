import { type DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "TheGenius",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: process.env.WEBSITE_URL,
    siteName: "TheGenius",
  },
};

export default config;
