/// <reference types="astro/client" />

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

declare namespace App {
  interface Locals {}
}

interface Env {
  SESSION: KVNamespace;
  CONTACT_EMAIL: string;
  SENDER_EMAIL: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  PUBLIC_TURNSTILE_SITE_KEY: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    CONTACT_EMAIL?: string;
    SENDER_EMAIL?: string;
    RESEND_API_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    PUBLIC_TURNSTILE_SITE_KEY?: string;
  }
}
