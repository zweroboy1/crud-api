import { availableParallelism } from 'os';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const PORT = Number(process.env.PORT) || 4000;
export const WORKERS_COUNT = availableParallelism() - 1;
export const MULTIMODE = process.env.MULTIMODE === 'true';
export const USERS_FILE_PATH = 'users.json';
