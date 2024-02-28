export const environment = {
  environmentName: process.env.FRONTEND_ENVIRONMENT_NAME || 'dev', //dev, stage, prod
  production: process.env.FRONTEND_PRODUCTION || false,
  backendUrl: process.env.FRONTEND_BACKEND_URL || '/api'
};
