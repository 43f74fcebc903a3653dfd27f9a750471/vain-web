module.exports = {
  apps: [
    {
      name: "vain-web",
      script: "bun",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
