"use client";

import { useState } from "react";
import { FaSquareRootVariable } from "react-icons/fa6";
import { Pagination } from "../avatars/Pagination";

export const EmbedVariables = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const getPageTitle = () => {
    switch (currentPage) {
      case 1:
        return "User";
      case 2:
        return "Server";
      case 3:
        return "Channel";
      default:
        return "";
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{user}"}
              </code>
              <span className="text-white/70 text-xs">User#Tag</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{user.id}"}
              </code>
              <span className="text-white/70 text-xs">User ID</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{user.name}"}
              </code>
              <span className="text-white/70 text-xs">Username</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{user.mention}"}
              </code>
              <span className="text-white/70 text-xs">User mention</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{user.avatar}"}
              </code>
              <span className="text-white/70 text-xs">User avatar URL</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{guild.name}"}
              </code>
              <span className="text-white/70 text-xs">Server name</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{guild.id}"}
              </code>
              <span className="text-white/70 text-xs">Server ID</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{guild.count}"}
              </code>
              <span className="text-white/70 text-xs">Member count</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{guild.icon}"}
              </code>
              <span className="text-white/70 text-xs">Server icon URL</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{guild.boost_count}"}
              </code>
              <span className="text-white/70 text-xs">Boost count</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{channel}"}
              </code>
              <span className="text-white/70 text-xs">Channel mention</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{channel.name}"}
              </code>
              <span className="text-white/70 text-xs">Channel name</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{channel.id}"}
              </code>
              <span className="text-white/70 text-xs">Channel ID</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{channel.topic}"}
              </code>
              <span className="text-white/70 text-xs">Channel topic</span>
            </div>
            <div className="flex flex-col space-y-2">
              <code className="bg-vain-400/20 px-2 py-1 rounded-md text-white/90 font-mono text-sm border border-white/[0.08]">
                {"{channel.position}"}
              </code>
              <span className="text-white/70 text-xs">Channel position</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black/20 border border-white/[0.08] rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="px-3 py-2 flex-shrink-0">
        <div className="flex items-center">
          <div className="p-1.5 rounded-lg bg-black/30 border border-white/20 mr-2">
            <FaSquareRootVariable className="w-4 h-4 text-vain-primary/80" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Variables — {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="px-3 pb-3 flex-1">{renderPage()}</div>

      <div className="flex-shrink-0 px-3 pb-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
