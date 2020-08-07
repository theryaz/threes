import { loadEnvs } from "../../shared";

const configEnvs = loadEnvs([
  'REDIS_HOST',
  'REDIS_PORT',
  'SOCKET_EXPIRY_INTERVAL',
], false);

export const CONFIG = {
  REDIS:{
    HOST: configEnvs['REDIS_HOST'] || 'redis',
    PORT: +configEnvs['REDIS_PORT'] || 6379,
  },
  SOCKETS:{
    EXPIRY_INTERVAL: +configEnvs['SOCKET_EXPIRY_INTERVAL'] || (60 * 1000)
  },
};