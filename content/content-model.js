(function () {
  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function normalizeTags(tags) {
    return (tags || []).map((tag) => ({ name: tag, slug: slugify(tag) }));
  }

  const items = [
    {
      type: 'cluster',
      title: 'Distributed Systems Reliability: Practical Patterns for Stability Under Load',
      slug: 'distributed-systems-reliability',
      canonicalPath: '/writing/distributed-systems-reliability/',
      summary: 'Pillar guide for overload control, retries, failure isolation, and graceful degradation.',
      description: 'Reliability patterns for distributed systems under real production load.',
      tags: ['Reliability', 'Distributed Systems', 'Architecture'],
      cluster: 'distributed-systems-reliability',
      status: 'published',
      noindex: false,
      featured: true
    },
    {
      type: 'cluster',
      title: 'What Is a Control Plane? Real-World Patterns for Multitenant Systems',
      slug: 'control-plane-architecture-guide',
      canonicalPath: '/writing/control-plane-architecture-guide/',
      summary: 'Pillar guide for multitenant control-plane architecture and workflow execution.',
      description: 'Control-plane design patterns used in production multitenant systems.',
      tags: ['Control Planes', 'Architecture', 'Distributed Systems'],
      cluster: 'control-planes-platform',
      status: 'published',
      noindex: false,
      featured: true
    },
    {
      type: 'cluster',
      title: 'Distributed Systems Migration Case Studies',
      slug: 'distributed-systems-migration',
      canonicalPath: '/case-studies/distributed-systems-migration/',
      summary: 'Hub for migration and modernization delivery patterns.',
      description: 'Migration case studies and rollout strategy patterns for distributed systems.',
      tags: ['Migration', 'Cloud Platforms', 'Reliability'],
      cluster: 'migration-modernization',
      status: 'published',
      noindex: false,
      featured: true
    },

    { type: 'article', title: 'Backpressure in Distributed Systems: Stability, Correctness, and Graceful Degradation', slug: 'backpressure-in-distributed-systems', canonicalPath: '/blog/backpressure-stability-correctness-distributed-systems.html', summary: 'Backpressure, bounded queues, and graceful degradation for overload resilience.', description: 'How admission control, bounded queues, and graceful degradation protect distributed systems under load.', tags: ['Reliability', 'Distributed Systems', 'Backpressure'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Coding Interviews in the AI Era', slug: 'coding-interviews-in-the-ai-era', canonicalPath: '/blog/coding-interviews-in-the-ai-era.html', summary: 'Series hub and reading path for the AI-assisted interview cluster, organized by thesis, signal model, playbook, and failure analysis.', description: 'Cluster hub for AI-assisted coding interview guidance with a practical reading path for experienced engineers.', tags: ['Interviews', 'AI', 'Engineering Judgment', 'Technical Interviews'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'Coding With AI in Interviews: Why the Bar Is Higher, Not Lower', slug: 'coding-with-ai-in-interviews-why-the-bar-is-higher-not-lower', canonicalPath: '/blog/coding-with-ai-in-interviews-why-the-bar-is-higher-not-lower.html', summary: 'Flagship thesis on why AI lowers coding friction while raising the premium on judgment, verification, and ownership.', description: 'AI lowers coding friction but raises the premium on judgment, verification, communication, and ownership.', tags: ['Interviews', 'AI', 'Engineering Judgment', 'Senior Engineers'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'What Experienced Engineers Are Actually Being Measured on in AI-Assisted Coding Interviews', slug: 'what-experienced-engineers-are-actually-being-measured-on-in-ai-assisted-coding-interviews', canonicalPath: '/blog/what-experienced-engineers-are-actually-being-measured-on-in-ai-assisted-coding-interviews.html', summary: 'Definitive signal model for framing, constraints, tool direction, simplification, verification, communication, and ownership.', description: 'What interviewers evaluate when AI is allowed: direction quality, simplification, tradeoffs, and accountability.', tags: ['Interviews', 'AI', 'Engineering Judgment', 'Experienced Engineers'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'A Practical Playbook for AI-Assisted Coding Interviews', slug: 'a-practical-playbook-for-ai-assisted-coding-interviews', canonicalPath: '/blog/a-practical-playbook-for-ai-assisted-coding-interviews.html', summary: 'Field manual for AI-assisted rounds: frame first, prompt narrowly, verify hard, simplify, and close with ownership.', description: 'Practical playbook: frame first, generate selectively, verify deeply, simplify, narrate tradeoffs, and own outcomes.', tags: ['Interviews', 'AI', 'Technical Interviews', 'Software Engineering'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'You Still Own Every Line: Accountability in AI-Assisted Coding Interviews', slug: 'you-still-own-every-line-accountability-in-ai-assisted-coding-interviews', canonicalPath: '/blog/you-still-own-every-line-accountability-in-ai-assisted-coding-interviews.html', summary: 'Sharp accountability argument linking interview ownership, reviewability, hidden assumptions, and production responsibility.', description: 'AI assistance does not transfer responsibility. Engineers still own correctness, tradeoffs, and operational consequences.', tags: ['Interviews', 'AI', 'Engineering Judgment', 'Reliability'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'How Candidates Fail AI-Assisted Coding Interviews', slug: 'how-candidates-fail-ai-assisted-coding-interviews', canonicalPath: '/blog/how-candidates-fail-ai-assisted-coding-interviews.html', summary: 'Diagnostic failure-mode guide showing what weak AI-assisted interview behavior looks like in the room and why trust erodes.', description: 'A practical breakdown of common failure patterns when candidates outsource reasoning to AI.', tags: ['Interviews', 'AI', 'Technical Interviews', 'Engineering Judgment'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'What Strong Senior Engineers Do Differently in AI-Assisted Coding Interviews', slug: 'what-strong-senior-engineers-do-differently-in-ai-assisted-coding-interviews', canonicalPath: '/blog/what-strong-senior-engineers-do-differently-in-ai-assisted-coding-interviews.html', summary: 'Contrastive behavioral guide showing how strong senior engineers frame, simplify, verify, and close differently from average candidates.', description: 'How senior-level maturity appears in AI-assisted coding interviews: framing speed, simplification, skepticism, and closure.', tags: ['Interviews', 'AI', 'Senior Engineers', 'Engineering Judgment'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'How Companies Should Evaluate Candidates When AI Is Allowed', slug: 'how-companies-should-evaluate-candidates-when-ai-is-allowed', canonicalPath: '/blog/how-companies-should-evaluate-candidates-when-ai-is-allowed.html', summary: 'Operational interviewer guide for AI-assisted evaluation: better prompts, better probes, better scoring, and less noise.', description: 'How companies can redesign interview prompts and evaluation rubrics when AI is permitted.', tags: ['Interviews', 'AI', 'Engineering Leadership', 'Technical Interviews'], cluster: 'engineering-judgment-ai-interviews', status: 'published', noindex: false },
    { type: 'article', title: 'End-to-End Overload Control in Distributed Systems', slug: 'end-to-end-overload-control-in-distributed-systems', canonicalPath: '/blog/end-to-end-overload-control-in-distributed-systems.html', summary: 'System-level overload pipeline connecting admission control, backpressure, failure isolation, and graceful degradation.', description: 'How admission control, rate limiting, backpressure, circuit breakers, load shedding, and graceful degradation work together.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Architecting a Multitenant Control Plane', slug: 'architecting-a-multitenant-control-plane', canonicalPath: '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier.html', summary: 'Durable workflow and partition-aware orchestration patterns for multitenant systems.', description: 'Control-plane architecture patterns for durable workflows, tenant isolation, and orchestration safety.', tags: ['Control Planes', 'Distributed Systems', 'Architecture'], cluster: 'control-planes-platform', status: 'published', noindex: false },
    { type: 'article', title: 'Designing a Correct Distributed Lease Service: Tenure on Raft', slug: 'designing-a-correct-distributed-lease-service-tenure-on-raft', canonicalPath: '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft.html', summary: 'Lease safety, fencing tokens, and coordination correctness under failure.', description: 'Distributed lease correctness, fencing, and leader-time authority under failure.', tags: ['Distributed Systems', 'Correctness', 'Consensus'], cluster: 'control-planes-platform', status: 'published', noindex: false },

    { type: 'article', title: 'Retry Strategies and Idempotency in Distributed Systems', slug: 'retry-strategies-and-idempotency', canonicalPath: '/blog/retry-strategies-and-idempotency.html', summary: 'Safe retry semantics, duplicate suppression, and retry budgets under load.', description: 'Safe retry patterns, duplicate suppression, retry budgets, and idempotent API design.', tags: ['Reliability', 'Distributed Systems', 'Correctness'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Admission Control in Distributed Systems', slug: 'admission-control-in-distributed-systems', canonicalPath: '/blog/admission-control-in-distributed-systems.html', summary: 'Front-door accept/reject/defer boundary that keeps overload from entering faster than safe capacity.', description: 'How admission control decides what work can safely enter based on capacity, policy, and priority.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Rate Limiting in Distributed Systems', slug: 'rate-limiting-in-distributed-systems', canonicalPath: '/blog/rate-limiting-in-distributed-systems.html', summary: 'Fairness, capacity protection, and burst policy for shared systems.', description: 'How rate limiting protects shared capacity, fairness, and overload boundaries in distributed systems.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Circuit Breakers in Distributed Systems', slug: 'circuit-breakers-in-distributed-systems', canonicalPath: '/blog/circuit-breakers-in-distributed-systems.html', summary: 'Dependency isolation and fast-failure containment for partial outages.', description: 'How circuit breakers contain dependency failure and protect retries, thread pools, and connection budgets.', tags: ['Reliability', 'Distributed Systems', 'Failure Isolation'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Graceful Degradation in Distributed Systems', slug: 'graceful-degradation-in-distributed-systems', canonicalPath: '/blog/graceful-degradation-in-distributed-systems.html', summary: 'Service-mode strategy for preserving core outcomes under stress.', description: 'How graceful degradation preserves essential function by reducing non-critical features, quality, freshness, or scope.', tags: ['Reliability', 'Distributed Systems', 'Graceful Degradation'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Load Shedding in Distributed Systems', slug: 'load-shedding-in-distributed-systems', canonicalPath: '/blog/load-shedding-in-distributed-systems.html', summary: 'Intentional rejection under overload to protect critical system paths.', description: 'How load shedding rejects, drops, defers, or downgrades work to preserve stability during overload.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Queue Design Under Load', slug: 'queue-design-under-load', canonicalPath: '/blog/queue-design-under-load.html', summary: 'Bounded queues, queue latency, and rejection policy under burst traffic.', description: 'Queue depth, drain rate, fairness, and overload decisions.', tags: ['Reliability', 'Distributed Systems', 'Backpressure'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Why Systems Fail Under Load, Not Just Bugs', slug: 'why-systems-fail-under-load-not-just-bugs', canonicalPath: '/blog/why-systems-fail-under-load-not-just-bugs.html', summary: 'Failure modes that emerge from capacity and coordination limits.', description: 'Load-induced failures, amplification loops, and practical prevention patterns.', tags: ['Reliability', 'Distributed Systems', 'Architecture'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },

    { type: 'article', title: 'Control Plane vs Data Plane', slug: 'control-plane-vs-data-plane', canonicalPath: '/writing/control-plane-vs-data-plane/', summary: 'Scope boundaries between decision systems and execution systems.', description: 'Control-plane/data-plane split in practical architectures.', tags: ['Control Planes', 'Architecture', 'Distributed Systems'], cluster: 'control-planes-platform', status: 'planned', noindex: true },
    { type: 'article', title: 'Designing Durable Workflow Execution', slug: 'designing-durable-workflow-execution', canonicalPath: '/writing/designing-durable-workflow-execution/', summary: 'Durable command and workflow sequencing patterns.', description: 'Workflow state, retries, and resume semantics.', tags: ['Control Planes', 'Reliability', 'Architecture'], cluster: 'control-planes-platform', status: 'planned', noindex: true },
    { type: 'article', title: 'State Management in Distributed Control Systems', slug: 'state-management-in-distributed-control-systems', canonicalPath: '/writing/state-management-in-distributed-control-systems/', summary: 'State ownership, consistency, and recovery patterns.', description: 'State modeling choices for distributed control systems.', tags: ['Control Planes', 'Correctness', 'Distributed Systems'], cluster: 'control-planes-platform', status: 'planned', noindex: true },
    { type: 'article', title: 'API Design for Control Planes', slug: 'api-design-for-control-planes', canonicalPath: '/writing/api-design-for-control-planes/', summary: 'API semantics for long-running operations and intent capture.', description: 'Designing control-plane APIs for asynchronous workflows.', tags: ['Control Planes', 'APIs', 'Architecture'], cluster: 'control-planes-platform', status: 'planned', noindex: true },
    { type: 'article', title: 'Partition-Aware Workers and Scalable Orchestration', slug: 'partition-aware-workers-and-scalable-orchestration', canonicalPath: '/writing/partition-aware-workers-and-scalable-orchestration/', summary: 'Worker partitioning and scaling patterns for orchestration systems.', description: 'Partition-aware worker models in multitenant systems.', tags: ['Control Planes', 'Distributed Systems', 'Architecture'], cluster: 'control-planes-platform', status: 'planned', noindex: true },

    { type: 'article', title: 'How to Migrate Legacy Systems Without Downtime', slug: 'how-to-migrate-legacy-systems-without-downtime', canonicalPath: '/writing/how-to-migrate-legacy-systems-without-downtime/', summary: 'Migration strategy outline for continuity and rollback safety.', description: 'Downtime-avoidance patterns for legacy migrations.', tags: ['Migration', 'Reliability', 'Cloud Platforms'], cluster: 'migration-modernization', status: 'planned', noindex: true },
    { type: 'article', title: 'Designing Safe Rollouts Across Global Regions', slug: 'designing-safe-rollouts-across-global-regions', canonicalPath: '/writing/designing-safe-rollouts-across-global-regions/', summary: 'Global release sequencing, guardrails, and rollback strategy.', description: 'Rollout control patterns for multi-region systems.', tags: ['Migration', 'Reliability', 'Architecture'], cluster: 'migration-modernization', status: 'planned', noindex: true },
    { type: 'article', title: 'Modernizing Java Services Without Breaking Production', slug: 'modernizing-java-services-without-breaking-production', canonicalPath: '/writing/modernizing-java-services-without-breaking-production/', summary: 'Compatibility and deployment controls for Java modernization.', description: 'Practical Java modernization sequence for production systems.', tags: ['Java', 'Migration', 'Reliability'], cluster: 'migration-modernization', status: 'planned', noindex: true },
    { type: 'article', title: 'Lessons from OCI Migration Under Real Constraints', slug: 'lessons-from-oci-migration-under-real-constraints', canonicalPath: '/writing/lessons-from-oci-migration-under-real-constraints/', summary: 'Practical lessons from global OCI migration execution.', description: 'Migration lessons focused on safety, sequencing, and observability.', tags: ['Migration', 'Cloud Platforms', 'Reliability'], cluster: 'migration-modernization', status: 'planned', noindex: true }
  ];

  function withNormalizedTags(list) {
    return list.map((item) => ({ ...item, tags: normalizeTags(item.tags) }));
  }

  function getByCluster(cluster, includeDrafts) {
    return withNormalizedTags(items).filter((item) => item.cluster === cluster && (includeDrafts || !item.noindex));
  }

  function getBySlug(slug) {
    return withNormalizedTags(items).find((item) => item.slug === slug);
  }

  function resolveRelated(slug, max = 4) {
    const source = getBySlug(slug);
    if (!source) return [];
    return withNormalizedTags(items)
      .filter((item) => item.slug !== slug)
      .map((item) => {
        const overlap = item.tags.filter((tag) => source.tags.some((src) => src.slug === tag.slug)).length;
        return { item, overlap };
      })
      .filter((entry) => entry.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || a.item.title.localeCompare(b.item.title))
      .slice(0, max)
      .map((entry) => entry.item);
  }

  function buildMeta(item) {
    return {
      title: item.title,
      description: item.description,
      canonicalPath: item.canonicalPath,
      robots: item.noindex ? 'noindex,follow' : 'index,follow'
    };
  }

  window.siteContentModel = {
    items: withNormalizedTags(items),
    slugify,
    normalizeTags,
    getByCluster,
    getBySlug,
    resolveRelated,
    buildMeta
  };
})();
