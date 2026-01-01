"use client";

export default function Privacy() {
  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-vain-primary bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-white/60 text-lg">
          Last updated and effective since: 2025-08-01
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-white/80 mb-6">
          Any information we collect is not used in any malicious manner. If
          anything shown seems misleading, please contact us @{" "}
          <a
            href="mailto:support@vain.bot"
            className="text-vain-primary hover:text-vain-primary/80 transition-colors"
          >
            support@vain.bot
          </a>
        </p>

        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Guild IDs</li>
            <li>Guild Names</li>
            <li>Channel IDs</li>
            <li>Role IDs</li>
            <li>User IDs</li>
            <li>Message Timestamps</li>
            <li>Message IDs</li>
            <li>Past Avatars</li>
            <li>Nicknames and Usernames</li>
            <li>
              Message content when a command is ran (stored for a max of 14
              days) or when arguments are passed for commands
            </li>
            <li>
              Last deleted message content (stored for a max of 2 hours or less)
            </li>
            <li>
              Last message edit history (stored for a max of 2 hours or less)
            </li>
            <li>
              Last Emoji Reaction History (stored for a max of 2 hours or less)
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Why do we need the data and how is it used?
        </h2>
        <p className="text-white/80 mb-6">
          When a command is invoked, we store the message content for a maximum
          of 14 days for debugging purposes. We also store a maximum of 18
          entries for edited messages and sniping messages that will expire in
          two hours or less in volatile memory.
        </p>
        <p className="text-white/80 mb-6">
          Guild IDs, Channel IDs, Role IDs, User IDs and Message IDs are all
          stored for our system to aggregate values to find data.
        </p>
        <p className="text-white/80 mb-6">
          Nickname, Username and Avatar changes are logged in order for the
          "namehistory" and "avatarhistory" commands to function. Users can
          clear this data themselves at any time.
        </p>
        <p className="text-white/80 mb-6">
          Guild name changes are logged in order for the "gnames" command to
          function. Server administrators can clear this data themselves at any
          time.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Who is your collected information shared with?
        </h2>
        <p className="text-white/80 mb-6">
          We do not sell or expose your information to others, and, or third
          parties.
        </p>

        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-4">Data Removal</h2>
          <p className="text-white/80">
            Email{" "}
            <a
              href="mailto:support@vain.bot"
              className="text-vain-primary hover:text-vain-primary/80 transition-colors"
            >
              support@vain.bot
            </a>{" "}
            for all of your data that we are currently storing. Response times
            may vary and could take up to 7 days.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Data Storage and Backups
        </h2>
        <p className="text-white/80 mb-6">
          Our primary data storage is located in New York, New York. For
          redundancy and disaster recovery, we maintain replicated backups
          across data centers in New York, USA and Falkenstein, Germany.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Changes to the Privacy Policy
        </h2>
        <p className="text-white/80 mb-6">
          We can update these terms at any time without notice. Continuing to
          use our services after any changes will mean that you agree with these
          terms and violation of our terms of service could result in a
          permanent ban across all of our services.
        </p>
      </div>
    </div>
  );
}
