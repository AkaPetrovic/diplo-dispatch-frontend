"use client";

import { decodeToken } from "@/app/utility/auth";
import { TokenContext } from "@/app/utility/context/TokenContext";
import background from "@/public/background.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const { setTokenValue } = useContext(TokenContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === "username"
      ? setUsername(e.target.value)
      : setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const token = await response.text();
      document.cookie = `token=${token}; path=/; max-age=${
        60 * 60 * 24
      }; secure; samesite=lax;`;
      setTokenValue(decodeToken(token));
      router.push("/");
    } catch (error) {
      console.error("Login failed. Error:", error);
    }
  };

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

      {/* Login form */}
      <section className="glass relative flex flex-row rounded-lg p-8 text-gray-950">
        <div className="border-r border-solid border-r-[#bebebe] px-8">
          <h1 className="font-bold">Sign in</h1>
          <p>Please sign in using your username and password</p>
        </div>
        <form
          className="flex flex-col px-8 text-sm"
          onSubmit={(e) => handleLogin(e)}
        >
          <label htmlFor="username" className="left-4 mb-1 block px-1">
            Username
          </label>
          <div className="relative mb-3">
            <input
              id="username"
              name="username"
              placeholder="Enter your username..."
              type="text"
              value={username}
              className="input rounded-lg border-2 border-solid border-zinc-400 bg-transparent focus:border-2 focus:border-zinc-400 focus:outline-none"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="relative mb-10">
            <label htmlFor="password" className="left-4 mb-1 block px-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password..."
              value={password}
              className="input rounded-lg border-2 border-solid border-zinc-400 bg-transparent focus:border-2 focus:border-zinc-400 focus:outline-none"
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-neutral rounded-full">
            Login
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;