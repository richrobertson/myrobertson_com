import { writeFileSync } from 'node:fs';
import { canonicalArticleUrl } from '../content/article-routing.mjs';

const site = 'https://www.myrobertson.com';
const articleUrl = (pathOrUrl) => canonicalArticleUrl(pathOrUrl, site) || pathOrUrl;

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
    url: articleUrl(`${site}/blog/backpressure-stability-correctness-distributed-systems`),
    contentType: 'article',
    summary: 'Backpressure, bounded queues, and admission control patterns for overload resilience.',
    tags: ['backpressure', 'graceful degradation', 'backend reliability'],
    publishedDate: '2026-03-28',
    updatedDate: '2026-04-02',
    importance: 2
  },
  {
    id: 'page:fallacies-of-distributed-computing',
    title: 'The Fallacies of Distributed Computing Still Break Modern Systems',
    url: articleUrl(`${site}/blog/fallacies-of-distributed-computing`),
    contentType: 'article',
    summary: 'A production-focused guide to the eight fallacies and how hidden assumptions still break cloud-native systems.',
    tags: ['distributed systems', 'reliability', 'architecture', 'failure modes'],
    publishedDate: '2026-04-08',
    updatedDate: '2026-04-08',
    importance: 2,
    canonicalTopic: 'distributed systems',
    related: ['page:overload-control-pipeline', 'page:retry-strategies-and-idempotency', 'page:architecting-a-multitenant-control-plane', 'page:oracle-cns-oci-migration'],
    parent: 'page:distributed-systems',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:overload-control-pipeline',
    title: 'End-to-End Overload Control in Distributed Systems',
    url: articleUrl(`${site}/blog/end-to-end-overload-control-in-distributed-systems`),
    contentType: 'article',
    summary: 'System-level synthesis of admission control, rate limiting, backpressure, circuit breakers, load shedding, and graceful degradation.',
    tags: ['distributed systems', 'reliability', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'distributed systems',
    related: ['page:admission-control-in-distributed-systems', 'page:rate-limiting-in-distributed-systems', 'page:backpressure-in-distributed-systems', 'page:circuit-breakers-in-distributed-systems', 'page:load-shedding-in-distributed-systems', 'page:graceful-degradation-in-distributed-systems', 'page:oracle-cns-oci-migration', 'page:why-systems-fail-under-load', 'page:retry-strategies-and-idempotency', 'page:queue-design-under-load'],
    parent: 'page:distributed-systems',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:admission-control-in-distributed-systems',
    title: 'Admission Control in Distributed Systems',
    url: articleUrl(`${site}/blog/admission-control-in-distributed-systems`),
    contentType: 'article',
    summary: 'Front-door intake boundary for accept/reject/defer decisions driven by live capacity, fairness, and priority protection.',
    tags: ['admission control', 'distributed systems', 'reliability', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'overload control',
    related: ['page:backpressure-in-distributed-systems', 'page:rate-limiting-in-distributed-systems', 'page:load-shedding-in-distributed-systems', 'page:graceful-degradation-in-distributed-systems', 'page:architecting-a-multitenant-control-plane'],
    parent: 'page:distributed-systems',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:rate-limiting-in-distributed-systems',
    title: 'Rate Limiting in Distributed Systems',
    url: articleUrl(`${site}/blog/rate-limiting-in-distributed-systems`),
    contentType: 'article',
    summary: 'Fairness and capacity protection with explicit intake boundaries before overload becomes systemic.',
    tags: ['rate limiting', 'distributed systems', 'reliability', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'overload control',
    related: ['page:backpressure-in-distributed-systems', 'page:load-shedding-in-distributed-systems'],
    parent: 'page:distributed-systems',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:circuit-breakers-in-distributed-systems',
    title: 'Circuit Breakers in Distributed Systems',
    url: articleUrl(`${site}/blog/circuit-breakers-in-distributed-systems`),
    contentType: 'article',
    summary: 'Failure containment for unhealthy dependencies using open, closed, and half-open transitions.',
    tags: ['circuit breakers', 'distributed systems', 'reliability', 'failure isolation'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'reliability',
    related: ['page:graceful-degradation-in-distributed-systems', 'page:architecting-a-multitenant-control-plane'],
    parent: 'page:distributed-systems',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:graceful-degradation-in-distributed-systems',
    title: 'Graceful Degradation in Distributed Systems',
    url: articleUrl(`${site}/blog/graceful-degradation-in-distributed-systems`),
    contentType: 'article',
    summary: 'Service-mode strategy to preserve essential behavior by reducing non-critical scope under stress.',
    tags: ['graceful degradation', 'distributed systems', 'reliability', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'distributed systems',
    related: ['page:load-shedding-in-distributed-systems', 'page:oracle-cns-oci-migration'],
    parent: 'page:distributed-systems',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:load-shedding-in-distributed-systems',
    title: 'Load Shedding in Distributed Systems',
    url: articleUrl(`${site}/blog/load-shedding-in-distributed-systems`),
    contentType: 'article',
    summary: 'Intentional rejection, drop, defer, or downgrade policy to protect core paths during overload.',
    tags: ['load shedding', 'distributed systems', 'reliability', 'admission control', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'overload control',
    related: ['page:rate-limiting-in-distributed-systems', 'page:backpressure-in-distributed-systems'],
    parent: 'page:distributed-systems',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:why-systems-fail-under-load',
    title: 'Why Systems Fail Under Load, Not Just Bugs',
    url: articleUrl(`${site}/blog/why-systems-fail-under-load-not-just-bugs`),
    contentType: 'article',
    summary: 'Conceptual anchor explaining overload dynamics, amplification loops, and cascading failure modes in distributed systems.',
    tags: ['failure modes', 'reliability', 'distributed systems', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'reliability',
    related: ['page:retry-strategies-and-idempotency', 'page:queue-design-under-load', 'page:admission-control-in-distributed-systems', 'page:backpressure-in-distributed-systems', 'page:load-shedding-in-distributed-systems', 'page:graceful-degradation-in-distributed-systems'],
    parent: 'page:distributed-systems',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:retry-strategies-and-idempotency',
    title: 'Retry Strategies and Idempotency',
    url: articleUrl(`${site}/blog/retry-strategies-and-idempotency`),
    contentType: 'article',
    summary: 'Safe retry semantics, duplicate suppression, idempotent API design, and retry budgets under load.',
    tags: ['idempotency', 'retry semantics', 'reliability', 'distributed systems', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'overload control',
    related: ['page:why-systems-fail-under-load', 'page:queue-design-under-load', 'page:admission-control-in-distributed-systems', 'page:backpressure-in-distributed-systems'],
    parent: 'page:distributed-systems',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:queue-design-under-load',
    title: 'Queue Design Under Load',
    url: articleUrl(`${site}/blog/queue-design-under-load`),
    contentType: 'article',
    summary: 'Bounded queues, fairness, queue latency as an amplification vector, and rejection policies under overload.',
    tags: ['queue design', 'queue depth', 'reliability', 'distributed systems', 'overload control'],
    publishedDate: '2026-04-02',
    updatedDate: '2026-04-02',
    importance: 2,
    canonicalTopic: 'overload control',
    related: ['page:why-systems-fail-under-load', 'page:retry-strategies-and-idempotency', 'page:admission-control-in-distributed-systems', 'page:backpressure-in-distributed-systems', 'page:load-shedding-in-distributed-systems'],
    parent: 'page:distributed-systems',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:architecting-a-multitenant-control-plane',
    title: 'Architecting a Multitenant Control Plane',
    url: articleUrl(`${site}/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier`),
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
    url: articleUrl(`${site}/blog/designing-a-correct-distributed-lease-service-tenure-on-raft`),
    contentType: 'article',
    summary: 'Correctness-oriented lease semantics, fencing tokens, and coordination under failure.',
    tags: ['distributed coordination', 'leases', 'fencing tokens', 'correctness'],
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
    id: 'page:police-records-search-architecture',
    title: 'Designing Search Systems for Decades of Police Records',
    url: articleUrl(`${site}/blog/designing-search-systems-for-decades-of-police-records`),
    contentType: 'article',
    summary: 'System design analysis of police records discovery across structured and unstructured data with hybrid retrieval, Solr vs Elasticsearch tradeoffs, AI augmentation, and MCP orchestration.',
    tags: ['search architecture', 'hybrid retrieval', 'enterprise search', 'AI systems', 'distributed systems'],
    publishedDate: '2026-04-04',
    updatedDate: '2026-04-04',
    importance: 2,
    canonicalTopic: 'search architecture',
    related: ['page:overload-control-pipeline', 'page:architecting-a-multitenant-control-plane', 'page:coding-interviews-ai-era-hub', 'page:coding-with-ai-bar-higher'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },

  {
    id: 'page:designing-a-crdt-from-scratch',
    title: 'Designing a CRDT from Scratch',
    url: articleUrl(`${site}/blog/designing-a-crdt-from-scratch`),
    contentType: 'article',
    summary: 'Practical CRDT design from invariants to merge semantics, delete handling, and production replication architecture.',
    tags: ['CRDT', 'distributed systems', 'eventual consistency', 'merge semantics', 'correctness'],
    publishedDate: '2026-04-05',
    updatedDate: '2026-04-05',
    importance: 2,
    canonicalTopic: 'distributed systems',
    related: ['page:backpressure-in-distributed-systems', 'page:retry-strategies-and-idempotency', 'page:overload-control-pipeline'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },

  {
    id: 'page:coding-interviews-ai-era-hub',
    title: 'Coding Interviews in the AI Era',
    url: articleUrl(`${site}/blog/coding-interviews-in-the-ai-era`),
    contentType: 'article',
    summary: 'Series hub and reading path for the AI-assisted interview cluster, with clearer routes into thesis, signal model, playbook, and failure analysis.',
    tags: ['AI-assisted coding interviews', 'engineering judgment', 'technical interviews', 'ownership'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:coding-with-ai-bar-higher', 'page:measured-on-ai-interviews', 'page:practical-playbook-ai-interviews', 'page:ownership-ai-interviews', 'page:failures-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:coding-with-ai-bar-higher',
    title: 'Coding With AI in Interviews: Why the Bar Is Higher, Not Lower',
    url: articleUrl(`${site}/blog/coding-with-ai-in-interviews-why-the-bar-is-higher-not-lower`),
    contentType: 'article',
    summary: 'Flagship thesis on why AI lowers implementation friction while raising the premium on judgment, verification, and ownership.',
    tags: ['AI-assisted coding interviews', 'engineering judgment', 'senior engineers', 'ownership'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:measured-on-ai-interviews', 'page:practical-playbook-ai-interviews', 'page:ownership-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:measured-on-ai-interviews',
    title: 'What Experienced Engineers Are Actually Being Measured on in AI-Assisted Coding Interviews',
    url: articleUrl(`${site}/blog/what-experienced-engineers-are-actually-being-measured-on-in-ai-assisted-coding-interviews`),
    contentType: 'article',
    summary: 'Definitive signal model for framing, constraints, tool direction, simplification, verification, communication, and line-level ownership.',
    tags: ['AI-assisted coding interviews', 'experienced engineers', 'engineering judgment', 'verification'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:practical-playbook-ai-interviews', 'page:failures-ai-interviews', 'page:ownership-ai-interviews', 'page:coding-with-ai-bar-higher', 'page:senior-behaviors-ai-interviews', 'page:coding-interviews-ai-era-hub'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:practical-playbook-ai-interviews',
    title: 'A Practical Playbook for AI-Assisted Coding Interviews',
    url: articleUrl(`${site}/blog/a-practical-playbook-for-ai-assisted-coding-interviews`),
    contentType: 'article',
    summary: 'Field manual for running an AI-assisted coding round well: frame first, prompt narrowly, verify hard, simplify, and close with ownership.',
    tags: ['AI-assisted coding interviews', 'practical playbook', 'engineering judgment', 'technical interviews'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:measured-on-ai-interviews', 'page:failures-ai-interviews', 'page:senior-behaviors-ai-interviews', 'page:ownership-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ownership-ai-interviews',
    title: 'You Still Own Every Line: Accountability in AI-Assisted Coding Interviews',
    url: articleUrl(`${site}/blog/you-still-own-every-line-accountability-in-ai-assisted-coding-interviews`),
    contentType: 'article',
    summary: 'Sharp accountability thesis connecting interview ownership, reviewability, hidden assumptions, and production responsibility.',
    tags: ['AI-assisted coding interviews', 'ownership', 'accountability', 'reviewability', 'reliability'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'software engineering',
    related: ['page:practical-playbook-ai-interviews', 'page:measured-on-ai-interviews', 'page:coding-with-ai-bar-higher'],
    parent: 'page:distributed-systems-writing',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:failures-ai-interviews',
    title: 'How Candidates Fail AI-Assisted Coding Interviews',
    url: articleUrl(`${site}/blog/how-candidates-fail-ai-assisted-coding-interviews`),
    contentType: 'article',
    summary: 'Diagnostic failure-mode guide showing what weak AI-assisted interview behavior looks like in the room and why trust erodes.',
    tags: ['AI-assisted coding interviews', 'failure modes', 'engineering judgment', 'technical interviews'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:practical-playbook-ai-interviews', 'page:measured-on-ai-interviews', 'page:senior-behaviors-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:senior-behaviors-ai-interviews',
    title: 'What Strong Senior Engineers Do Differently in AI-Assisted Coding Interviews',
    url: articleUrl(`${site}/blog/what-strong-senior-engineers-do-differently-in-ai-assisted-coding-interviews`),
    contentType: 'article',
    summary: 'Contrastive behavioral guide showing how strong senior engineers frame, simplify, verify, and close differently from average candidates.',
    tags: ['AI-assisted coding interviews', 'senior engineers', 'engineering judgment', 'technical interviews'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:measured-on-ai-interviews', 'page:practical-playbook-ai-interviews', 'page:ownership-ai-interviews', 'page:failures-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:evaluating-candidates-ai-allowed',
    title: 'How Companies Should Evaluate Candidates When AI Is Allowed',
    url: articleUrl(`${site}/blog/how-companies-should-evaluate-candidates-when-ai-is-allowed`),
    contentType: 'article',
    summary: 'Operational interviewer guide for AI-assisted evaluation: better prompts, better probes, better scoring, and less noise.',
    tags: ['AI-assisted coding interviews', 'hiring', 'interviewer rubric', 'engineering judgment'],
    publishedDate: '2026-04-03',
    updatedDate: '2026-04-03',
    importance: 2,
    canonicalTopic: 'technical interviews',
    related: ['page:coding-with-ai-bar-higher', 'page:measured-on-ai-interviews', 'page:practical-playbook-ai-interviews'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-hub',
    title: 'How to Build a Closed-Loop AI-Assisted Software Development Lifecycle',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-closed-loop`),
    contentType: 'article',
    summary: 'Conceptual hub for a governed AI-assisted delivery lifecycle spanning requirements, orchestration, generation, validation, deployment, and feedback.',
    tags: ['AI-assisted software development lifecycle', 'workflow orchestration', 'software delivery', 'reliability'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-orchestration', 'page:ai-assisted-sdlc-requirements', 'page:ai-assisted-sdlc-feedback', 'page:ai-assisted-sdlc-walkthrough'],
    parent: 'page:distributed-systems-writing',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-requirements',
    title: 'Requirements Solicitation and Normalization for AI-Assisted Delivery',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-requirements-normalization`),
    contentType: 'article',
    summary: 'Input-quality control for intake, ambiguity reduction, acceptance criteria, constraints, non-functional requirements, and normalized requirement packets.',
    tags: ['AI-assisted software development lifecycle', 'requirements', 'software delivery', 'architecture'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-codegen', 'page:ai-assisted-sdlc-feedback', 'page:ai-assisted-sdlc-orchestration', 'page:ai-assisted-sdlc-hub'],
    parent: 'page:distributed-systems-writing',
    level: 'foundational',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-orchestration',
    title: 'Designing the Orchestrator for an AI-Assisted Development Workflow',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-orchestration-architecture`),
    contentType: 'article',
    summary: 'Stateful orchestration design covering typed graph state, stage contracts, artifact passing, retries, approvals, traces, and eval hooks.',
    tags: ['AI-assisted software development lifecycle', 'workflow orchestration', 'control planes', 'architecture'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-hub', 'page:ai-assisted-sdlc-walkthrough', 'page:ai-assisted-sdlc-deployment', 'page:ai-assisted-sdlc-requirements'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-codegen',
    title: 'Code Generation With Contracts, Boundaries, and Repository Awareness',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-code-generation-strategy`),
    contentType: 'article',
    summary: 'Bounded generation strategy for scope control, context packaging, diff discipline, repository awareness, and structured escalation.',
    tags: ['AI-assisted software development lifecycle', 'code generation', 'software delivery', 'reliability'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-tests', 'page:ai-assisted-sdlc-review', 'page:ai-assisted-sdlc-requirements'],
    parent: 'page:distributed-systems-writing',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-tests',
    title: 'AI-Generated Tests That Actually Protect the System',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-test-generation-validation`),
    contentType: 'article',
    summary: 'Validation-stage guidance for risk-based test selection, stronger oracles, blind-spot analysis, regression protection, and release evidence.',
    tags: ['AI-assisted software development lifecycle', 'testing', 'reliability', 'software delivery'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-codegen', 'page:ai-assisted-sdlc-deployment', 'page:ai-assisted-sdlc-feedback'],
    parent: 'page:distributed-systems-writing',
    level: 'intermediate',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-review',
    title: 'Code Review and Issue Remediation Loops in AI-Assisted Delivery',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-review-remediation-loops`),
    contentType: 'article',
    summary: 'Governance-heavy review stage covering rubric design, static checks, bounded retries, escalation, and durable decision records.',
    tags: ['AI-assisted software development lifecycle', 'code review', 'governance', 'reliability'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-codegen', 'page:ai-assisted-sdlc-tests', 'page:ai-assisted-sdlc-deployment', 'page:ai-assisted-sdlc-orchestration'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-deployment',
    title: 'Deployment Gates for AI-Assisted Software Systems',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-deployment-gates`),
    contentType: 'article',
    summary: 'Production engineering guidance for release evidence, phased rollout, rollback triggers, observation handoff, and routing learnings upstream.',
    tags: ['AI-assisted software development lifecycle', 'deployment', 'reliability', 'software delivery'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-feedback', 'page:ai-assisted-sdlc-review', 'page:ai-assisted-sdlc-tests'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-feedback',
    title: 'Closing the Loop With End-User Feedback and Requirements Refinement',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-feedback-to-requirements`),
    contentType: 'article',
    summary: 'Lifecycle-learning guide for signal collection, prioritization, requirements deltas, refinement governance, and loop-health metrics.',
    tags: ['AI-assisted software development lifecycle', 'feedback loops', 'requirements', 'software delivery'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-requirements', 'page:ai-assisted-sdlc-deployment', 'page:ai-assisted-sdlc-walkthrough', 'page:ai-assisted-sdlc-hub'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:ai-assisted-sdlc-walkthrough',
    title: 'A Local End-to-End AI-Assisted SDLC Walkthrough',
    url: articleUrl(`${site}/blog/ai-assisted-sdlc-local-walkthrough`),
    contentType: 'article',
    summary: 'Implementation-heavy walkthrough of a local closed-loop pipeline with staged graph execution, artifacts, approvals, eval traces, and feedback re-entry.',
    tags: ['AI-assisted software development lifecycle', 'LangGraph', 'workflow orchestration', 'software delivery'],
    publishedDate: '2026-04-09',
    updatedDate: '2026-04-09',
    importance: 2,
    canonicalTopic: 'AI-assisted software delivery',
    related: ['page:ai-assisted-sdlc-orchestration', 'page:ai-assisted-sdlc-feedback', 'page:ai-assisted-sdlc-codegen', 'page:ai-assisted-sdlc-hub'],
    parent: 'page:distributed-systems-writing',
    level: 'advanced',
    status: 'published'
  },
  {
    id: 'page:distributed-systems-writing',
    title: 'Distributed Systems Writing',
    url: `${site}/blog/`,
    contentType: 'index',
    summary: 'Technical writing index for distributed systems, control planes, and reliability under load.',
    tags: ['writing', 'distributed systems', 'reliability'],
    updatedDate: '2026-04-04',
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
    importance: page.importance,
    canonicalTopic: page.canonicalTopic,
    related: page.related,
    parent: page.parent,
    level: page.level,
    status: page.status
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
