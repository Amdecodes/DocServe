module.exports = {
  apps: [
    {
      name: "senedx-app",
      script: "node",
      args: ".next/standalone/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0"
      },
    },
  ],
};
