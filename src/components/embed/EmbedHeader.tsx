"use client";

export const EmbedHeader = () => (
  <div className="flex flex-row gap-5 mb-8 py-4 border-b border-white/10 items-center">
    <div className="flex-grow min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold">
          Embed Builder
        </h1>
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-white/40 text-sm sm:text-base">
          Create custom Discord embeds with variables
        </span>
      </div>
    </div>
  </div>
);
