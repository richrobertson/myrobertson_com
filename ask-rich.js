const ASK_RICH_PROMPTS = [
  "What measurable outcomes did Rich deliver in the Oracle CNS migration?",
  "How does Rich balance correctness and delivery speed in distributed systems?",
  "What examples demonstrate cross-team technical leadership?",
  "Which projects best show staff-level ownership and architecture depth?",
  "How relevant is Rich's experience for cloud platform and control-plane roles?",
];

const askRichEls = {
  form: document.querySelector("#askrich-form"),
  input: document.querySelector("#askrich-question"),
  messages: document.querySelector("#askrich-messages"),
  send: document.querySelector("#askrich-send"),
  promptList: document.querySelector("#askrich-prompt-list"),
  apiBase: document.querySelector("#api-base"),
  settings: document.querySelector(".askrich-settings"),
};

let askRichBusy = false;
const ASK_RICH_MAX_HISTORY = 6;
const askRichConversation = [];

function askRichSafeUrl(sourceUrl) {
  if (typeof sourceUrl !== "string" || sourceUrl.trim() === "") {
    return null;
  }

  try {
    const parsed = new URL(sourceUrl, window.location.href);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (_error) {
    return null;
  }

  return null;
}

function askRichAppend(role, text, citations) {
  const card = document.createElement("article");
  card.className = `message ${role}`;

  const roleEl = document.createElement("strong");
  roleEl.className = "role";
  roleEl.textContent = role === "assistant" ? "Ask Rich" : role === "user" ? "You" : "System";

  const answer = document.createElement("div");
  answer.className = "answer";
  answer.textContent = text;
  card.append(roleEl, answer);

  if (Array.isArray(citations) && citations.length > 0) {
    const details = document.createElement("details");
    details.className = "citations";

    const summary = document.createElement("summary");
    summary.textContent = `Citations (${citations.length})`;

    const list = document.createElement("ol");
    for (const citation of citations) {
      const li = document.createElement("li");
      const label = citation.title || citation.id || "Source";
      const safeUrl = askRichSafeUrl(citation.source_url);

      if (safeUrl) {
        const link = document.createElement("a");
        link.href = safeUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        li.append(link);
      } else {
        li.textContent = label;
      }

      if (typeof citation.chunk_index === "number") {
        const idx = document.createElement("span");
        idx.textContent = ` (chunk ${citation.chunk_index})`;
        li.append(idx);
      }
      list.append(li);
    }

    details.append(summary, list);
    card.append(details);
  }

  askRichEls.messages.append(card);
  askRichEls.messages.scrollTop = askRichEls.messages.scrollHeight;
}

function askRichGetApiBase() {
  try {
    const stored = localStorage.getItem("askrich.apiBase");
    if (stored && stored.trim()) {
      return stored.trim().replace(/\/$/, "");
    }
  } catch (_error) {
    // Storage is optional; continue with fallback value.
  }
  return "https://api.myrobertson.com";
}

function askRichSetBusy(isBusy) {
  askRichBusy = isBusy;
  askRichEls.send.disabled = isBusy;
  askRichEls.send.textContent = isBusy ? "Thinking..." : "Send question";
}

function askRichBuildConversationContext(question) {
  const recent = askRichConversation.slice(-ASK_RICH_MAX_HISTORY);
  if (!recent.length) {
    return question;
  }

  const transcript = recent
    .map((turn) => `${turn.role === "assistant" ? "Ask Rich" : "You"}: ${turn.text}`)
    .join("\n");

  return [
    "Conversation so far:",
    transcript,
    "",
    `Follow-up question from You: ${question}`,
    "Answer the follow-up directly and concisely using context above when relevant.",
  ].join("\n");
}

function askRichRemember(role, text) {
  if (!text || typeof text !== "string") {
    return;
  }

  askRichConversation.push({ role, text });
  if (askRichConversation.length > ASK_RICH_MAX_HISTORY * 2) {
    askRichConversation.splice(0, askRichConversation.length - ASK_RICH_MAX_HISTORY * 2);
  }
}

async function askRichRequest(question) {
  const base = askRichEls.apiBase
    ? (askRichEls.apiBase.value || "").trim().replace(/\/$/, "") || "https://api.myrobertson.com"
    : "https://api.myrobertson.com";
  const endpoint = `${base}/api/chat`;

  const contextualQuestion = askRichBuildConversationContext(question);
  const history = askRichConversation.slice(-ASK_RICH_MAX_HISTORY);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      contextual_question: contextualQuestion,
      conversation: history,
      top_k: 5,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) {
    const message = payload.error || payload.detail || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return {
    answer: payload.data && payload.data.answer ? payload.data.answer : "No answer returned.",
    citations: payload.data && Array.isArray(payload.data.citations) ? payload.data.citations : [],
  };
}

function askRichInitPromptStarters() {
  for (const prompt of ASK_RICH_PROMPTS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prompt-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      askRichEls.input.value = prompt;
      askRichEls.input.focus();
    });
    askRichEls.promptList.append(button);
  }
}

function askRichBindApiBasePersistence() {
  if (!askRichEls.apiBase) {
    return;
  }

  askRichEls.apiBase.value = askRichGetApiBase();
  askRichEls.apiBase.addEventListener("input", () => {
    const trimmed = (askRichEls.apiBase.value || "").trim().replace(/\/$/, "");
    try {
      localStorage.setItem("askrich.apiBase", trimmed || "https://api.myrobertson.com");
    } catch (_error) {
      // Continue even if browser storage is unavailable.
    }
  });
}

function askRichHideProdSettings() {
  const host = window.location.hostname.toLowerCase();
  const isProduction = host === "myrobertson.com" || host === "www.myrobertson.com";
  if (isProduction && askRichEls.settings) {
    askRichEls.settings.hidden = true;
  }
}

function askRichBindForm() {
  askRichEls.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (askRichBusy) {
      return;
    }

    const question = (askRichEls.input.value || "").trim();
    if (question.length < 3) {
      askRichAppend("system", "Please enter a more specific question.");
      return;
    }

    askRichAppend("user", question);
    askRichRemember("user", question);
    askRichEls.input.value = "";
    askRichSetBusy(true);

    try {
      const result = await askRichRequest(question);
      askRichAppend("assistant", result.answer, result.citations);
      askRichRemember("assistant", result.answer);
    } catch (error) {
      const message = error && error.message ? error.message : "Unable to fetch a response right now.";
      askRichAppend("system", `Unable to get an answer right now. ${message}`);
    } finally {
      askRichSetBusy(false);
      askRichEls.input.focus();
    }
  });

  askRichEls.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askRichEls.form.requestSubmit();
    }
  });
}

function askRichInit() {
  if (
    !askRichEls.form
    || !askRichEls.input
    || !askRichEls.messages
    || !askRichEls.send
    || !askRichEls.promptList
  ) {
    return;
  }

  askRichHideProdSettings();
  askRichInitPromptStarters();
  askRichBindApiBasePersistence();
  askRichBindForm();
  const welcome = "Ask about architecture decisions, modernization strategy, delivery outcomes, or technical leadership. Follow-up questions are supported.";
  askRichAppend("system", welcome);
  askRichRemember("assistant", welcome);
}

askRichInit();