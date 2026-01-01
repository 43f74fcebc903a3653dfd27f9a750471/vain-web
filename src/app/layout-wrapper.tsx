"use client";
import { QueryProvider } from "@/components/QueryProvider";
import { Provider } from "@/components/ui/provider";
import { HeroUIProvider } from "@heroui/react";
import { ChunkErrorBoundary } from "@/components/ChunkErrorBoundary";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // useServiceWorker();
  return (
    <ChunkErrorBoundary>
      <HeroUIProvider>
        <Provider>
          <QueryProvider>{children}</QueryProvider>
        </Provider>
      </HeroUIProvider>
    </ChunkErrorBoundary>
  );
}
