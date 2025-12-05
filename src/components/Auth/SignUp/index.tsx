"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/components/Layout/Header/BrandLogo/Logo";
import { useState } from "react";
const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    setLoading(true);

    try {
      const data = new FormData(form);
      const res = await fetch(
        "https://cinema-booking-l32q.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(data.entries())),
        }
      );
      const result = await res.json();
      if (!result.error) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra tài khoản để kích hoạt tài khoản.",
          {
            duration: 7000,
          }
        );
        form.reset();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignUp />

      <span className="z-1 relative my-8 block text-center">
        <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-black/10 dark:bg-white/20"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-black">
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="phone"
            placeholder="Phone"
            name="phone"
            required
            className="w-full rounded-md border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-md border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:!bg-darkprimary disabled:cursor-not-allowed disabled:opacity-60 dark:hover:!bg-darkprimary"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>

      <p className="text-center mb-4 text-base">
        By creating an account you are agree with our{" "}
        <Link href="/" className="text-primary hover:underline">
          Privacy
        </Link>{" "}
        and{" "}
        <Link href="/" className="text-primary hover:underline">
          Policy
        </Link>
      </p>

      <p className="text-center text-base">
        Already have an account?
        <Link
          href="/signin"
          className="pl-2 text-primary hover:bg-darkprimary hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
