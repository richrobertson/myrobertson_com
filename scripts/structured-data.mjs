const SITE_URL = 'https://www.myrobertson.com';

export const personNode = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person-rich-robertson`,
  name: 'Rich Robertson',
  url: `${SITE_URL}/`,
  jobTitle: 'Senior Backend Engineer, Distributed Systems and Platform Modernization',
  sameAs: [
    'https://github.com/richrobertson',
    'https://www.linkedin.com/in/royrobertson/'
  ],
  knowsAbout: [
    'distributed systems',
    'control planes',
    'cloud migration',
    'platform modernization',
    'backend reliability',
    'workflow orchestration',
    'operability'
  ]
};

export const websiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Rich Robertson',
  url: `${SITE_URL}/`,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person-rich-robertson` }
};

export function breadcrumbNode(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function articleNode({ type = 'TechArticle', id, headline, description, url, datePublished, dateModified, keywords, about, citation }) {
  const node = {
    '@type': type,
    '@id': id,
    headline,
    description,
    author: { '@id': `${SITE_URL}/#person-rich-robertson` },
    url,
    mainEntityOfPage: url,
    datePublished,
    dateModified,
    inLanguage: 'en',
    keywords,
    about,
    isPartOf: { '@id': `${SITE_URL}/#website` }
  };
  if (citation?.length) node.citation = citation;
  return node;
}

export function collectionNode({ id, name, description, url }) {
  return {
    '@type': 'CollectionPage',
    '@id': id,
    name,
    description,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` }
  };
}

export function graphJson(...nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 2);
}
