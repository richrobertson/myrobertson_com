const MTA_STS_HOST = 'mta-sts.myrobertson.net';
const MTA_STS_PATH = '/.well-known/mta-sts.txt';

export const MTA_STS_POLICY = [
  'version: STSv1',
  'mode: testing',
  'mx: mail.myrobertson.net',
  'max_age: 86400',
  ''
].join('\r\n');

const POLICY_HEADERS = {
  'Cache-Control': 'public, max-age=300',
  'Content-Length': String(new TextEncoder().encode(MTA_STS_POLICY).byteLength),
  'Content-Type': 'text/plain',
  'X-Content-Type-Options': 'nosniff'
};

function notFound() {
  return new Response('Not Found\r\n', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export default {
  fetch(request) {
    const url = new URL(request.url);

    if (url.protocol !== 'https:' || url.hostname !== MTA_STS_HOST || url.pathname !== MTA_STS_PATH) {
      return notFound();
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed\r\n', {
        status: 405,
        headers: {
          Allow: 'GET, HEAD',
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }

    return new Response(request.method === 'HEAD' ? null : MTA_STS_POLICY, {
      status: 200,
      headers: POLICY_HEADERS
    });
  }
};
