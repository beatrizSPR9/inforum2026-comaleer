// =============================================================================
// render.js — Populates the page with data from data.js.
// Runs after data.js and after the DOM is ready.
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Site metadata ──────────────────────────────────────────────────────────

  // Hero
  document.getElementById("hero-thesis-title").textContent = SITE.thesisTitle;
  document.getElementById("hero-badge-year").textContent   = SITE.year;

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
    var tl  = study.topLevelLines || 0;
    var idl = study.inDepthLines  || 0;
    var pct = (tl > 0 && idl > 0) ? Math.round((1 - idl / tl) * 100) : null;

    var badgeHtml = pct !== null
      ? '<span class="cs-card__badge">&minus;' + pct + '%</span>'
      : '';

    var statVal = function (n, unit) {
      return n
        ? '<span class="cs-card__stat-num">' + n + '</span>' +
          '<span class="cs-card__stat-unit"> ' + unit + '</span>'
        : '<span class="cs-card__stat-num">&mdash;</span>';
    };

    var li = document.createElement("li");
    li.className = "cs-card";
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.innerHTML =
      '<div class="cs-card__top">' +
        '<h3 class="cs-card__title">' + escapeHtml(study.title) + '</h3>' +
        badgeHtml +
      '</div>' +
      '<p class="cs-card__desc">' + escapeHtml(study.description) + '</p>' +
      '<div class="cs-card__stats-box">' +
        '<div class="cs-card__stat">' +
          '<span class="cs-card__stat-label">Top-level</span>' +
          '<span class="cs-card__stat-value">' + statVal(tl, 'lines') + '</span>' +
        '</div>' +
        '<div class="cs-card__stat">' +
          '<span class="cs-card__stat-label">In-depth</span>' +
          '<span class="cs-card__stat-value">' + statVal(idl, 'lines') + '</span>' +
        '</div>' +
        '<div class="cs-card__stat">' +
          '<span class="cs-card__stat-label">Reduction</span>' +
          '<span class="cs-card__stat-value">' + statVal(pct !== null ? pct : 0, pct !== null ? '%' : '') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cs-card__footer">' +
        '<button class="btn btn--accent cs-card__btn">View source →</button>' +
      '</div>';

    csList.appendChild(li);

    function handleOpen() { openModal(study); }
    li.addEventListener("click", handleOpen);
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); }
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
