import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "../Header";
import { TokenContextProvider } from "../utility/context/TokenContext";

const SFPro = localFont({
  src: "../fonts/SF-Pro.ttf",
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "Diplo Dispatch",
  description:
    "Software designed to ease the management of dispatching organizations",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="winter">
      <body
        className={`${SFPro.variable} h-screen w-screen font-sf-pro font-light`}
      >
        <TokenContextProvider>
          <Header />
          {children}
        </TokenContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
