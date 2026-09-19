import assert from 'node:assert/strict';
import { handleForm } from '../src/lib/formHandlers.ts';
const env = { CONTACT_EMAIL:'studio@example.test', SENDER_EMAIL:'sender@example.test', RESEND_API_KEY:'test-only', TURNSTILE_SECRET_KEY:'test-only', NEWSLETTER_ENABLED:'true' };
const valid = { fullname:'A Visitor', phone:'+971500000000', email:'visitor@example.test', message:'Please discuss a living room project.', 'cf-turnstile-response':'test-token', consent:'yes' };
const request = (body = valid, options = {}) => new Request('https://example.test/api/mail', { method:'POST', headers:{'Content-Type':'application/json',Origin:'https://example.test',...options.headers}, body:typeof body === 'string' ? body : JSON.stringify(body) });
let calls = [];
const mock = async (url, options) => { calls.push([url,options]); return new Response(JSON.stringify(url.includes('siteverify') ? {success:true} : {id:'mock-id'})); };
const reset=()=>{calls=[];};
assert.equal((await handleForm(request(),env,'contact',mock)).status,200);
assert.equal(calls.length,2);
assert.equal(JSON.parse(calls[1][1].body).reply_to,valid.email);
assert.equal(JSON.parse(calls[1][1].body).to[0],env.CONTACT_EMAIL);
reset();
assert.equal((await handleForm(request(),env,'newsletter',mock)).status,200);
assert.equal(calls[1][0],'https://api.resend.com/contacts');
assert.equal(JSON.parse(calls[1][1].body).unsubscribed,false);
const cases = [
 [{...valid,email:'invalid'},env,'contact',400],
 [{...valid,fullname:{}},env,'contact',400],
 [{...valid,phone:''},env,'contact',400],
 [{...valid,message:'x'.repeat(5001)},env,'contact',400],
 [{...valid,'cf-turnstile-response':''},env,'contact',400],
 [{...valid,consent:''},env,'newsletter',400],
 [valid,{},'contact',503],
 [valid,{...env,NEWSLETTER_ENABLED:'false'},'newsletter',503],
 [{...valid,company_name:'spam'},env,'contact',200],
 ['{',env,'contact',400],
 [null,env,'contact',400],
 ['x'.repeat(20001),env,'contact',413],
];
for (const [body,config,kind,status] of cases) { reset();assert.equal((await handleForm(request(body),config,kind,mock)).status,status);assert.equal(calls.length,0); }
reset();
assert.equal((await handleForm(request(valid,{headers:{Origin:'https://elsewhere.test'}}),env,'contact',mock)).status,403);
assert.equal(calls.length,0);
assert.equal((await handleForm(request(),env,'contact',async()=>new Response('{"success":false}'))).status,400);
let attempt=0;
assert.equal((await handleForm(request(),env,'contact',async()=>++attempt===1?new Response('{"success":true}'):new Response('error',{status:500}))).status,502);
assert.equal((await handleForm(request(),env,'contact',async()=>{throw new Error('timeout');})).status,502);
const form=new Request('https://example.test/api/mail',{method:'POST',body:new URLSearchParams(valid)});
assert.equal((await handleForm(form,env,'contact',mock)).status,200);
console.log('Form tests passed: contact, newsletter, malformed input, limits, origin, honeypot, consent, config, Turnstile and provider failures. All outbound requests mocked.');
