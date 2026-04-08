(function () {
  const articles = [


    {
      slug: 'test-driven-ai-development',
      title: 'Test-Driven AI Development: Bringing Determinism to Probabilistic Systems',
      url: '/blog/test-driven-ai-development',
      summary: 'How to apply deterministic contracts, semantic evaluation, and regression datasets to LLM-backed systems.',
      tags: ['AI Systems', 'Reliability', 'Distributed Systems', 'AI Reliability']
    },
    {
      slug: 'designing-search-systems-for-decades-of-police-records',
      title: 'Designing Search Systems for Decades of Police Records',
      url: '/blog/designing-search-systems-for-decades-of-police-records',
      summary: 'A pragmatic system-design analysis of records discovery architecture: Solr vs Elasticsearch, hybrid retrieval, AI augmentation, and MCP orchestration boundaries.',
      tags: ['Search', 'Distributed Systems', 'AI Systems', 'System Design', 'Interviews', 'Architecture']
    },

    {
      slug: 'reviewing-ai-generated-pull-requests-reliability-risk',
      title: 'Reviewing AI-Generated Pull Requests: Reliability, Risk, and the Human Bottleneck',
      url: '/blog/reviewing-ai-generated-pull-requests-reliability-risk',
      summary: 'AI-generated pull requests at scale require reliability-first reviewability, explicit risk controls, and line-level ownership.',
      tags: ['Reliability', 'Engineering Leadership', 'Software Delivery', 'AI', 'Distributed Systems']
    },

    {
      slug: 'how-i-built-the-askrich-chatbot-for-technical-screening',
      title: 'How I Built the AskRich Chatbot for Technical Screening',
      url: '/blog/how-i-built-the-askrich-chatbot-for-technical-screening',
      summary: 'Implementation decisions behind a recruiter-focused chatbot with citation-backed answers.',
      tags: ['APIs', 'Architecture', 'Cloud Platforms']
    },
    {
      slug: 'coding-interviews-in-the-ai-era',
      title: 'Coding Interviews in the AI Era',
      url: '/blog/coding-interviews-in-the-ai-era',
      summary: 'Series hub and reading path for the AI-assisted interview cluster, with clearer routes into thesis, signal model, playbook, and failure analysis.',
      tags: ['Interviews', 'AI', 'Engineering Judgment', 'Technical Interviews']
    },
    {
      slug: 'coding-with-ai-in-interviews-why-the-bar-is-higher-not-lower',
      title: 'Coding With AI in Interviews: Why the Bar Is Higher, Not Lower',
      url: '/blog/coding-with-ai-in-interviews-why-the-bar-is-higher-not-lower',
      summary: 'Flagship thesis on why AI lowers implementation friction while raising the premium on judgment, verification, and ownership.',
      tags: ['Interviews', 'AI', 'Engineering Judgment', 'Senior Engineers', 'Technical Interviews']
    },
    {
      slug: 'what-experienced-engineers-are-actually-being-measured-on-in-ai-assisted-coding-interviews',
      title: 'What Experienced Engineers Are Actually Being Measured on in AI-Assisted Coding Interviews',
      url: '/blog/what-experienced-engineers-are-actually-being-measured-on-in-ai-assisted-coding-interviews',
      summary: 'Definitive signal model for framing, constraints, tool direction, simplification, verification, communication, and line-level ownership.',
      tags: ['Interviews', 'AI', 'Engineering Judgment', 'Experienced Engineers', 'Technical Interviews']
    },
    {
      slug: 'a-practical-playbook-for-ai-assisted-coding-interviews',
      title: 'A Practical Playbook for AI-Assisted Coding Interviews',
      url: '/blog/a-practical-playbook-for-ai-assisted-coding-interviews',
      summary: 'Field manual for running an AI-assisted coding round well: frame first, prompt narrowly, verify hard, simplify, and close with ownership.',
      tags: ['Interviews', 'AI', 'Engineering Judgment', 'Technical Interviews', 'Software Engineering']
    },
    {
      slug: 'you-still-own-every-line-accountability-in-ai-assisted-coding-interviews',
      title: 'You Still Own Every Line: Accountability in AI-Assisted Coding Interviews',
      url: '/blog/you-still-own-every-line-accountability-in-ai-assisted-coding-interviews',
      summary: 'Sharp accountability thesis connecting interview ownership, reviewability, hidden assumptions, and production responsibility.',
      tags: ['Interviews', 'AI', 'Engineering Judgment', 'Software Engineering', 'Reliability']
    },
    {
      slug: 'how-candidates-fail-ai-assisted-coding-interviews',
      title: 'How Candidates Fail AI-Assisted Coding Interviews',
      url: '/blog/how-candidates-fail-ai-assisted-coding-interviews',
      summary: 'Diagnostic failure-mode guide showing what weak AI-assisted interview behavior looks like in the room and why trust erodes.',
      tags: ['Interviews', 'AI', 'Technical Interviews', 'Engineering Judgment']
    },
    {
      slug: 'what-strong-senior-engineers-do-differently-in-ai-assisted-coding-interviews',
      title: 'What Strong Senior Engineers Do Differently in AI-Assisted Coding Interviews',
      url: '/blog/what-strong-senior-engineers-do-differently-in-ai-assisted-coding-interviews',
      summary: 'Contrastive behavioral guide showing how strong senior engineers frame, simplify, verify, and close differently from average candidates.',
      tags: ['Interviews', 'AI', 'Senior Engineers', 'Engineering Judgment', 'Technical Interviews']
    },
    {
      slug: 'how-companies-should-evaluate-candidates-when-ai-is-allowed',
      title: 'How Companies Should Evaluate Candidates When AI Is Allowed',
      url: '/blog/how-companies-should-evaluate-candidates-when-ai-is-allowed',
      summary: 'Operational interviewer guide for AI-assisted evaluation: better prompts, better probes, better scoring, and less noise.',
      tags: ['Interviews', 'AI', 'Engineering Leadership', 'Technical Interviews', 'Engineering Judgment']
    },
    {
      slug: 'what-is-a-control-plane',
      title: 'What Is a Control Plane?',
      url: '/blog/what-is-a-control-plane',
      summary: 'How control planes translate intent into durable workflow execution in cloud platforms.',
      tags: ['Control Planes', 'Cloud Platforms', 'Architecture']
    },
    {
      slug: 'distributed-systems-interview-guide',
      title: 'Distributed Systems Interview Guide',
      url: '/blog/distributed-systems-interview-guide',
      summary: 'A practical study map for consistency, coordination, retries, and trade-offs.',
      tags: ['Distributed Systems', 'Interviews', 'Architecture']
    },
    {
      slug: 'api-backpressure-explained-simply',
      title: 'API Backpressure Explained Simply',
      url: '/blog/api-backpressure-explained-simply',
      summary: 'A primer on bounded work, fast failure, and overload control for APIs.',
      tags: ['Backpressure', 'APIs', 'Reliability']
    },
    {
      slug: 'designing-a-crdt-from-scratch',
      title: 'Designing a CRDT from Scratch',
      url: '/blog/designing-a-crdt-from-scratch',
      summary: 'A first-principles CRDT design guide: invariants, monotonic state, merge semantics, delete handling, and architecture integration.',
      tags: ['Distributed Systems', 'Correctness', 'Architecture']
    },
    {
      slug: 'what-is-eventual-consistency',
      title: 'What Is Eventual Consistency? (Explained Simply)',
      url: '/blog/what-is-eventual-consistency',
      summary: 'Why distributed systems converge over time and what consistency trade-offs mean in production.',
      tags: ['Distributed Systems', 'Correctness', 'Reliability']
    },
    {
      slug: 'what-is-the-cap-theorem',
      title: 'What Is the CAP Theorem? (Explained Simply)',
      url: '/blog/what-is-the-cap-theorem',
      summary: 'A practical explanation of consistency, availability, and partitions.',
      tags: ['Distributed Systems', 'Correctness', 'Architecture']
    },
    {
      slug: 'fallacies-of-distributed-computing',
      title: 'The Fallacies of Distributed Computing Still Break Modern Systems',
      url: '/blog/fallacies-of-distributed-computing',
      summary: 'A production-first breakdown of how classic distributed-systems assumptions still fail under real load, partial failure, and ownership complexity.',
      tags: ['Distributed Systems', 'Reliability', 'Architecture']
    },
    {
      slug: 'what-is-idempotency',
      title: 'What Is Idempotency? (And Why It Matters in Distributed Systems)',
      url: '/blog/what-is-idempotency',
      summary: 'Why safe retries and duplicate suppression are required for reliable workflows.',
      tags: ['Reliability', 'APIs', 'Correctness']
    },
    {
      slug: 'what-is-a-distributed-lock-with-examples',
      title: 'What Is a Distributed Lock? (With Examples)',
      url: '/blog/what-is-a-distributed-lock-with-examples',
      summary: 'Lease semantics, fencing tokens, and stale-owner failure modes.',
      tags: ['Distributed Systems', 'Correctness', 'Consensus']
    },
    {
      slug: 'raft-vs-paxos-vs-epaxos-practical-guide',
      title: 'Raft vs Paxos vs EPaxos: A Practical Guide',
      url: '/blog/raft-vs-paxos-vs-epaxos-practical-guide',
      summary: 'Consensus protocol trade-offs in implementation complexity and latency.',
      tags: ['Consensus', 'Distributed Systems', 'Architecture']
    },
    {
      slug: 'kafka-at-hyperscale',
      title: 'Kafka at Hyperscale',
      url: '/blog/kafka-at-hyperscale',
      summary: 'Operational patterns for running high-throughput Kafka systems.',
      tags: ['Kafka', 'Reliability', 'Distributed Systems']
    },
    {
      slug: 'three-node-vs-five-node-kafka-clusters',
      title: 'Three-Node vs Five-Node Kafka Clusters',
      url: '/blog/three-node-vs-five-node-kafka-clusters',
      summary: 'Replication and quorum trade-offs for cluster sizing decisions.',
      tags: ['Kafka', 'Reliability', 'Architecture']
    },
    {
      slug: 'designing-backpressure-graphql-cdn-latency',
      title: 'Designing Backpressure for GraphQL and CDN Latency',
      url: '/blog/designing-backpressure-graphql-cdn-latency',
      summary: 'How API edge behavior can amplify overload and how to bound it.',
      tags: ['Backpressure', 'APIs', 'Cloud Platforms']
    },
    {
      slug: 'latency-aware-backpressure-with-server-timing-in-cdn-fronted-distributed-systems',
      title: 'Latency-Aware Backpressure with Server-Timing',
      url: '/blog/latency-aware-backpressure-with-server-timing-in-cdn-fronted-distributed-systems',
      summary: 'Latency-informed admission control for CDN-fronted systems.',
      tags: ['Backpressure', 'APIs', 'Reliability']
    },
    {
      slug: 'backpressure-stability-correctness-distributed-systems',
      title: 'Backpressure, Stability, and Correctness in Distributed Systems',
      url: '/blog/backpressure-stability-correctness-distributed-systems',
      summary: 'Backpressure as a correctness concern, not just performance tuning.',
      tags: ['Backpressure', 'Distributed Systems', 'Correctness']
    },
    {
      slug: 'architecting-a-multitenant-control-plane-for-a-next-generation-data-tier',
      title: 'Architecting a Multitenant Control Plane for a Next-Generation Data Tier',
      url: '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier',
      summary: 'Durable command processing and partition-aware workflow execution for multitenancy.',
      tags: ['Control Planes', 'Architecture', 'Cloud Platforms']
    },
    {
      slug: 'designing-a-correct-distributed-lease-service-tenure-on-raft',
      title: 'Designing a Correct Distributed Lease Service: Tenure on Raft',
      url: '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft',
      summary: 'Lease safety model, leader time authority, and fencing for correctness.',
      tags: ['Correctness', 'Consensus', 'Distributed Systems']
    },
    {
      slug: 'programming-language-selection-in-distributed-systems-a-strategic-long-term-perspective',
      title: 'Programming Language Selection in Distributed Systems',
      url: '/blog/programming-language-selection-in-distributed-systems-a-strategic-long-term-perspective',
      summary: 'Language choice trade-offs for long-lived distributed platforms.',
      tags: ['Architecture', 'Distributed Systems', 'Java']
    },
    {
      slug: 'polyglot-functional-languages-distributed-systems',
      title: 'Polyglot Functional Languages in Distributed Systems',
      url: '/blog/polyglot-functional-languages-distributed-systems',
      summary: 'Where polyglot functional programming helps in reliability and correctness.',
      tags: ['Distributed Systems', 'Architecture', 'Reliability']
    },
    {
      slug: 'what-it-took-to-modernize-a-legacy-service-across-32-global-regions',
      title: 'What It Took to Modernize a Legacy Service Across 32 Global Regions',
      url: '/blog/what-it-took-to-modernize-a-legacy-service-across-32-global-regions',
      summary: 'A practical sequence for legacy modernization with compatibility checks and staged global rollout.',
      tags: ['Java', 'Cloud Platforms', 'Reliability', 'Architecture']
    }
  ];

  const model = window.siteContentModel;
  if (model && Array.isArray(model.items)) {
    const existingSlugs = new Set(articles.map((article) => article.slug));
    for (const item of model.items) {
      if (item.type !== 'article' || item.noindex || item.status !== 'published') continue;
      if (!item.canonicalPath || !item.canonicalPath.startsWith('/blog/')) continue;
      if (existingSlugs.has(item.slug)) continue;

      articles.push({
        slug: item.slug,
        title: item.title,
        url: item.canonicalPath,
        summary: item.summary,
        tags: item.tags.map((tag) => tag.name)
      });
      existingSlugs.add(item.slug);
    }
  }

  function slugifyTag(value) {
    if (model && typeof model.slugify === 'function') return model.slugify(value);
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
