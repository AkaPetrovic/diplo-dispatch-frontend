"use client";

import { useRouter } from "next/navigation";
import CustomJwtPayload from "../types/CustomJwtPayload";

interface Props {
  decodedToken: CustomJwtPayload | null;
}

const Profile = ({ decodedToken }: Props) => {
  // const { tokenValue, setTokenValue } = useContext(TokenContext);
  const router = useRouter();

  const handleLogout = () => {
    // Clear the JWT token cookie by setting it to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // setTokenValue(null);
    router.push("/login");
  };

  if (decodedToken)
    return (
      <div>
        <div
          tabIndex={0}
          className="peer flex h-full w-36 select-none items-center justify-center rounded-none border-none bg-[rgba(255,255,255,0.5)] text-lg font-light text-gray-950 shadow-none backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)]"
        >
          {decodedToken.sub}
        </div>
        <div className="grid grid-rows-animate-height-closed transition-all duration-200 hover:grid-rows-animate-height-open peer-hover:grid-rows-animate-height-open">
          <ul className="w-36 grid-rows-animate-height-closed overflow-hidden rounded-none shadow">
            <li className="bg-[rgba(255,255,255,0.5)] text-center hover:bg-[rgba(225,225,225,0.5)]">
              <button
                className="h-full w-full px-4 py-2"
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    );

  return null;
};

export default Profile;
