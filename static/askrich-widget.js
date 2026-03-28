(function () {
  const SCRIPT = document.currentScript;
  const API_BASE = (SCRIPT && SCRIPT.dataset.apiBase) || "https://api.myrobertson.com";
  const TITLE = (SCRIPT && SCRIPT.dataset.title) || "Ask Rich";

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.textContent = TITLE;
  launcher.setAttribute("aria-label", "Open Ask Rich recruiter chat");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "askrich-widget-panel");
  launcher.style.position = "fixed";
  launcher.style.right = "16px";
  launcher.style.bottom = "16px";
  launcher.style.zIndex = "2147483647";
  launcher.style.padding = "12px 16px";
  launcher.style.border = "0";
  launcher.style.borderRadius = "999px";
  launcher.style.cursor = "pointer";
  launcher.style.font = "600 14px/1.1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  launcher.style.background = "linear-gradient(135deg, #173164 0%, #244b97 100%)";
  launcher.style.color = "#ffffff";
  launcher.style.boxShadow = "0 12px 26px rgba(11, 24, 52, 0.34)";

  const panel = document.createElement("aside");
  panel.id = "askrich-widget-panel";
  panel.style.position = "fixed";
  panel.style.right = "16px";
  panel.style.bottom = "72px";
  panel.style.width = "min(420px, calc(100vw - 24px))";
  panel.style.height = "min(560px, calc(100vh - 120px))";
  panel.style.display = "none";
  panel.style.flexDirection = "column";
  panel.style.zIndex = "2147483647";
  panel.style.background = "#f4f7fd";
  panel.style.border = "1px solid #b8c8e8";
  panel.style.borderRadius = "14px";
  panel.style.boxShadow = "0 22px 48px rgba(13, 28, 60, 0.28)";
  panel.style.overflow = "hidden";
  panel.style.color = "#0f2347";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Ask Rich recruiter chat");
  panel.setAttribute("aria-hidden", "true");
  panel.hidden = true;

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.padding = "11px 12px";
  header.style.background = "linear-gradient(180deg, #f9fbff 0%, #edf3ff 100%)";
  header.style.borderBottom = "1px solid #cfdaef";
  header.style.color = "#17315f";
  header.style.font = "600 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  header.textContent = TITLE;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Close";
  closeBtn.style.border = "1px solid #c5d4ee";
  closeBtn.style.background = "#f6f9ff";
  closeBtn.style.color = "#193560";
  closeBtn.style.padding = "6px 10px";
  closeBtn.style.borderRadius = "10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.font = "600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  const body = document.createElement("div");
  body.style.flex = "1";
  body.style.overflowY = "auto";
  body.style.padding = "10px";
  body.style.font = "400 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  body.style.background = "linear-gradient(180deg, #eef3fd 0%, #e8eefb 100%)";
  body.style.color = "#142b4f";

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.gap = "8px";
  form.style.padding = "10px";
  form.style.borderTop = "1px solid #cfdaef";
  form.style.background = "#f7faff";

  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.placeholder = "Ask about impact, migrations, or technical depth";
  input.setAttribute("aria-label", "Ask Rich a question");
  input.style.flex = "1";
  input.style.padding = "10px 12px";
  input.style.border = "1px solid #9ab3df";
  input.style.borderRadius = "10px";
  input.style.background = "#ffffff";
  input.style.color = "#0f2347";
  input.style.font = "500 15px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  send.style.padding = "10px 12px";
  send.style.border = "0";
  send.style.borderRadius = "10px";
  send.style.background = "#143f86";
  send.style.color = "#ffffff";
  send.style.cursor = "pointer";
  send.style.font = "600 15px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  let previousFocus = null;

  function closePanel() {
    panel.style.display = "none";
    panel.setAttribute("aria-hidden", "true");
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    const restoreTo = previousFocus && typeof previousFocus.focus === "function"
      ? previousFocus
      : launcher;
    restoreTo.focus();
    previousFocus = null;
  }

  function openPanel() {
    previousFocus = document.activeElement;
    panel.style.display = "flex";
    panel.setAttribute("aria-hidden", "false");
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || panel.style.display !== "flex") {
      return;
    }

    const focusables = panel.querySelectorAll(focusableSelector);
    if (!focusables.length) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function appendMessage(role, text) {
    const msg = document.createElement("div");
    msg.style.margin = "0 0 10px";
    msg.style.padding = "10px";
    msg.style.background = role === "You" ? "#dbe8ff" : "#ffffff";
    msg.style.border = role === "You" ? "1px solid #b5c9ef" : "1px solid #d5dfef";
    msg.style.borderRadius = "10px";
    msg.style.color = "#112b54";

    const roleLabel = document.createElement("strong");
    roleLabel.style.color = "#1a3f76";
    roleLabel.style.fontSize = "12px";
    roleLabel.style.letterSpacing = "0.02em";
    roleLabel.textContent = role + ": ";
    msg.append(roleLabel, document.createTextNode(text));
    body.append(msg);
    body.scrollTop = body.scrollHeight;
  }

  async function sendQuestion(question) {
    const response = await fetch(API_BASE.replace(/\/$/, "") + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, top_k: 5 }),
    });

    const payload = await response.json().catch(function () {
      return {};
    });
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || payload.detail || "Request failed");
    }

    return payload.data && payload.data.answer ? payload.data.answer : "No answer returned.";
  }

  launcher.addEventListener("click", function () {
    if (panel.style.display === "none") {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeBtn.addEventListener("click", function () {
    closePanel();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.style.display === "flex") {
      closePanel();
    }
    trapFocus(event);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) {
      return;
    }

    appendMessage("You", question);
    input.value = "";
    send.disabled = true;
    send.textContent = "...";

    try {
      const answer = await sendQuestion(question);
      appendMessage("Ask Rich", answer);
    } catch (error) {
      appendMessage("Ask Rich", "Sorry, I could not fetch a response right now.");
      if (window && window.console && error) {
        console.error(error);
      }
    } finally {
      send.disabled = false;
      send.textContent = "Send";
      input.focus();
    }
  });

  header.append(closeBtn);
  form.append(input, send);
  panel.append(header, body, form);
  document.body.append(launcher, panel);

  appendMessage("Ask Rich", "Ask about measurable outcomes, architecture decisions, or leadership impact.");
})();