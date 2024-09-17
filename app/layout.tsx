import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const SFPro = localFont({
  src: "./fonts/SF-Pro.ttf",
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
        className={`${SFPro.variable} font-sf-pro font-light h-screen w-screen`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
