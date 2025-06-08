const process = require('process');

const projectId = process.env.project_id;
const apiKey = process.env.api_key;
const authDomain = process.env.auth_domain;
const backendURL = process.env.backend_url;

module.exports = (phase) => {
  console.log(`project id: ${projectId}`);
  console.log(`api key: ${apiKey}`);
  console.log(`auth domain: ${authDomain}`);
  console.log(`backend URL: ${backendURL}`);

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
