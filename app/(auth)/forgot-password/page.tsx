"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorMessage from "@/app/types/ErrorMessage";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, [username]);

  const handleConfirmUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/check-if-exists-by-username?username=${username}`,
      );

      if (!response.ok) {
        const error: ErrorMessage = await response.json();
        throw new Error(error.body.detail);
      }

      const exists = await response.json();

      if (exists) {
        router.push(`/reset-password?username=${username}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <main className="relative flex h-full w-full items-center justify-center">
      <section className="relative flex flex-col rounded-lg bg-[rgba(255,255,255,0.5)] p-8 text-gray-950 backdrop-blur-md">
        <div className="border-b border-solid border-b-[#bebebe] px-2 pb-4">
          <h1 className="font-bold">Forgot password?</h1>
          <p className="w-[50ch]">
            Just enter the username in the provided field below and reset the
            password in the following form
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-sm text-red-500">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <form
          className="flex flex-col px-2 pt-4 text-sm"
          onSubmit={(e) => handleConfirmUsername(e)}
        >
          <label htmlFor="username" className="left-4 mb-1 block px-1">
            Username
          </label>
          <div className="relative mb-10">
            <input
              id="username"
              name="username"
              placeholder="Enter your username..."
              type="text"
              value={username}
              autoComplete="off"
              className="input w-full rounded-lg border-2 border-solid border-zinc-400 bg-transparent focus:border-2 focus:border-zinc-400 focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-neutral w-full max-w-xs self-center rounded-full"
          >
            Confirm
          </button>
        </form>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
