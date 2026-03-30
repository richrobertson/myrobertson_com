(function () {
  const navItems = [
    { label: "Home", href: "/", key: "home" },
    { label: "Ask Rich", href: "/ask-rich.html", key: "ask-rich" },
    { label: "Career Arc", href: "/career-arc.html", key: "career-arc" },
    { label: "Case Studies", href: "/case-studies/", key: "case-studies" },
    { label: "Writing", href: "/writing/", key: "writing" },
    { label: "Experience", href: "/#experience", key: "experience" },
    { label: "Education", href: "/#education", key: "education" },
    { label: "Contact", href: "/#contact", key: "contact" }
  ];

  function getPageKey() {
    // Keep nav highlighting consistent across landing pages and nested content routes.
    const path = window.location.pathname;
    if (path === '/ask-rich.html') return 'ask-rich';
    if (path === '/career-arc.html') return 'career-arc';
    if (path.startsWith('/case-studies/')) return 'case-studies';
    if (path.startsWith('/writing/') || path.startsWith('/blog/')) return 'writing';
    return document.body.dataset.page || 'home';
  }

  function linkClass(active) {
    return active ? 'nav-link is-active' : 'nav-link';
  }

  function renderHeader(slot) {
    if (!slot) return;
    const pageKey = getPageKey();
    const links = navItems
      .map((item) => {
        const active = item.key === pageKey;
        const current = active ? ' aria-current="page"' : '';
        return `<a class="${linkClass(active)}" href="${item.href}"${current}>${item.label}</a>`;
      })
      .join('');

    const navId = 'global-nav-links';
    slot.innerHTML = `
      <nav class="site-nav" aria-label="Global navigation">
        <a class="logo" href="/">myrobertson.com</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="${navId}">Menu</button>
        <div class="site-nav-links" id="${navId}">${links}</div>
      </nav>
    `;

    const toggle = slot.querySelector('.nav-toggle');
    const linksContainer = slot.querySelector('.site-nav-links');
    if (toggle && linksContainer) {
      function closeMenu() {
        toggle.setAttribute('aria-expanded', 'false');
        linksContainer.classList.remove('is-open');
      }
      // Mobile menu state is controlled via aria-expanded and a single CSS open class.
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        linksContainer.classList.toggle('is-open');
      });
      linksContainer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });
    }
  }

  function renderFooter(slot) {
    if (!slot) return;
    const tagName = slot.parentElement && slot.parentElement.tagName === 'FOOTER' ? 'div' : 'footer';
    slot.innerHTML = `
      <${tagName} class="site-footer-nav">
        <p>
          <a href="/">Home</a> ·
          <a href="/blog/">Blog</a> ·
          <a href="/case-studies/">Case Studies</a> ·
          <a href="/career-arc.html">Career Arc</a> ·
          <a href="/writing/">Writing</a> ·
          <a href="/ask-rich.html">Ask Rich</a> ·
          <a href="/distributed-systems-engineer.html">Distributed Systems Engineer</a> ·
          <a href="/cloud-platform-engineer.html">Cloud Platform Engineer</a>
        </p>
        <p>
          <a href="https://www.linkedin.com/in/royrobertson/" target="_blank" rel="noopener noreferrer">LinkedIn</a> ·
          <a href="https://github.com/richrobertson/myrobertson_com" target="_blank" rel="noopener noreferrer">GitHub Repo</a> ·
          <a href="/#contact">Contact</a>
        </p>
      </${tagName}>
    `;
  }

  window.renderSiteChrome = function renderSiteChrome() {
    renderHeader(document.querySelector('[data-site-header]'));
    renderFooter(document.querySelector('[data-site-footer]'));
  };
})();
