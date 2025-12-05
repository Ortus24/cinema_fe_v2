import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const SignUpVerify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      userData(token);
    } else {
      router.push("/login?error=missing_token");
    }
  }, [router, searchParams]);

  const userData = async (token: string) => {
    try {
      const userToken = await fetch(
        process.env.BACKEND_URL + `/signup-verify/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tokenVerify = await userToken.json();
      if (tokenVerify.token) {
        localStorage.setItem("token", tokenVerify.token);
        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        router.push("/login?error=invalid_token");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-4 py-60">
        <div className="h-30 w-30 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        <h3 className="text-lg font-medium text-gray-600">
          Đang xử lý đăng nhập...
        </h3>
      </div>
    </div>
  );
};

export default SignUpVerify;
