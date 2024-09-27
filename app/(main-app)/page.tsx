import Image from "next/image";
import background from "@/public/background.jpg";
import { cookies } from "next/headers";
import { decodeToken } from "../utility/auth";
import MainMenu from "../components/MainMenu";

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
        <div className="absolute w-full">
          <MainMenu userRole={role} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
