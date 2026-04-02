(function () {
  const taxonomy = window.blogTaxonomy;
  if (!taxonomy) return;

  function createTagChip(tag, activeSlug) {
    const a = document.createElement('a');
    a.className = `tag-chip${activeSlug === tag.slug ? ' is-active' : ''}`;
    a.href = `/blog/?tag=${encodeURIComponent(tag.slug)}`;
    a.textContent = tag.name;
    return a;
  }

  function renderTagCloud() {
    const cloud = document.querySelector('[data-tag-cloud]');
    if (!cloud) return;

    const params = new URLSearchParams(window.location.search);
    const activeTag = params.get('tag') || '';

    // Prioritize high-frequency tags while keeping ordering stable for equal counts.
    const entries = Object.values(taxonomy.tags).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    cloud.innerHTML = '';
    for (const entry of entries) {
      const item = document.createElement('li');
      item.className = 'tag-cloud-item';
      const link = createTagChip(entry, activeTag);
      link.setAttribute('data-tag-weight', String(entry.count));
      item.append(link, document.createTextNode(` (${entry.count})`));
      cloud.appendChild(item);
    }

    const allCards = document.querySelectorAll('[data-article-slug]');
    allCards.forEach((card) => {
      const slug = card.getAttribute('data-article-slug');
      const article = taxonomy.articles.find((item) => item.slug === slug);
      if (!article) return;

      let tagsRow = card.querySelector('.entry-tags');
      if (!tagsRow) {
        tagsRow = document.createElement('p');
        tagsRow.className = 'entry-tags';
        card.appendChild(tagsRow);
      }
      tagsRow.innerHTML = '';
      article.tags.forEach((tag) => tagsRow.appendChild(createTagChip(tag, activeTag)));

      // Card visibility is fully URL-driven so filters are shareable via query string.
      const visible = !activeTag || article.tags.some((tag) => tag.slug === activeTag);
      card.classList.toggle('is-hidden', !visible);
    });

    const summary = document.querySelector('[data-tag-summary]');
    if (summary) {
      if (!activeTag) {
        summary.textContent = 'Browse by topic or scan the full archive below.';
      } else {
        const tag = taxonomy.tags[activeTag];
        summary.textContent = tag
          ? `Filtering for “${tag.name}” (${tag.count} article${tag.count > 1 ? 's' : ''}).`
          : 'Unknown tag filter. Showing all articles.';
      }
    }
  }

  function renderArticleTagsAndRelated() {
    const slug = document.body.getAttribute('data-article-slug');
    if (!slug) return;
    const article = taxonomy.articles.find((item) => item.slug === slug);
    if (!article) return;

    const host = document.querySelector('[data-article-meta]') || document.querySelector('.hero-content');
    if (host && !host.querySelector('.article-tags')) {
      const wrap = document.createElement('div');
      wrap.className = 'article-tags';
      const label = document.createElement('p');
      label.className = 'article-tags-label';
      label.textContent = 'Topics';
      const list = document.createElement('div');
      list.className = 'tag-list';
      article.tags.forEach((tag) => list.appendChild(createTagChip(tag, '')));
      wrap.append(label, list);
      host.appendChild(wrap);
    }

    const relatedHost = document.querySelector('[data-related-writing]');
    if (!relatedHost) return;

    // Related items are ranked by tag overlap, then title for deterministic output.
    const scored = taxonomy.articles
      .filter((item) => item.slug !== article.slug)
      .map((candidate) => {
        const overlap = candidate.tags.filter((tag) => article.tags.some((selfTag) => selfTag.slug === tag.slug)).length;
        return { candidate, overlap };
      })
      .filter((entry) => entry.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || a.candidate.title.localeCompare(b.candidate.title))
      .slice(0, 3)
      .map((entry) => entry.candidate);

    if (!scored.length) return;

    const section = document.createElement('section');
    section.className = 'section related-writing';
    section.innerHTML = '<h3>Related writing</h3>';
    const list = document.createElement('ul');
    for (const item of scored) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
      li.append(document.createTextNode(` — ${item.summary}`));
      list.appendChild(li);
    }
    section.appendChild(list);
    relatedHost.appendChild(section);
  }

  renderTagCloud();
  renderArticleTagsAndRelated();
})();
