const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (typeof window.renderSiteChrome === "function") {
  window.renderSiteChrome();
}
