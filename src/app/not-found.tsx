"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/styles";
import { FaHouse } from "react-icons/fa6";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => router.push("/"), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-lg text-white/60">Page Not Found</p>
      <p className="text-xs text-white/40">
        Redirecting to home in {countdown} seconds...
      </p>
      <Link href="/" className={buttonStyles.primary}>
        Home
        <FaHouse className="w-4 h-4" />
      </Link>
    </div>
  );
}
