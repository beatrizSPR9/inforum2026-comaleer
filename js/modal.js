// =============================================================================
// modal.js — Code modal: open/close, tab switching, fetch, copy, download.
// =============================================================================

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
var modalStudy   = null;   // currently displayed case study object
var modalTab     = "top";  // "top" | "depth"
var modalSources = { top: null, depth: null };  // raw text once fetched

// ---------------------------------------------------------------------------
// DOM references (set after DOMContentLoaded)
// ---------------------------------------------------------------------------
var modal, modalOverlay, modalClose;
var modalTitle, modalFilename;
var tabTop, tabDepth;
var codePane;
var btnCopy, btnDownload;

document.addEventListener("DOMContentLoaded", function () {
  modal        = document.getElementById("code-modal");
  modalOverlay = document.getElementById("modal-overlay");
  modalClose   = document.getElementById("modal-close");

  modalTitle    = document.getElementById("modal-title");
  modalFilename = document.getElementById("modal-filename");

  tabTop   = document.getElementById("tab-top");
  tabDepth = document.getElementById("tab-depth");

  codePane = document.getElementById("modal-code");

  btnCopy     = document.getElementById("btn-copy");
  btnDownload = document.getElementById("btn-download");

  // ── Event listeners ────────────────────────────────────────────────────────
  modalClose.addEventListener("click", closeModal);
  // Only close when clicking the backdrop itself, not children (tabs, buttons, etc.)
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  tabTop.addEventListener("click", function () { switchTab("top"); });
  tabDepth.addEventListener("click", function () { switchTab("depth"); });

  btnCopy.addEventListener("click", copyCode);
  btnDownload.addEventListener("click", downloadCode);
});

// ---------------------------------------------------------------------------
// Open / Close
// ---------------------------------------------------------------------------
function openModal(study) {
  modalStudy   = study;
  modalTab     = "top";
  modalSources = { top: null, depth: null };

  // Header info
  modalTitle.textContent    = study.title;
  modalFilename.textContent = baseName(study.topLevelPath);

  // Tabs — reset active state
  setActiveTab("top");

  // Show modal + overlay
  modalOverlay.removeAttribute("hidden");
  modalOverlay.removeAttribute("aria-hidden");
  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();

  // Load both files
  loadSource(study, "top");
  loadSource(study, "depth");
}

function closeModal() {
  modal.setAttribute("hidden", "");
  modalOverlay.setAttribute("hidden", "");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalStudy = null;
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
function switchTab(tab) {
  modalTab = tab;
  setActiveTab(tab);
  renderCode();

  // Update filename in header
  if (modalStudy) {
    modalFilename.textContent = tab === "top"
      ? baseName(modalStudy.topLevelPath)
      : baseName(modalStudy.inDepthPath);
  }
}

function setActiveTab(tab) {
  tabTop.classList.toggle("tab--active",   tab === "top");
  tabDepth.classList.toggle("tab--active", tab === "depth");
  tabTop.setAttribute("aria-selected",   tab === "top");
  tabDepth.setAttribute("aria-selected", tab === "depth");
}

// ---------------------------------------------------------------------------
// Fetch source files
// ---------------------------------------------------------------------------
function loadSource(study, tab) {
  var path = tab === "top" ? study.topLevelPath : study.inDepthPath;

  renderCode(); // show "Loading…" immediately

  fetch(path)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (text) {
      modalSources[tab] = text;
      if (modalTab === tab) renderCode();
    })
    .catch(function () {
      modalSources[tab] = "(* Could not load " + path + " *)";
      if (modalTab === tab) renderCode();
    });
}

// ---------------------------------------------------------------------------
// Render code with Highlight.js
// ---------------------------------------------------------------------------
function renderCode() {
  var src = modalSources[modalTab];

  if (src === null) {
    codePane.innerHTML =
      '<pre class="code-pre"><code class="language-ocaml">Loading…</code></pre>';
    return;
  }

  var escaped = escapeHtml(src);
  // Wrap in a <code> that hljs can highlight
  codePane.innerHTML =
    '<pre class="code-pre"><code class="language-ocaml">' + escaped + "</code></pre>";

  // Re-run Highlight.js on the new element
  if (window.hljs) {
    var block = codePane.querySelector("code");
    hljs.highlightElement(block);
  }
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------
function copyCode() {
  var src = modalSources[modalTab];
  if (!src) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(src).then(function () {
      flashButton(btnCopy, "Copied!");
    });
  } else {
    // Fallback for older browsers / file://
    var ta = document.createElement("textarea");
    ta.value = src;
    ta.style.position = "fixed";
    ta.style.opacity  = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    flashButton(btnCopy, "Copied!");
  }
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------
function downloadCode() {
  if (!modalStudy) return;
  var path = modalTab === "top" ? modalStudy.topLevelPath : modalStudy.inDepthPath;
  var src  = modalSources[modalTab];

  if (src !== null) {
    // Download from in-memory text (works on file://)
    var blob = new Blob([src], { type: "text/plain" });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement("a");
    a.href     = url;
    a.download = baseName(path);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // Fallback: navigate to file path
    var a2 = document.createElement("a");
    a2.href     = path;
    a2.download = baseName(path);
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function baseName(path) {
  return path.split("/").pop();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function flashButton(btn, msg) {
  var original = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(function () {
    btn.textContent = original;
    btn.disabled = false;
  }, 1500);
}
