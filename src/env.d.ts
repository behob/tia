/// <reference types="astro/client" />

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

declare namespace App {
  interface Locals {}
}

interface Env {
  SESSION: KVNamespace;
  CONTACT_EMAIL: string;
  SENDER_EMAIL: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    CONTACT_EMAIL?: string;
    SENDER_EMAIL?: string;
  }
}
