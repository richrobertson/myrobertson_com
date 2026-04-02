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

    { type: 'article', title: 'Retry Strategies and Idempotency in Distributed Systems', slug: 'retry-strategies-and-idempotency', canonicalPath: '/writing/retry-strategies-and-idempotency/', summary: 'Retry strategy and idempotency outline.', description: 'Safe retry patterns, duplicate suppression, and idempotent design.', tags: ['Reliability', 'Distributed Systems', 'Correctness'], cluster: 'distributed-systems-reliability', status: 'planned', noindex: true },
    { type: 'article', title: 'Admission Control in Distributed Systems', slug: 'admission-control-in-distributed-systems', canonicalPath: '/writing/admission-control-in-distributed-systems/', summary: 'Front-door accept/reject/defer boundary that keeps overload from entering faster than safe capacity.', description: 'How admission control decides what work can safely enter based on capacity, policy, and priority.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Rate Limiting in Distributed Systems', slug: 'rate-limiting-in-distributed-systems', canonicalPath: '/writing/rate-limiting-in-distributed-systems/', summary: 'Fairness, capacity protection, and burst policy for shared systems.', description: 'How rate limiting protects shared capacity, fairness, and overload boundaries in distributed systems.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Circuit Breakers in Distributed Systems', slug: 'circuit-breakers-in-distributed-systems', canonicalPath: '/writing/circuit-breakers-in-distributed-systems/', summary: 'Dependency isolation and fast-failure containment for partial outages.', description: 'How circuit breakers contain dependency failure and protect retries, thread pools, and connection budgets.', tags: ['Reliability', 'Distributed Systems', 'Failure Isolation'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Graceful Degradation in Distributed Systems', slug: 'graceful-degradation-in-distributed-systems', canonicalPath: '/writing/graceful-degradation-in-distributed-systems/', summary: 'Service-mode strategy for preserving core outcomes under stress.', description: 'How graceful degradation preserves essential function by reducing non-critical features, quality, freshness, or scope.', tags: ['Reliability', 'Distributed Systems', 'Graceful Degradation'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Load Shedding in Distributed Systems', slug: 'load-shedding-in-distributed-systems', canonicalPath: '/writing/load-shedding-in-distributed-systems/', summary: 'Intentional rejection under overload to protect critical system paths.', description: 'How load shedding rejects, drops, defers, or downgrades work to preserve stability during overload.', tags: ['Reliability', 'Distributed Systems', 'Overload Control'], cluster: 'distributed-systems-reliability', status: 'published', noindex: false },
    { type: 'article', title: 'Queue Design Under Load', slug: 'queue-design-under-load', canonicalPath: '/writing/queue-design-under-load/', summary: 'Queue boundaries and drain behavior under burst traffic.', description: 'Queue depth, drain rate, and overload decisions.', tags: ['Reliability', 'Distributed Systems', 'Backpressure'], cluster: 'distributed-systems-reliability', status: 'planned', noindex: true },
    { type: 'article', title: 'Why Systems Fail Under Load, Not Just Bugs', slug: 'why-systems-fail-under-load-not-just-bugs', canonicalPath: '/writing/why-systems-fail-under-load-not-just-bugs/', summary: 'Failure modes that emerge from capacity and coordination limits.', description: 'Load-induced failures and practical prevention patterns.', tags: ['Reliability', 'Distributed Systems', 'Architecture'], cluster: 'distributed-systems-reliability', status: 'planned', noindex: true },

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
