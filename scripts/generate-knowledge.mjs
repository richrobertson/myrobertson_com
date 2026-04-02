import { writeFileSync } from 'node:fs';

const site = 'https://www.myrobertson.com';
const generatedAt = new Date().toISOString();

const entries = [
  {
    title: 'Distributed Systems',
    url: `${site}/distributed-systems/`,
    contentType: 'topic',
    summary: 'Topic hub for distributed systems work: control planes, migration safety, coordination, and reliability under load.',
    tags: ['distributed systems', 'control planes', 'reliability', 'migration safety'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 1
  },
  {
    title: 'Oracle Customer Notification Service OCI Migration Case Study',
    url: `${site}/case-studies/oracle-cns-oci-migration/`,
    contentType: 'case-study',
    summary: 'Flagship migration artifact covering OCI rollout safety across 32 global data centers.',
    tags: ['OCI migration', 'distributed systems', 'rollout safety', 'operability'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 1
  },
  {
    title: 'Backpressure in Distributed Systems: Stability, Correctness, and Graceful Degradation',
    url: `${site}/writing/backpressure-in-distributed-systems/`,
    contentType: 'article',
    summary: 'Backpressure, bounded queues, and admission control patterns for overload resilience.',
    tags: ['backpressure', 'graceful degradation', 'backend reliability'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    title: 'Architecting a Multitenant Control Plane',
    url: `${site}/writing/architecting-a-multitenant-control-plane/`,
    contentType: 'article',
    summary: 'Control-plane architecture patterns for durable workflows and multitenant execution.',
    tags: ['control planes', 'workflow orchestration', 'distributed systems'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    title: 'Designing a Correct Distributed Lease Service: Tenure on Raft',
    url: `${site}/writing/designing-a-correct-distributed-lease-service-tenure-on-raft/`,
    contentType: 'article',
    summary: 'Correctness-oriented lease semantics, fencing tokens, and coordination under failure.',
    tags: ['distributed coordination', 'leases', 'fencing tokens', 'correctness'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    title: 'Modernizing Java Services Without Breaking Production',
    url: `${site}/writing/modernizing-java-services-without-breaking-production/`,
    contentType: 'article',
    summary: 'Java modernization patterns for compatibility validation and rollout safety.',
    tags: ['java modernization', 'migration safety', 'compatibility'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    title: 'Starbucks Loyalty Platform Integration Case Study',
    url: `${site}/case-studies/starbucks-loyalty-platform-integration/`,
    contentType: 'case-study',
    summary: 'Integration and migration work supporting loyalty systems at scale with continuity constraints.',
    tags: ['integration', 'migration', 'operability'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    title: 'Distributed Systems Writing',
    url: `${site}/writing/`,
    contentType: 'index',
    summary: 'Technical writing index for distributed systems, control planes, and reliability under load.',
    tags: ['writing', 'distributed systems', 'reliability'],
    updatedDate: '2026-04-02',
    importance: 3
  },
  {
    title: 'Case Studies',
    url: `${site}/case-studies/`,
    contentType: 'index',
    summary: 'Case study index spanning OCI migration, control-plane platforms, and modernization delivery.',
    tags: ['case studies', 'migration', 'platform modernization'],
    updatedDate: '2026-04-02',
    importance: 3
  }
];

const payload = {
  version: 1,
  generatedAt,
  canonical: `${site}/knowledge.json`,
  entries
};

writeFileSync('knowledge.json', `${JSON.stringify(payload, null, 2)}
`);
console.log(`knowledge.json updated with ${entries.length} entries`);
