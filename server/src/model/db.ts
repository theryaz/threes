// https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
import mongoose from 'mongoose';
import { logger, loadEnvs } from '../shared';

let MONGO_URL: string;
try{
  let envs = loadEnvs(['MONGO_URL']);
  MONGO_URL = envs['MONGO_URL'];
}catch(e){
  MONGO_URL = 'mongodb://127.0.0.1:27107/veden';
}

logger.info('Connecting to MongoDB: ' + MONGO_URL);
mongoose.connect(MONGO_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error:'));
db.once('open', function() {
  logger.info("MongoDB Connection Open!");
});

export { User, UserModel } from './user.model';
