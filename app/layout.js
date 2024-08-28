import { Inter } from "next/font/google";
import "./globals.css";
import ConfigLayout from "./ConfigLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Genova",
  description: "Welcome to Genova",
  openGraph: {
    title: "Genova",
    description: "Genova",
    url: "https://genova.com.ng",
    siteName: "Genova",
    images: [
      {
        url: "https://genova.com.ng/og-image.png",
        width: 800,
        height: 600,
        alt: "Genova OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/genova.jpg",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/genova.jpg",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/genova.jpg",
        sizes: "16x16",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },

};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigLayout>{children}</ConfigLayout>
      </body>
    </html>
  );
}
