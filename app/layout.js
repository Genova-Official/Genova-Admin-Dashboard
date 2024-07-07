import { Inter } from "next/font/google";
import "./globals.css";
import ConfigLayout from "./ConfigLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Genova web app",
  description: "Join us at Genova",
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
