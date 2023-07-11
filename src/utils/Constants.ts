import { getEnv } from './Helpers';

export const SETTINGS = {
  VALID_FILE_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
  MAX_FILE_SIZE: 1024 * 1024 * 10, // 10 MiB,
  FILE_STORE_CACHE_RESET_MS: 1000 * 60 * 60 * 24 // 1 day
};

export const BACKEND = {
  PORT: getEnv('BACKEND_PORT')
};

export const AWS_CONFIG = {
  BUCKET_NAME: getEnv('AWS_BUCKET_NAME'),
  BUCKET_REGION: getEnv('AWS_BUCKET_REGION'),
  ACCESS_KEY: getEnv('AWS_ACCESS_KEY'),
  SECRET_ACCESS_KEY: getEnv('AWS_SECRET_ACCESS_KEY')
};
