import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import background from "@/public/background.jpg";
import Image from "next/image";

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
    <html lang="en" data-theme="lofi">
      <body
        className={`${SFPro.variable} h-screen w-screen font-sf-pro font-light`}
      >
        {/* Background image */}
        <div className="absolute h-full w-full after:absolute after:h-full after:w-full after:bg-vignette">
          <Image
            alt="Background gradient image"
            src={background}
            fill
            sizes="100vw"
            quality={100}
            className="object-cover blur-sm"
          />
        </div>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
