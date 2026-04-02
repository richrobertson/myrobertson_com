import { articleNode, breadcrumbNode, graphJson, personNode, websiteNode } from './structured-data.mjs';

const homePageNode = articleNode({
  type: 'WebPage',
  id: 'https://www.myrobertson.com/#main',
  headline: 'Senior backend engineer for distributed systems, control planes, and platform modernization.',
  description:
    'Senior backend engineer focused on distributed systems, control planes, cloud modernization, and production reliability.',
  url: 'https://www.myrobertson.com/',
  datePublished: '2026-03-13T10:30:47-07:00',
  dateModified: '2026-04-02T00:00:00-07:00',
  keywords: ['distributed systems', 'control planes', 'cloud migration', 'backend reliability'],
  about: ['distributed systems', 'control planes', 'platform modernization', 'operability'],
  citation: [
    {
      '@type': 'CreativeWork',
      name: 'Oracle Customer Notification Service migration to OCI across 32 global data centers',
      url: 'https://www.myrobertson.com/case-studies/oracle-cns-oci-migration/'
    }
  ]
});

const breadcrumbs = breadcrumbNode([{ name: 'Home', url: 'https://www.myrobertson.com/' }]);

process.stdout.write(`${graphJson(personNode, websiteNode, homePageNode, breadcrumbs)}\n`);
