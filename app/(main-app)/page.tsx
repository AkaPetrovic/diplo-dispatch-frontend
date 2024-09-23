import Image from "next/image";
import background from "@/public/background.jpg";
import MainMenu from "../MainMenu";
import { cookies } from "next/headers";
import { decodeToken } from "../utility/auth";

const HomePage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const decodedToken = decodeToken(token);
  const role = decodedToken && decodedToken.role ? decodedToken.role : null;

  return (
    <main className="relative flex h-full w-full items-center justify-center">
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

      <div className="relative w-1/4 text-xl font-normal text-gray-950">
        <h1 className="mb-3 animate-fade-in text-center text-3xl font-medium opacity-0 animation-delay-700 animation-duration-300">
          Main menu
        </h1>
        <MainMenu userRole={role} />
      </div>
    </main>
  );
};

export default HomePage;
