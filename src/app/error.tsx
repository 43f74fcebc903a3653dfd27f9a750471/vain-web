"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/styles";
import { FaHouse, FaArrowLeft } from "react-icons/fa6";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [canItGoBack, setCanItGoBack] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkHistory = () => {
      const hasHistory = window.history.length > 1;
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      const isFromSameOrigin = referrer.startsWith(currentOrigin);
      const isFromRoot =
        referrer === currentOrigin + "/" || referrer === currentOrigin;

      setCanItGoBack(hasHistory && isFromSameOrigin && !isFromRoot);
    };

    checkHistory();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <h1 className="text-6xl font-bold text-white">Error</h1>
      <p className="text-lg text-white/60">Something went wrong</p>
      {error.message && (
        <p className="text-xs text-white/40 text-center max-w-md">
          {error.message}
        </p>
      )}
      <p className="text-xs text-white/30">
        Check your browser's console for more details.
      </p>
      <div className="flex gap-2">
        {canItGoBack && (
          <button onClick={handleGoBack} className={buttonStyles.secondary}>
            Go Back
            <FaArrowLeft className="w-4 h-4" />
          </button>
        )}
        <Link href="/" className={buttonStyles.primary}>
          Home
          <FaHouse className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
