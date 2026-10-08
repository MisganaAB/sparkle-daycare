import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const envFile = resolve(backendRoot, '.env');
const dotenvResult = config({ path: envFile });

if (dotenvResult.error && dotenvResult.error.code !== 'ENOENT') {
  throw new Error(`[Config Error] Could not load ${envFile}: ${dotenvResult.error.message}`);
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value || /^(your-|placeholder|[*]+)/i.test(value)) {
    throw new Error(
      `[Config Error] ${name} is missing or still contains a placeholder. Set it in ${envFile}.`
    );
  }
  return value;
}

function getSupabaseUrl() {
  const value = getRequiredEnv('SUPABASE_URL');
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`[Config Error] SUPABASE_URL in ${envFile} must be a valid project URL.`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`[Config Error] SUPABASE_URL in ${envFile} must use http or https.`);
  }

  if (/placeholder|your-project/i.test(url.hostname)) {
    throw new Error(`[Config Error] Replace the SUPABASE_URL placeholder in ${envFile}.`);
  }

  if (/^\/rest\/v1\/?$/.test(url.pathname)) {
    url.pathname = '/';
  } else if (url.pathname !== '/') {
    throw new Error(
      `[Config Error] SUPABASE_URL in ${envFile} must be the project URL without an API path.`
    );
  }

  return url.origin;
}

export const env = {
  PORT: process.env.PORT || '5000',
  SUPABASE_URL: getSupabaseUrl(),
  SUPABASE_ANON_KEY: getRequiredEnv('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
