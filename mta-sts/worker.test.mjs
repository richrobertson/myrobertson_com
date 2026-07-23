import assert from 'node:assert/strict';
import test from 'node:test';

import worker, { MTA_STS_POLICY } from './worker.js';

const POLICY_URL = 'https://mta-sts.myrobertson.net/.well-known/mta-sts.txt';
const EXPECTED_POLICY = [
  'version: STSv1',
  'mode: enforce',
  'mx: mail.myrobertson.net',
  'max_age: 86400',
  ''
].join('\r\n');

test('GET serves the exact MTA-STS enforcement policy without redirecting', async () => {
  const response = await worker.fetch(new Request(POLICY_URL));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/plain');
  assert.equal(response.headers.get('location'), null);
  assert.equal(response.headers.get('content-length'), String(Buffer.byteLength(EXPECTED_POLICY)));
  assert.equal(MTA_STS_POLICY, EXPECTED_POLICY);
  assert.equal(await response.text(), EXPECTED_POLICY);
});

test('HEAD returns policy headers and no body', async () => {
  const response = await worker.fetch(new Request(POLICY_URL, { method: 'HEAD' }));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/plain');
  assert.equal(response.headers.get('content-length'), String(Buffer.byteLength(EXPECTED_POLICY)));
  assert.equal(response.headers.get('location'), null);
  assert.equal(await response.text(), '');
});

test('unsupported methods receive 405 with the allowed methods', async () => {
  const response = await worker.fetch(new Request(POLICY_URL, { method: 'POST' }));

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
  assert.equal(response.headers.get('location'), null);
});

for (const url of [
  'https://mta-sts.myrobertson.net/',
  'https://mta-sts.myrobertson.net/.well-known/other.txt',
  'https://www.myrobertson.com/.well-known/mta-sts.txt',
  'http://mta-sts.myrobertson.net/.well-known/mta-sts.txt'
]) {
  test(`non-policy request receives 404 without redirect: ${url}`, async () => {
    const response = await worker.fetch(new Request(url));

    assert.equal(response.status, 404);
    assert.equal(response.headers.get('location'), null);
  });
}
