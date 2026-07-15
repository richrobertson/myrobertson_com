import worker from '../worker.js';

const CANONICAL_ORIGIN = 'https://www.myrobertson.com';

const assertions = [
  ['archive retirement /writing', '/writing', '/blog/'],
  ['archive retirement /writing/', '/writing/', '/blog/'],
  ['archive retirement /writing/index.html', '/writing/index.html', '/blog/'],

  ['legacy alias backpressure', '/writing/backpressure-in-distributed-systems', '/blog/backpressure-stability-correctness-distributed-systems'],
  ['legacy alias control-plane article', '/writing/architecting-a-multitenant-control-plane', '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier'],
  ['legacy alias lease-service article', '/writing/designing-a-correct-distributed-lease-service-tenure-on-raft', '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft'],
  ['legacy alias state-management article', '/writing/state-management-in-distributed-control-systems', '/blog/state-management-in-distributed-control-systems'],

  ['blog html normalization test-driven-ai', '/blog/test-driven-ai-development.html', '/blog/test-driven-ai-development'],
  ['blog html normalization eventual-consistency', '/blog/what-is-eventual-consistency.html', '/blog/what-is-eventual-consistency'],

  ['top-level extensionless ask-rich', '/ask-rich.html', '/ask-rich'],
  ['top-level extensionless career-arc', '/career-arc.html', '/career-arc'],

  ['unknown retired writing fallback', '/writing/some-unknown-legacy-page', '/blog/']
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getEnv() {
  return {
    ASSETS: {
      async fetch(request) {
        const url = new URL(request.url);
        return new Response(`asset:${url.pathname}`, {
          status: 200,
          headers: {
            'x-asset-path': url.pathname
          }
        });
      }
    }
  };
}

for (const [name, inputPath, expectedPath] of assertions) {
  const request = new Request(`${CANONICAL_ORIGIN}${inputPath}`);
  const response = await worker.fetch(request, getEnv());

  assert(response.status === 301, `${name}: expected 301, got ${response.status}`);

  const location = response.headers.get('location');
  assert(location, `${name}: redirect missing location header`);

  const actualPath = new URL(location).pathname;
  assert(actualPath === expectedPath, `${name}: expected ${expectedPath}, got ${actualPath}`);
}

{
  const request = new Request(`${CANONICAL_ORIGIN}/blog/end-to-end-overload-control-in-distributed-systems`);
  const response = await worker.fetch(request, getEnv());
  const rewrittenPath = response.headers.get('x-asset-path');

  assert(response.status === 200, `asset rewrite: expected 200, got ${response.status}`);
  assert(
    rewrittenPath === '/writing/end-to-end-overload-control-in-distributed-systems/index.html',
    `asset rewrite: expected /writing/end-to-end-overload-control-in-distributed-systems/index.html, got ${rewrittenPath}`
  );
}

{
  const request = new Request(`${CANONICAL_ORIGIN}/blog/state-management-in-distributed-control-systems`);
  const response = await worker.fetch(request, getEnv());
  const rewrittenPath = response.headers.get('x-asset-path');

  assert(response.status === 200, `state-management asset rewrite: expected 200, got ${response.status}`);
  assert(
    rewrittenPath === '/writing/state-management-in-distributed-control-systems/index.html',
    `state-management asset rewrite: expected /writing/state-management-in-distributed-control-systems/index.html, got ${rewrittenPath}`
  );
}

console.log(`Route assertions passed (${assertions.length + 2} checks).`);
