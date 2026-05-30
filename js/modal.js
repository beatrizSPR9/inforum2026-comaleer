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
// Proof results modal
// ---------------------------------------------------------------------------
var proofModal, proofModalOverlay, proofModalClose;
var proofModalTitle, proofModalFilename, proofModalBadge, proofModalBody;

document.addEventListener("DOMContentLoaded", function () {
  proofModal         = document.getElementById("proof-modal");
  proofModalOverlay  = document.getElementById("proof-modal-overlay");
  proofModalClose    = document.getElementById("proof-modal-close");
  proofModalTitle    = document.getElementById("proof-modal-title");
  proofModalFilename = document.getElementById("proof-modal-filename");
  proofModalBadge    = document.getElementById("proof-modal-badge");
  proofModalBody     = document.getElementById("proof-modal-body");

  proofModalClose.addEventListener("click", closeProofModal);
  proofModalOverlay.addEventListener("click", function (e) {
    if (e.target === proofModalOverlay) closeProofModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeProofModal();
  });
});

function openProofModal(study) {
  proofModalTitle.textContent    = study.title;
  proofModalFilename.textContent = "";
  proofModalBadge.setAttribute("hidden", "");
  proofModalBody.innerHTML = '<p class="proof-loading">Loading…</p>';

  proofModalOverlay.removeAttribute("hidden");
  proofModalOverlay.removeAttribute("aria-hidden");
  proofModal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  proofModalClose.focus();

  fetch(study.proofResultsPath)
    .then(function (res) { return res.text(); })
    .then(function (xml) { renderProofTable(xml); })
    .catch(function () {
      proofModalBody.innerHTML = '<p class="proof-error">Could not load proof results.</p>';
    });
}

function closeProofModal() {
  proofModal.setAttribute("hidden", "");
  proofModalOverlay.setAttribute("hidden", "");
  proofModalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function parseProofXml(xmlText) {
  var doc = new DOMParser().parseFromString(xmlText, "application/xml");

  var provers = {};
  doc.querySelectorAll("prover").forEach(function (p) {
    provers[p.getAttribute("id")] = p.getAttribute("name") + " " + p.getAttribute("version");
  });

  var fileEl = doc.querySelector("file");
  var fullyVerified = fileEl && fileEl.getAttribute("proved") === "true";

  var paths = fileEl ? Array.from(fileEl.querySelectorAll("path")) : [];
  var filename = paths.length ? paths[paths.length - 1].getAttribute("name") : "";

  var rows = [];
  function walkGoal(goal, depth) {
    var name    = goal.getAttribute("name");
    var proofEl = goal.querySelector(":scope > proof");
    if (proofEl) {
      var result = proofEl.querySelector("result");
      rows.push({
        type:     "leaf",
        name:     name,
        depth:    depth,
        proverId: proofEl.getAttribute("prover"),
        time:     result ? parseFloat(result.getAttribute("time")).toFixed(3) : "—",
        status:   result ? result.getAttribute("status") : "—"
      });
    } else {
      var transf = goal.querySelector(":scope > transf");
      if (transf) {
        rows.push({ type: "goal", name: name, depth: depth });
        rows.push({ type: "transf", name: transf.getAttribute("name"), depth: depth + 1 });
        Array.from(transf.querySelectorAll(":scope > goal"))
          .forEach(function (sg) { walkGoal(sg, depth + 2); });
      }
    }
  }

  var theory = doc.querySelector("theory");
  if (theory) {
    Array.from(theory.querySelectorAll(":scope > goal"))
      .forEach(function (g) { walkGoal(g, 0); });
  }

  return { provers: provers, fullyVerified: fullyVerified, filename: filename, rows: rows };
}

function renderProofTable(xmlText) {
  var data     = parseProofXml(xmlText);
  var proverIds = Object.keys(data.provers);

  proofModalFilename.textContent = data.filename;
  if (data.fullyVerified) proofModalBadge.removeAttribute("hidden");

  var thead = '<tr><th class="proof-th proof-th--obligation">Obligation</th>' +
    proverIds.map(function (id) {
      return '<th class="proof-th">' + escapeHtml(data.provers[id]) + '</th>';
    }).join('') + '</tr>';

  var tbody = data.rows.map(function (row) {
    var indent = (0.75 + row.depth * 1.25) + 'rem';
    var emptyCells = proverIds.map(function () {
      return '<td class="proof-cell proof-cell--empty">—</td>';
    }).join('');

    if (row.type === "transf") {
      return '<tr class="proof-row proof-row--transf">' +
        '<td class="proof-cell proof-cell--transf" colspan="' + (proverIds.length + 1) + '" style="padding-left:' + indent + '">' +
          escapeHtml(row.name) + '</td>' +
        '</tr>';
    }
    if (row.type === "goal") {
      return '<tr class="proof-row proof-row--goal">' +
        '<td class="proof-cell proof-cell--name" style="padding-left:' + indent + '">' +
          escapeHtml(row.name) + '</td>' +
        emptyCells + '</tr>';
    }
    // leaf
    var arrow = row.depth > 0 ? '<span class="proof-arrow">↳</span> ' : '';
    return '<tr class="proof-row proof-row--leaf">' +
      '<td class="proof-cell proof-cell--name" style="padding-left:' + indent + '">' +
        arrow + escapeHtml(row.name) + '</td>' +
      proverIds.map(function (id) {
        return id === row.proverId
          ? '<td class="proof-cell proof-cell--valid">' + row.time + 's</td>'
          : '<td class="proof-cell proof-cell--empty">—</td>';
      }).join('') + '</tr>';
  }).join('');

  proofModalBody.innerHTML =
    '<table class="proof-table"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';
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
