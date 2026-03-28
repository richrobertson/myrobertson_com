(function () {
  const articles = [
    {
      slug: 'what-is-a-control-plane',
      title: 'What Is a Control Plane?',
      url: '/blog/what-is-a-control-plane.html',
      summary: 'How control planes translate intent into durable workflow execution in cloud platforms.',
      tags: ['Control Planes', 'Cloud Platforms', 'Architecture']
    },
    {
      slug: 'distributed-systems-interview-guide',
      title: 'Distributed Systems Interview Guide',
      url: '/blog/distributed-systems-interview-guide.html',
      summary: 'A practical study map for consistency, coordination, retries, and trade-offs.',
      tags: ['Distributed Systems', 'Interviews', 'Architecture']
    },
    {
      slug: 'api-backpressure-explained-simply',
      title: 'API Backpressure Explained Simply',
      url: '/blog/api-backpressure-explained-simply.html',
      summary: 'A primer on bounded work, fast failure, and overload control for APIs.',
      tags: ['Backpressure', 'APIs', 'Reliability']
    },
    {
      slug: 'what-is-eventual-consistency',
      title: 'What Is Eventual Consistency? (Explained Simply)',
      url: '/blog/what-is-eventual-consistency.html',
      summary: 'Why distributed systems converge over time and what consistency trade-offs mean in production.',
      tags: ['Distributed Systems', 'Correctness', 'Reliability']
    },
    {
      slug: 'what-is-the-cap-theorem',
      title: 'What Is the CAP Theorem? (Explained Simply)',
      url: '/blog/what-is-the-cap-theorem.html',
      summary: 'A practical explanation of consistency, availability, and partitions.',
      tags: ['Distributed Systems', 'Correctness', 'Architecture']
    },
    {
      slug: 'what-is-idempotency',
      title: 'What Is Idempotency? (And Why It Matters in Distributed Systems)',
      url: '/blog/what-is-idempotency.html',
      summary: 'Why safe retries and duplicate suppression are required for reliable workflows.',
      tags: ['Reliability', 'APIs', 'Correctness']
    },
    {
      slug: 'what-is-a-distributed-lock-with-examples',
      title: 'What Is a Distributed Lock? (With Examples)',
      url: '/blog/what-is-a-distributed-lock-with-examples.html',
      summary: 'Lease semantics, fencing tokens, and stale-owner failure modes.',
      tags: ['Distributed Systems', 'Correctness', 'Consensus']
    },
    {
      slug: 'raft-vs-paxos-vs-epaxos-practical-guide',
      title: 'Raft vs Paxos vs EPaxos: A Practical Guide',
      url: '/blog/raft-vs-paxos-vs-epaxos-practical-guide.html',
      summary: 'Consensus protocol trade-offs in implementation complexity and latency.',
      tags: ['Consensus', 'Distributed Systems', 'Architecture']
    },
    {
      slug: 'kafka-at-hyperscale',
      title: 'Kafka at Hyperscale',
      url: '/blog/kafka-at-hyperscale.html',
      summary: 'Operational patterns for running high-throughput Kafka systems.',
      tags: ['Kafka', 'Reliability', 'Distributed Systems']
    },
    {
      slug: 'three-node-vs-five-node-kafka-clusters',
      title: 'Three-Node vs Five-Node Kafka Clusters',
      url: '/blog/three-node-vs-five-node-kafka-clusters.html',
      summary: 'Replication and quorum trade-offs for cluster sizing decisions.',
      tags: ['Kafka', 'Reliability', 'Architecture']
    },
    {
      slug: 'designing-backpressure-graphql-cdn-latency',
      title: 'Designing Backpressure for GraphQL and CDN Latency',
      url: '/blog/designing-backpressure-graphql-cdn-latency.html',
      summary: 'How API edge behavior can amplify overload and how to bound it.',
      tags: ['Backpressure', 'APIs', 'Cloud Platforms']
    },
    {
      slug: 'latency-aware-backpressure-with-server-timing-in-cdn-fronted-distributed-systems',
      title: 'Latency-Aware Backpressure with Server-Timing',
      url: '/blog/latency-aware-backpressure-with-server-timing-in-cdn-fronted-distributed-systems.html',
      summary: 'Latency-informed admission control for CDN-fronted systems.',
      tags: ['Backpressure', 'APIs', 'Reliability']
    },
    {
      slug: 'backpressure-stability-correctness-distributed-systems',
      title: 'Backpressure, Stability, and Correctness in Distributed Systems',
      url: '/blog/backpressure-stability-correctness-distributed-systems.html',
      summary: 'Backpressure as a correctness concern, not just performance tuning.',
      tags: ['Backpressure', 'Distributed Systems', 'Correctness']
    },
    {
      slug: 'architecting-a-multitenant-control-plane-for-a-next-generation-data-tier',
      title: 'Architecting a Multitenant Control Plane for a Next-Generation Data Tier',
      url: '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier.html',
      summary: 'Durable command processing and partition-aware workflow execution for multitenancy.',
      tags: ['Control Planes', 'Architecture', 'Cloud Platforms']
    },
    {
      slug: 'designing-a-correct-distributed-lease-service-tenure-on-raft',
      title: 'Designing a Correct Distributed Lease Service: Tenure on Raft',
      url: '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft.html',
      summary: 'Lease safety model, leader time authority, and fencing for correctness.',
      tags: ['Correctness', 'Consensus', 'Distributed Systems']
    },
    {
      slug: 'programming-language-selection-in-distributed-systems-a-strategic-long-term-perspective',
      title: 'Programming Language Selection in Distributed Systems',
      url: '/blog/programming-language-selection-in-distributed-systems-a-strategic-long-term-perspective.html',
      summary: 'Language choice trade-offs for long-lived distributed platforms.',
      tags: ['Architecture', 'Distributed Systems', 'Java']
    },
    {
      slug: 'polyglot-functional-languages-distributed-systems',
      title: 'Polyglot Functional Languages in Distributed Systems',
      url: '/blog/polyglot-functional-languages-distributed-systems.html',
      summary: 'Where polyglot functional programming helps in reliability and correctness.',
      tags: ['Distributed Systems', 'Architecture', 'Reliability']
    },
    {
      slug: 'what-it-took-to-modernize-a-legacy-service-across-32-global-regions',
      title: 'What It Took to Modernize a Legacy Service Across 32 Global Regions',
      url: '/blog/what-it-took-to-modernize-a-legacy-service-across-32-global-regions.html',
      summary: 'A practical sequence for legacy modernization with compatibility checks and staged global rollout.',
      tags: ['Java', 'Cloud Platforms', 'Reliability', 'Architecture']
    }
  ];

  function slugifyTag(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const tags = {};
  for (const article of articles) {
    article.tags = article.tags.map((name) => ({ name, slug: slugifyTag(name) }));
    for (const tag of article.tags) {
      if (!tags[tag.slug]) tags[tag.slug] = { ...tag, count: 0, articles: [] };
      tags[tag.slug].count += 1;
      tags[tag.slug].articles.push(article.slug);
    }
  }

  window.blogTaxonomy = { articles, tags, slugifyTag };
})();
