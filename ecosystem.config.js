module.exports = {
  apps : [
  {
    name: "front",
    script: "npm",
    // cwd : '/home/XXXX/YYYY/',
    env: {
      PORT: 3000,
      NODE_ENV: "development",
    },
    env_production: {
      PORT: 3000,
      NODE_ENV: "production",
    }
  }
  ]
}
