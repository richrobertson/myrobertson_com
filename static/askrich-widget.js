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
  launcher.style.borderRadius = "999px";
  launcher.style.border = "1px solid #3a4f82";
  launcher.style.cursor = "pointer";
  launcher.style.font = "600 14px/1.1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  launcher.style.background = "#132245";
  launcher.style.color = "#ffffff";
  launcher.style.boxShadow = "0 12px 26px rgba(8, 14, 34, 0.45)";

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
  panel.style.background = "#0f1a36";
  panel.style.border = "1px solid #3a4f82";
  panel.style.borderRadius = "14px";
  panel.style.boxShadow = "0 22px 48px rgba(8, 14, 34, 0.52)";
  panel.style.overflow = "hidden";
  panel.style.color = "#f5f8ff";
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
  header.style.background = "#132245";
  header.style.borderBottom = "1px solid #3a4f82";
  header.style.color = "#f5f8ff";
  header.style.font = "600 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  header.textContent = TITLE;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Close";
  closeBtn.style.border = "1px solid #4d6396";
  closeBtn.style.background = "rgba(16, 30, 60, 0.8)";
  closeBtn.style.color = "#d8e2ff";
  closeBtn.style.padding = "6px 10px";
  closeBtn.style.borderRadius = "10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.font = "600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  const body = document.createElement("div");
  body.style.flex = "1";
  body.style.overflowY = "auto";
  body.style.padding = "10px";
  body.style.font = "400 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  body.style.background = "#0a1228";
  body.style.color = "#f5f8ff";

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.gap = "8px";
  form.style.padding = "10px";
  form.style.borderTop = "1px solid #3a4f82";
  form.style.background = "#0f1a36";

  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.placeholder = "Ask about impact, migrations, or technical depth";
  input.setAttribute("aria-label", "Ask Rich a question");
  input.style.flex = "1";
  input.style.padding = "10px 12px";
  input.style.border = "1px solid #3a4f82";
  input.style.borderRadius = "10px";
  input.style.background = "#0b1530";
  input.style.color = "#f5f8ff";
  input.style.font = "500 15px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  input.style.outline = "none";

  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  send.style.padding = "10px 12px";
  send.style.border = "0";
  send.style.borderRadius = "10px";
  send.style.background = "#5e8dff";
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
  const MAX_HISTORY = 6;
  const MAX_TURN_CHARS = 1200;
  const conversation = [];

  function closePanel() {
    // Return focus to the element that opened the dialog for keyboard users.
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
    // Store the previously focused element so close restores a predictable focus path.
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

    // Keep Tab/Shift+Tab cycling inside the dialog while it is open.
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
    msg.style.background = role === "You" ? "#14315f" : role === "Ask Rich" ? "#1c2c52" : "#232020";
    msg.style.border = role === "system" ? "1px solid #4f2f2f" : "1px solid #3a4f82";
    msg.style.borderRadius = "10px";
    msg.style.color = "#f5f8ff";

    const roleLabel = document.createElement("strong");
    roleLabel.style.color = "#cfddff";
    roleLabel.style.fontSize = "12px";
    roleLabel.style.letterSpacing = "0.05em";
    roleLabel.style.textTransform = "uppercase";
    roleLabel.textContent = role + ": ";
    msg.append(roleLabel, document.createTextNode(text));
    body.append(msg);
    body.scrollTop = body.scrollHeight;
  }

  function remember(role, text) {
    const normalized = normalizeTurnText(text);
    if (!normalized) {
      return;
    }

    conversation.push({ role, text: normalized });
    if (conversation.length > MAX_HISTORY) {
      conversation.splice(0, conversation.length - MAX_HISTORY);
    }
  }

  function normalizeTurnText(text) {
    if (typeof text !== "string") {
      return null;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.length <= MAX_TURN_CHARS) {
      return trimmed;
    }

    return trimmed.slice(0, MAX_TURN_CHARS) + "...";
  }

  function buildContextualQuestion(question) {
    const recent = conversation.slice(-MAX_HISTORY);
    if (!recent.length) {
      return question;
    }

    const transcript = recent
      .map(function (turn) {
        return (turn.role === "assistant" ? "Ask Rich" : "You") + ": " + turn.text;
      })
      .join("\n");

    return [
      "Conversation so far:",
      transcript,
      "",
      "Follow-up question from You: " + question,
      "Answer the follow-up directly and concisely using context above when relevant.",
    ].join("\n");
  }

  async function sendQuestion(question, contextualQuestion) {
    // top_k limits retrieval context size for predictable response latency.
    const response = await fetch(API_BASE.replace(/\/$/, "") + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: question,
        contextual_question: contextualQuestion,
        conversation: conversation.slice(-MAX_HISTORY),
        top_k: 5,
      }),
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

    // Build context from history before this turn, then remember the question
    // so history stays consistent with what the UI already shows.
    const contextualQuestion = buildContextualQuestion(question);
    remember("user", question);

    try {
      const answer = await sendQuestion(question, contextualQuestion);
      appendMessage("Ask Rich", answer);
      remember("assistant", answer);
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

  input.addEventListener("focus", function () {
    input.style.boxShadow = "0 0 0 2px #8cb4ff";
  });
  input.addEventListener("blur", function () {
    input.style.boxShadow = "none";
  });

  const welcome = "Ask about measurable outcomes, architecture decisions, or leadership impact. Follow-up questions are supported.";
  appendMessage("Ask Rich", welcome);
  remember("assistant", welcome);
})();