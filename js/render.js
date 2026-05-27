// =============================================================================
// render.js — Populates the page with data from data.js.
// Runs after data.js and after the DOM is ready.
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Site metadata ──────────────────────────────────────────────────────────

  // Hero
  document.getElementById("hero-thesis-title").textContent = SITE.thesisTitle;
  document.getElementById("hero-author").textContent       = SITE.author;
  document.getElementById("hero-institution").textContent  = SITE.institution;
  document.getElementById("hero-year").textContent         = SITE.year;
  document.getElementById("hero-badge-year").textContent   = SITE.year;

  var heroThesisLink = document.getElementById("hero-thesis-link");
  heroThesisLink.href = SITE.thesisUrl;

  // Footer
  document.getElementById("footer-author").textContent      = SITE.author;
  document.getElementById("footer-institution").textContent = SITE.institution;
  document.getElementById("footer-thesis-link").href        = SITE.thesisUrl;
  document.getElementById("footer-repo-link").href          = SITE.repoUrl;
  document.getElementById("footer-email-link").href         = "mailto:" + SITE.email;
  document.getElementById("footer-email-link").textContent  = SITE.email;
  document.getElementById("footer-copyright").textContent   = "© " + SITE.year + " " + SITE.author;

  // ── Tools ──────────────────────────────────────────────────────────────────

  var toolsGrid = document.getElementById("tools-grid");
  toolsGrid.innerHTML = "";

  TOOLS.forEach(function (tool) {
    var a = document.createElement("a");
    a.href = tool.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.className = "tool-card";
    a.innerHTML =
      '<div class="tool-card__header">' +
        '<span class="tool-card__name">' + escapeHtml(tool.name) + "</span>" +
        '<span class="tool-card__arrow" aria-hidden="true">↗</span>' +
      "</div>" +
      '<p class="tool-card__desc">' + escapeHtml(tool.description) + "</p>" +
      '<span class="tool-card__cta">View repository</span>';
    toolsGrid.appendChild(a);
  });

  // ── Steps ──────────────────────────────────────────────────────────────────

  var stepsList = document.getElementById("steps-list");
  stepsList.innerHTML = "";

  STEPS.forEach(function (step, i) {
    var li = document.createElement("li");
    li.className = "step-card";
    li.innerHTML =
      '<div class="step-card__header">' +
        '<span class="step-card__num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<h3 class="step-card__title">' + escapeHtml(step.title) + "</h3>" +
      "</div>" +
      '<pre class="step-card__code"><code>' + escapeHtml(step.code) + "</code></pre>";
    stepsList.appendChild(li);
  });

  // ── Case studies ───────────────────────────────────────────────────────────

  var csList = document.getElementById("case-studies-list");
  csList.innerHTML = "";

  CASE_STUDIES.forEach(function (study) {
    var li = document.createElement("li");
    li.className = "cs-item";
    li.innerHTML =
      '<div class="cs-item__info">' +
        '<h3 class="cs-item__title">' + escapeHtml(study.title) + "</h3>" +
        '<p class="cs-item__desc">' + escapeHtml(study.description) + "</p>" +
      "</div>" +
      '<button class="btn btn--accent" data-study-id="' + escapeHtml(study.id) + '">' +
        "View source" +
      "</button>";
    csList.appendChild(li);

    li.querySelector("button").addEventListener("click", function () {
      openModal(study);
    });
  });

});

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
