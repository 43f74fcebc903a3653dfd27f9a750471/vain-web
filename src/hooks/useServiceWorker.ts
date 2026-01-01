"use client";
import { useEffect } from "react";

export function useServiceWorker() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const registerSW = async () => {
                await navigator.serviceWorker.register("/sw.js", {
                    scope: "/",
                    updateViaCache: "none"
                });
            };

            registerSW();
        }
    }, []);
}