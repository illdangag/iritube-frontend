const process = require('process');

const projectId = process.env.project_id;
const apiKey = process.env.api_key;
const authDomain = process.env.auth_domain;
const backendURL = process.env.backend_url;

module.exports = (phase) => {
  return {
    env: {
      projectId,
      apiKey,
      authDomain,
      backendURL,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};
