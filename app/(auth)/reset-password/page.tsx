"use client";

import DialogModal from "@/app/components/DialogModal";
import ErrorMessage from "@/app/types/ErrorMessage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  searchParams: { username: string };
}

const ResetPasswordPage = ({ searchParams: { username } }: Props) => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [dialogModalMessage, setDialogModalMessage] = useState("");
  const [dialogModalType, setDialogModalType] = useState<"message" | "confirm">(
    "message",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setErrorMessage("");
  }, [newPassword, repeatNewPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === "newPassword"
      ? setNewPassword(e.target.value)
      : setRepeatNewPassword(e.target.value);
  };

  const handleDialogModalClose = () => {
    setIsDialogOpen(false);

    setTimeout(() => {
      router.push("/login");
    }, 350);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewPassword("");
    setRepeatNewPassword("");

    if (newPassword !== repeatNewPassword) {
      setErrorMessage("Passwords do not match");
    }

    const request = { username: username, newPassword: newPassword };

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        },
      );

      if (!response.ok) {
        const error: ErrorMessage = await response.json();
        throw new Error(error.body.detail);
      }

      const result = await response.text();

      setDialogModalType("message");
      setDialogModalMessage(result);
      setIsDialogOpen(true);
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
          <h1 className="font-bold">Reset password</h1>
          <p className="w-[50ch]">
            Please enter the new password in the fields below
          </p>
          {errorMessage ? (
            <p className="w-full max-w-xs text-sm text-red-500">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <form
          className="flex flex-col px-2 pt-4 text-sm"
          onSubmit={(e) => handleResetPassword(e)}
        >
          <label htmlFor="newPassword" className="left-4 mb-1 block px-1">
            New password
          </label>
          <div className="relative mb-3">
            <input
              id="newPassword"
              name="newPassword"
              placeholder="Enter the new password..."
              type="password"
              value={newPassword}
              autoComplete="new-password"
              className="input w-full rounded-lg border-2 border-solid border-zinc-400 bg-transparent focus:border-2 focus:border-zinc-400 focus:outline-none"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="relative mb-10">
            <label
              htmlFor="repeatNewPassword"
              className="left-4 mb-1 block px-1"
            >
              Repeat new password
            </label>
            <input
              id="repeatNewPassword"
              name="repeatNewPassword"
              type="password"
              placeholder="Repeat the new password..."
              value={repeatNewPassword}
              autoComplete="new-password"
              className="input w-full rounded-lg border-2 border-solid border-zinc-400 bg-transparent focus:border-2 focus:border-zinc-400 focus:outline-none"
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-neutral w-full max-w-xs self-center rounded-full"
          >
            Reset password
          </button>
        </form>
      </section>

      {/* Modal dialog box */}
      <DialogModal
        message={dialogModalMessage}
        isOpen={isDialogOpen}
        onClose={handleDialogModalClose}
        type={dialogModalType}
      />
    </main>
  );
};

export default ResetPasswordPage;
