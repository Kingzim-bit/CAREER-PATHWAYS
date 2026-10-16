(function () {
  var state = { entry: "olevel", track: "apps-solutions", exp: 0 };

  var $ = function (id) { return document.getElementById(id); };

  function entryPoint() {
    return PF.entryPoints.filter(function (e) { return e.id === state.entry; })[0] || PF.entryPoints[0];
  }
  function track() {
    return PF.tracks.filter(function (t) { return t.id === state.track; })[0] || PF.tracks[0];
  }
  function yearsText(n) {
    if (n === null || n === undefined) return "experience or portfolio";
    if (n === 0) return "no experience needed";
    return n + (n === 1 ? " year" : " years");
  }

  function bestRoute(role) {
    var b = entryPoint().bdqf;
    var eligible = role.routes.filter(function (r) { return r.bdqf <= b; });
    if (!eligible.length) return null;
    eligible.sort(function (x, y) {
      var xe = x.years === null ? 0 : x.years;
      var ye = y.years === null ? 0 : y.years;
      if (xe !== ye) return xe - ye;
      var xh = x.years === null ? 0 : 1;
      var yh = y.years === null ? 0 : 1;
      if (xh !== yh) return yh - xh;
      return y.bdqf - x.bdqf;
    });
    return eligible[0];
  }

  function status(role) {
    var route = bestRoute(role);
    if (!route) {
      var need = Math.min.apply(null, role.routes.map(function (r) { return r.bdqf; }));
      return { type: "study", needBdqf: need };
    }
    if (route.years === null || route.years === 0) return { type: "ok", route: route, soft: route.years === null };
    if (state.exp >= route.years) return { type: "ok", route: route, soft: false };
    return { type: "exp", route: route, years: route.years - state.exp };
  }

  var STATUS_META = {
    ok: { cls: "ok", icon: "✓", label: "You qualify now" },
    exp: { cls: "exp", icon: "⏳", label: "Experience needed" },
    study: { cls: "study", icon: "🎓", label: "Study needed" }
  };

  function statusText(s) {
    if (s.type === "ok") {
      return s.soft
        ? "Qualify with a portfolio"
        : "You qualify now";
    }
    if (s.type === "exp") return s.years + (s.years === 1 ? " year" : " years") + " experience needed";
    return "Study to BDQF " + s.needBdqf;
  }

  /* ---------- render: entry chips ---------- */
  function renderEntryChips() {
    $("entryChips").innerHTML = PF.entryPoints.map(function (e) {
      return '<button class="chip' + (e.id === state.entry ? " active" : "") + '" data-entry="' + e.id + '" title="' + e.desc + '">' +
        e.label + "<small>" + e.sub + "</small></button>";
    }).join("");
  }

  /* ---------- render: track tabs ---------- */
  function renderTabs() {
    $("trackTabs").innerHTML = PF.tracks.map(function (t) {
      return '<button class="tab' + (t.id === state.track ? " active" : "") + '" data-track="' + t.id + '">' + t.name + "</button>";
    }).join("");
  }

  /* ---------- render: legend ---------- */
  function renderLegend() {
    $("legend").innerHTML =
      '<span class="legend-item"><i class="dot ok"></i>Ready now</span>' +
      '<span class="legend-item"><i class="dot exp"></i>Experience needed</span>' +
      '<span class="legend-item"><i class="dot study"></i>Study needed</span>';
  }

  /* ---------- render: board ---------- */
  function studyStepHTML(role) {
    var b = entryPoint().bdqf;
    var s = status(role);
    if (s.type !== "study") return "";
    var nextB = Math.min(s.needBdqf, 6);
    var label = BDQF_LABEL[nextB] || ("BDQF " + nextB);
    return '<div class="step"><div class="study-card">' +
      '<div class="study-icon">🎓</div>' +
      "<h4>Study step</h4>" +
      "<p>From " + entryPoint().label + " (BDQF " + b + ") you need one more qualification before this route starts.</p>" +
      '<div class="need-row study-need">Study toward <b>BDQF ' + nextB + "</b> — " + label + "</div>" +
      "</div></div>";
  }

  function nodeHTML(role, index) {
    var s = status(role);
    var meta = STATUS_META[s.type];
    var sm = PF.stageMeta[role.stage];
    var routeBest = s.route || bestRoute(role) || role.routes[0];

    var html = '<div class="step">' +
      '<article class="node" data-role="' + role.id + '">' +
      '<div class="node-top">' +
      '<i class="node-stage" style="background:' + sm.accent + '"></i>' +
      '<span class="node-num">' + (index + 1) + "</span>" +
      '<div class="node-stage-label">' + sm.label + "</div>" +
      '<div class="node-title">' + role.title + "</div>" +
      "</div>" +
      '<div class="node-body">' +
      '<span class="status ' + meta.cls + '"><span class="ic">' + meta.icon + "</span>" + statusText(s) + "</span>" +
      '<div class="need">' +
      '<div class="need-row"><span>Qualification</span><span>BDQF ' + routeBest.bdqf + "</span></div>" +
      '<div class="need-row"><span>Experience</span><span>' + yearsText(routeBest.years) + "</span></div>" +
      '<div class="need-row"><span>Certifications</span><span>' + role.certs.length + " recommended</span></div>" +
      "</div>" +
      '<div class="skills-mini">' +
      role.skills.slice(0, 3).map(function (sk) {
        return '<div class="skill"><span class="skill-name">' + sk[0] + "</span>" +
          '<span class="skill-track"><i class="skill-fill" style="width:' + (sk[1] * 20) + '%"></i></span>' +
          '<span class="skill-lv">' + sk[1] + "</span></div>";
      }).join("") +
      "</div>" +
      '<div class="node-next"><span>Next up</span><b>' + (role.next ? "↑ " + nextTitle(role.next) : "Top of the path") + "</b></div>" +
      "</div></article></div>";
    return html;
  }

  function nextTitle(nextId) {
    var found = null;
    PF.tracks.forEach(function (t) {
      t.roles.forEach(function (r) { if (r.id === nextId) found = r.title; });
    });
    return found || nextId;
  }

  function renderBoard() {
    var t = track();
    $("trackTitle").textContent = t.name + " pathway";
    $("trackDesc").textContent = t.blurb;
    var study = studyStepHTML(t.roles[0]);
    $("board").innerHTML = study + t.roles.map(nodeHTML).join("");
  }

  /* ---------- drawer ---------- */
  function openDrawer(roleId) {
    var t = track();
    var role = t.roles.filter(function (r) { return r.id === roleId; })[0];
    if (!role) return;
    var s = status(role);
    var meta = STATUS_META[s.type];
    var best = s.route;

    var statusBanner =
      '<div class="d-status ' + meta.cls + '"><span class="em">' + meta.icon + "</span>" +
      (s.type === "ok"
        ? (s.soft ? "You qualify — a portfolio is enough for this route." : "You qualify for this role right now.")
        : s.type === "exp"
          ? "Qualification met — you still need " + s.years + (s.years === 1 ? " year" : " years") + " of experience."
          : "Not there yet — study up to BDQF " + s.needBdqf + " first (" + (BDQF_LABEL[s.needBdqf] || "") + ").") +
      "</div>";

    var routesHTML = role.routes.map(function (r, i) {
      var isBest = best && r === best;
      return '<div class="route' + (isBest ? " best" : "") + '">' +
        '<div class="route-head"><span>BDQF ' + r.bdqf + " + " + yearsText(r.years) + "</span>" +
        (isBest ? '<span class="route-tag">Your route</span>' : "") + "</div>" +
        '<div class="route-note">' + r.note + "</div></div>";
    }).join("");

    var skillsHTML = role.skills.map(function (sk) {
      return '<div class="skill-full"><div class="skill"><span class="skill-name">' + sk[0] + "</span>" +
        '<span class="skill-track"><i class="skill-fill" style="width:' + (sk[1] * 20) + '%"></i></span>' +
        '<span class="skill-lv">' + sk[1] + "</span>" +
        '<span class="skill-lv-label">' + SKILL_LEVELS[sk[1]] + "</span></div></div>";
    }).join("");

    $("drawer").innerHTML =
      '<div class="drawer-hero">' +
      '<button class="drawer-close" id="drawerClose" aria-label="Close">✕</button>' +
      '<span class="drawer-stage">' + PF.stageMeta[role.stage].label + "</span>" +
      "<h3>" + role.title + "</h3><p>" + role.summary + "</p></div>" +
      '<div class="drawer-body">' +
      '<div class="d-section"><h5>Your status</h5>' + statusBanner + routesHTML + "</div>" +
      '<div class="d-section"><h5>Skills you need</h5><div class="skills-full">' + skillsHTML + "</div></div>" +
      '<div class="d-section"><h5>Certifications to consider</h5><div class="certs">' +
      role.certs.map(function (c) { return '<span class="cert">' + c + "</span>"; }).join("") + "</div></div>" +
      (role.next
        ? '<div class="next-box"><span>Next promotion:<br><b>' + nextTitle(role.next) + "</b></span><span class=\"arrow\">→</span></div>"
        : '<div class="next-box"><span>This is the <b>top</b> of the pathway.</span><span class="arrow">★</span></div>') +
      "</div>";

    $("drawer").classList.add("open");
    $("overlay").classList.add("open");
    $("drawer").setAttribute("aria-hidden", "false");
    $("drawerClose").addEventListener("click", closeDrawer);
  }

  function closeDrawer() {
    $("drawer").classList.remove("open");
    $("overlay").classList.remove("open");
    $("drawer").setAttribute("aria-hidden", "true");
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var entryBtn = e.target.closest("[data-entry]");
    if (entryBtn) { state.entry = entryBtn.dataset.entry; renderEntryChips(); renderBoard(); return; }

    var tabBtn = e.target.closest("[data-track]");
    if (tabBtn) { state.track = tabBtn.dataset.track; renderTabs(); renderBoard(); closeDrawer(); return; }

    var node = e.target.closest(".node");
    if (node) { openDrawer(node.dataset.role); return; }
  });

  $("overlay").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  $("expRange").addEventListener("input", function (e) {
    state.exp = parseInt(e.target.value, 10) || 0;
    $("expVal").textContent = state.exp + (state.exp === 15 ? "+" : "");
    renderBoard();
  });

  /* ---------- init ---------- */
  renderEntryChips();
  renderTabs();
  renderLegend();
  renderBoard();
})();
