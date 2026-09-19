import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { handleForm } from '../../lib/formHandlers';
export const prerender = false;
export const POST: APIRoute = ({ request }) => handleForm(request, env, 'contact');
