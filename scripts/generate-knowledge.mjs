import { writeFileSync } from 'node:fs';

const site = 'https://www.myrobertson.com';

const pages = [
  {
    id: 'page:distributed-systems',
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
    id: 'page:oracle-cns-oci-migration',
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
    id: 'page:backpressure-in-distributed-systems',
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
    id: 'page:architecting-a-multitenant-control-plane',
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
    id: 'page:distributed-lease-service',
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
    id: 'page:modernizing-java-services',
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
    id: 'page:starbucks-loyalty-platform-integration',
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
    id: 'page:distributed-systems-writing',
    title: 'Distributed Systems Writing',
    url: `${site}/writing/`,
    contentType: 'index',
    summary: 'Technical writing index for distributed systems, control planes, and reliability under load.',
    tags: ['writing', 'distributed systems', 'reliability'],
    updatedDate: '2026-04-02',
    importance: 3
  },
  {
    id: 'page:case-studies',
    title: 'Case Studies',
    url: `${site}/case-studies/`,
    contentType: 'index',
    summary: 'Case study index spanning OCI migration, control-plane platforms, and modernization delivery.',
    tags: ['case studies', 'migration', 'platform modernization'],
    updatedDate: '2026-04-02',
    importance: 3
  }
];

const normalizeTag = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const tagById = new Map();
const nodes = [];
const edges = [];

for (const page of pages) {
  nodes.push({
    id: page.id,
    nodeType: 'page',
    title: page.title,
    url: page.url,
    contentType: page.contentType,
    summary: page.summary,
    publishedDate: page.publishedDate,
    updatedDate: page.updatedDate,
    importance: page.importance
  });

  for (const label of page.tags) {
    const tagId = `tag:${normalizeTag(label)}`;
    if (!tagById.has(tagId)) {
      const tagNode = {
        id: tagId,
        nodeType: 'tag',
        label
      };
      tagById.set(tagId, tagNode);
      nodes.push(tagNode);
    }

    edges.push({
      source: page.id,
      target: tagId,
      type: 'hasTag'
    });
  }
}

const pageIndexes = pages.filter((page) => page.contentType === 'index');
const nonIndexes = pages.filter((page) => page.contentType !== 'index');

for (const indexPage of pageIndexes) {
  const contentPrefix = `${indexPage.url}`;
  for (const candidate of nonIndexes) {
    if (candidate.url.startsWith(contentPrefix)) {
      edges.push({
        source: indexPage.id,
        target: candidate.id,
        type: 'indexes'
      });
    }
  }
}

for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    const source = pages[i];
    const target = pages[j];
    const sourceTags = new Set(source.tags.map(normalizeTag));
    const sharedTagIds = target.tags.map(normalizeTag).filter((tagId) => sourceTags.has(tagId));

    if (sharedTagIds.length > 0) {
      edges.push({
        source: source.id,
        target: target.id,
        type: 'relatedByTag',
        sharedTags: [...new Set(sharedTagIds)].map((tagId) => `tag:${tagId}`).sort(),
        strength: sharedTagIds.length
      });
    }
  }
}

const payload = {
  version: 2,
  canonical: `${site}/knowledge.json`,
  graph: {
    nodes,
    edges
  }
};

writeFileSync('knowledge.json', `${JSON.stringify(payload, null, 2)}\n`);
console.log(`knowledge.json updated with ${nodes.length} nodes and ${edges.length} edges`);
