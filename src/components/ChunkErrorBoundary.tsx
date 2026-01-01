"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    if (error.name === "ChunkLoadError") {
      return { hasError: true, error };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.name === "ChunkLoadError") {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0B0B]">
          <div className="text-center">
            <h2 className="text-white text-lg mb-4">Loading Error</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-vain-primary/10 hover:bg-vain-primary/20 border border-vain-primary/30 rounded-md text-vain-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
