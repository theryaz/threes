import { loadEnvs } from "../../shared";

const configEnvs = loadEnvs([
  'SOCKET_EXPIRY_INTERVAL'
], false);

export const CONFIG = {
  SOCKETS:{
    EXPIRY_INTERVAL: +configEnvs['SOCKET_EXPIRY_INTERVAL'] || (60 * 1000)
  },
};