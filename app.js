(function () {
  var state = { entry: "olevel", track: "apps-solutions", exp: 0, goal: null, wizStep: 0 };

  var $ = function (id) { return document.getElementById(id); };

  var STORE_KEY = "cp-progress-v1";
  var progress = {};
  try { progress = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (err) { progress = {}; }
  function isDone(id) { return !!progress[id]; }
  function toggleDone(id) {
    if (progress[id]) delete progress[id]; else progress[id] = 1;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (err) {}
  }

  function readURL() {
    var p = new URLSearchParams(location.search);
    var tr = p.get("track");
    if (tr && PF.tracks.some(function (t) { return t.id === tr; })) state.track = tr;
    var fr = p.get("from");
    if (fr && PF.entryPoints.some(function (e) { return e.id === fr; })) state.entry = fr;
    var ex = parseInt(p.get("exp"), 10);
    if (!isNaN(ex) && ex >= 0 && ex <= 50) state.exp = Math.min(ex, 15);
    var g = p.get("goal");
    if (g) {
      var gt = PF.tracks.filter(function (t) { return t.roles.some(function (r) { return r.id === g; }); })[0];
      if (gt) { state.goal = g; state.track = gt.id; }
    }
  }

  function syncURL() {
    try {
      var p = new URLSearchParams();
      p.set("track", state.track);
      p.set("from", state.entry);
      if (state.exp) p.set("exp", String(state.exp));
      if (state.goal) p.set("goal", state.goal);
      history.replaceState(null, "", location.pathname + "?" + p.toString());
    } catch (err) {}
  }

  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function shareLink() {
    var url = location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { toast("Link copied — share your pathway!"); },
        function () { prompt("Copy this link:", url); }
      );
    } else {
      prompt("Copy this link:", url);
    }
  }

  function entryPoint() {
    return PF.entryPoints.filter(function (e) { return e.id === state.entry; })[0] || PF.entryPoints[0];
  }
  function track() {
    return PF.tracks.filter(function (t) { return t.id === state.track; })[0] || PF.tracks[0];
  }
  function goalRole() {
    if (!state.goal) return null;
    return track().roles.filter(function (r) { return r.id === state.goal; })[0] || null;
  }
  function journeyRoles() {
    var t = track();
    var goal = goalRole();
    if (!goal) return t.roles;
    var prev = {}, seen = {}, queue = [goal.id];
    seen[goal.id] = 1;
    while (queue.length) {
      var cur = queue.shift();
      var preds = t.roles.filter(function (r) { return (r.next || []).indexOf(cur) >= 0; });
      if (!preds.length) break;
      prev[cur] = preds[0].id;
      if (!seen[preds[0].id]) { seen[preds[0].id] = 1; queue.push(preds[0].id); }
    }
    var chain = [], c = goal.id;
    while (c) { chain.push(c); c = prev[c]; }
    chain.reverse();
    return chain.map(function (id) {
      return t.roles.filter(function (r) { return r.id === id; })[0];
    });
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

  function careerChar(level, variant) {
    level = Math.max(1, Math.min(6, Number(level) || 1));
    var cls = "career-char" + (variant === "lg" ? " career-char-lg" : "");
    return '<img class="' + cls + ' lvl-' + level + '" src="assets/levels/level-' + level + '.svg" alt="Level ' + level + ' career outfit">';
  }

  function roleLevel(index) {
    return Math.min(index + 2, 6);
  }

  function renderStrip() {
    var roles = journeyRoles();
    var current = 1;

    var panels = '<div class="strip-panel' + (current === 1 ? " current" : "") + '">' +
      '<div class="char-wrap"><img class="level-img" src="level.jpg" alt="Level 1 icon" /></div>' +
      '<div class="lvl-word">LEVEL</div><div class="lvl-num">1</div>' +
      '<div class="strip-caption">You · ' + entryPoint().label + "</div></div>";

    for (var i = 0; i < roles.length; i++) {
      var lvl = i + 2;
      panels += '<div class="strip-panel' + (current === lvl ? " current" : "") + (isDone(roles[i].id) ? " done" : "") + '">' +
        '<div class="char-wrap"><img class="level-img" src="level.jpg" alt="Level ' + lvl + ' icon" /></div>' +
        '<div class="lvl-word">LEVEL</div><div class="lvl-num">' + lvl + "</div>" +
        '<div class="strip-caption">' + roles[i].title + "</div></div>";
    }
    $("strip").innerHTML = panels;

    var doneCount = roles.filter(function (r) { return isDone(r.id); }).length;
    $("progFill").style.width = (doneCount / roles.length * 100) + "%";
    $("progLabel").textContent = doneCount + "/" + roles.length + " steps done";
  }

  function pinHTML(index, accent, mark, done) {
    return '<div class="pin' + (done ? " pin-done" : "") + '" style="border-color:' + accent + '"><span>' + (done ? "✓" : mark) + "</span></div>";
  }

  function youCardHTML() {
    var e = entryPoint();
    var exp = state.exp + (state.exp === 15 ? "+" : "");
    return '<div class="step">' +
      '<div class="pin pin-you"><span>★</span></div>' +
      '<div class="you-card">' +
      '<div class="you-head">You are here</div>' +
      '<div class="you-body"><b>' + e.label + "</b>" +
      "<span>BDQF " + e.bdqf + " · " + exp + (state.exp === 1 ? " year" : " years") + " experience</span></div>" +
      "</div></div>";
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
    return '<div class="step">' +
      '<div class="pin pin-study"><span>🎓</span></div>' +
      '<div class="study-card">' +
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

    var done = isDone(role.id);
    var isGoal = state.goal === role.id;
    var html = '<div class="step">' +
      pinHTML(index, sm.accent, index + 1, done) +
      '<article class="node' + (done ? " done" : "") + (isGoal ? " goal" : "") + '" data-role="' + role.id + '">' +
      '<div class="node-top">' +
      '<i class="node-stage" style="background:' + sm.accent + '"></i>' +
      '<div class="node-heading">' +
      '<div class="node-stage-label">' + (isGoal ? "🎯 Your goal · " : "") + sm.label + "</div>" +
      '<div class="node-title">' + role.title + "</div>" +
      "</div>" +
      careerChar(roleLevel(index), "bust") +
      "</div>" +
      '<div class="node-body">' +
      '<span class="status ' + meta.cls + '"><span class="ic">' + meta.icon + "</span>" + statusText(s) + "</span>" +
      '<div class="future"><span class="future-label">Future you</span><p>' + (FUTURES[role.id] || "") + "</p></div>" +
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
      '<div class="node-actions"><button class="mark' + (done ? " on" : "") + '" data-mark="' + role.id + '">' +
      (done ? "✓ Done" : "Mark as done") + "</button></div>" +
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

  function goalBannerHTML() {
    var g = goalRole();
    if (!g) return "";
    return '<div class="goal-banner">' +
      '<span class="goal-emoji">🎯</span>' +
      "<div><b>Your goal: " + g.title + "</b>" +
      "<span>Journey of " + journeyRoles().length + " stages · " + entryPoint().label + " start</span></div>" +
      '<button class="btn-share" id="changeGoal">Change goal</button></div>';
  }

  function renderBoard() {
    var t = track();
    var roles = journeyRoles();
    var g = goalRole();
    $("trackTitle").textContent = g ? "Your journey to " + g.title : t.name + " pathway";
    $("trackDesc").textContent = g ? "Every stage you'll pass through to reach " + g.title + "." : t.blurb;
    $("goalBanner").innerHTML = g ? goalBannerHTML() : "";
    $("studyLink").innerHTML = t.course
      ? 'Study this at COSMO: <a href="' + t.course.url + '" target="_blank" rel="noopener">' + t.course.title + " →</a>"
      : "";
    var study = studyStepHTML(roles[0]);
    $("board").innerHTML = youCardHTML() + study + roles.map(nodeHTML).join("");
    renderStrip();
    syncURL();
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
      '<div class="drawer-hero-main">' +
      '<div><span class="drawer-stage">' + PF.stageMeta[role.stage].label + "</span>" +
      "<h3>" + role.title + "</h3><p>" + role.summary + "</p></div>" +
      '<div class="drawer-char">' + careerChar(roleLevel(t.roles.indexOf(role)), "lg") +
      '<span class="drawer-lvl">LEVEL ' + roleLevel(t.roles.indexOf(role)) + "</span></div>" +
      "</div></div>" +
      '<div class="drawer-body">' +
      '<div class="d-section"><h5>Your future self</h5>' +
      '<div class="future future-lg"><p>' + (FUTURES[role.id] || "") + "</p></div></div>" +
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

  function resetAll() {
    state.entry = "olevel";
    state.track = "apps-solutions";
    state.exp = 0;
    state.goal = null;
    $("expRange").value = "0";
    $("expVal").textContent = "0";
    closeDrawer();
    closeQuiz();
    renderEntryChips();
    renderTabs();
    renderBoard();
    openWizard(0);
    window.scrollTo({ top: 0 });
  }

  /* ---------- wizard ---------- */
  var wizField = null;
  var wizCareer = null;

  function findRole(id) {
    var found = null;
    PF.tracks.forEach(function (t) {
      t.roles.forEach(function (r) { if (r.id === id) found = { role: r, track: t }; });
    });
    return found;
  }

  function openWizard(step) {
    state.wizStep = step;
    renderWizard();
    $("wizard").classList.add("open");
  }
  function closeWizard() {
    $("wizard").classList.remove("open");
    state.wizStep = -1;
  }

  function renderWizard() {
    var w = $("wizard");
    var step = state.wizStep;
    var head = function (n, backable) {
      return '<div class="wiz-bar">' +
        (backable ? '<button class="wiz-back" data-wiz="back">← Back</button>' : "<span></span>") +
        '<span class="wiz-step-label">Step ' + n + " of 5</span>" +
        '<button class="wiz-skip" data-wiz="skip">Skip</button></div>';
    };

    if (step === 0) {
      w.innerHTML = '<div class="wiz-inner">' + head(1, false) +
        '<div class="wiz-center">' +
        '<div class="wiz-logo"><span></span></div>' +
        '<h1 class="wiz-title">What do you want to be?</h1>' +
        '<p class="wiz-sub">Pick a field, choose your dream career, and we\'ll map the exact pathway — every stage, skill and certification — from where you are today.</p>' +
        '<button class="wiz-btn primary" data-wiz="next">Start my journey →</button>' +
        "</div></div>";
      return;
    }

    if (step === 1) {
      w.innerHTML = '<div class="wiz-inner">' + head(2, true) +
        '<h2 class="wiz-q">Which field interests you?</h2>' +
        '<div class="wiz-grid">' +
        FIELDS.map(function (f) {
          return '<button class="wiz-card" data-wiz="field:' + f.id + '">' +
            '<span class="wiz-emoji">' + f.emoji + "</span>" +
            "<b>" + f.name + "</b><span>" + f.blurb + "</span></button>";
        }).join("") +
        "</div></div>";
      return;
    }

    if (step === 2) {
      var careers = [];
      PF.tracks.forEach(function (t) {
        if (t.field !== wizField) return;
        t.roles.forEach(function (r, i) { careers.push({ role: r, track: t, level: roleLevel(i) }); });
      });
      var f = FIELDS.filter(function (x) { return x.id === wizField; })[0];
      w.innerHTML = '<div class="wiz-inner">' + head(3, true) +
        '<h2 class="wiz-q">Which career do you want?</h2>' +
        '<p class="wiz-sub wiz-sub-top">' + f.emoji + " " + f.name + " — pick the job you'd love to reach.</p>" +
        '<div class="wiz-grid wiz-grid-careers">' +
        careers.map(function (c) {
          return '<button class="wiz-career' + (wizCareer === c.role.id ? " picked" : "") + '" data-wiz="career:' + c.role.id + '">' +
            '<span class="wiz-career-char">' + careerChar(c.level, "bust") + "</span>" +
            "<b>" + c.role.title + "</b><span>" + c.track.short + " · " + PF.stageMeta[c.role.stage].label + "</span></button>";
        }).join("") +
        "</div></div>";
      return;
    }

    if (step === 3) {
      var found = findRole(wizCareer);
      if (!found) { state.wizStep = 1; renderWizard(); return; }
      var role = found.role;
      var lvl = roleLevel(found.track.roles.indexOf(role));
      w.innerHTML = '<div class="wiz-inner">' + head(4, true) +
        '<div class="wiz-profile">' +
        '<div class="wiz-profile-char">' + careerChar(lvl, "lg") +
        '<span class="drawer-lvl">LEVEL ' + lvl + "</span></div>" +
        '<div class="wiz-profile-info">' +
        '<span class="drawer-stage">' + PF.stageMeta[role.stage].label + " · " + found.track.name + "</span>" +
        "<h2>" + role.title + "</h2>" +
        '<p class="wiz-profile-sum">' + role.summary + "</p>" +
        '<div class="future"><span class="future-label">Future you</span><p>' + (FUTURES[role.id] || "") + "</p></div>" +
        '<button class="wiz-btn primary" data-wiz="ready">I\'m Ready — start my pathway →</button>' +
        "</div></div></div>";
      return;
    }
  }

  function handleWiz(arg) {
    if (arg === "next") { state.wizStep++; renderWizard(); return; }
    if (arg === "back") { state.wizStep--; renderWizard(); return; }
    if (arg === "skip") { closeWizard(); return; }
    if (arg === "ready") {
      var found = findRole(wizCareer);
      if (!found) return;
      state.track = found.track.id;
      state.goal = found.role.id;
      closeWizard();
      renderTabs();
      renderBoard();
      var el = $("board");
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (arg.indexOf("field:") === 0) {
      wizField = arg.slice(6);
      state.wizStep = 2;
      renderWizard();
      return;
    }
    if (arg.indexOf("career:") === 0) {
      wizCareer = arg.slice(7);
      state.wizStep = 3;
      renderWizard();
      return;
    }
  }

  /* ---------- quiz ---------- */
  var QUIZ = [
    {
      q: "Which sounds most fun?",
      opts: [
        ["Building apps and websites", "apps-solutions"],
        ["Catching hackers and securing systems", "ict-security"],
        ["Fixing networks and servers", "telecom-network"],
        ["Finding patterns in data", "data-ai"],
        ["Designing posters and interfaces", "digital-media"],
        ["Growing brands and campaigns", "business-marketing"]
      ]
    },
    {
      q: "Your ideal work style?",
      opts: [
        ["Deep focus, writing code", "apps-solutions"],
        ["Always alert, solving incidents", "ict-security"],
        ["Hands-on with machines", "telecom-network"],
        ["Research and experiments", "data-ai"],
        ["Creative drafts and feedback", "digital-media"],
        ["Meetings, pitches and people", "business-marketing"]
      ]
    },
    {
      q: "Pick a superpower for work",
      opts: [
        ["Build anything from scratch", "apps-solutions"],
        ["See every weakness in a system", "ict-security"],
        ["Never lose connection", "telecom-network"],
        ["Predict the future with data", "data-ai"],
        ["Make anything look beautiful", "digital-media"],
        ["Persuade anyone", "business-marketing"]
      ]
    }
  ];
  var quizStep = 0;
  var quizScore = {};

  function openQuiz() {
    quizStep = 0;
    quizScore = {};
    renderQuiz();
    $("quiz").classList.add("open");
    $("overlay").classList.add("open");
  }
  function closeQuiz() {
    $("quiz").classList.remove("open");
    $("overlay").classList.remove("open");
  }
  function renderQuiz() {
    var box = $("quizBody");
    if (quizStep < QUIZ.length) {
      var item = QUIZ[quizStep];
      box.innerHTML =
        '<div class="q-progress">Question ' + (quizStep + 1) + " of " + QUIZ.length + "</div>" +
        "<h4>" + item.q + "</h4>" +
        '<div class="q-opts">' +
        item.opts.map(function (o) {
          return '<button class="q-opt" data-qtrack="' + o[1] + '">' + o[0] + "</button>";
        }).join("") +
        "</div>";
      return;
    }
    var bestTrack = null, bestScore = -1;
    Object.keys(quizScore).forEach(function (k) {
      if (quizScore[k] > bestScore) { bestScore = quizScore[k]; bestTrack = k; }
    });
    var t = PF.tracks.filter(function (x) { return x.id === bestTrack; })[0] || PF.tracks[0];
    box.innerHTML =
      '<div class="q-result">' +
      '<div class="q-result-label">Your match</div>' +
      "<h4>" + t.name + "</h4>" +
      "<p>" + t.blurb + "</p>" +
      '<button class="btn-primary" data-track="' + t.id + '" id="quizGo">Show my pathway →</button>' +
      '<button class="btn-ghost" id="quizClose">Retake quiz</button>' +
      "</div>";
    $("quizGo").addEventListener("click", closeQuiz);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var markBtn = e.target.closest("[data-mark]");
    if (markBtn) {
      toggleDone(markBtn.dataset.mark);
      renderBoard();
      e.stopPropagation();
      return;
    }

    var wizBtn = e.target.closest("[data-wiz]");
    if (wizBtn) { handleWiz(wizBtn.dataset.wiz); return; }

    if (e.target.closest("#changeGoal")) { openWizard(1); return; }
    if (e.target.closest("#homeBtn")) { resetAll(); return; }

    var entryBtn = e.target.closest("[data-entry]");
    if (entryBtn) { state.entry = entryBtn.dataset.entry; renderEntryChips(); renderBoard(); return; }

    var tabBtn = e.target.closest("[data-track]");
    if (tabBtn) {
      state.track = tabBtn.dataset.track;
      state.goal = null;
      renderTabs();
      renderBoard();
      closeDrawer();
      return;
    }

    if (e.target.closest("#shareBtn")) { shareLink(); return; }
    if (e.target.closest("#quizBtn")) { openQuiz(); return; }
    if (e.target.closest("#quizClose")) { closeQuiz(); return; }

    var qOpt = e.target.closest("[data-qtrack]");
    if (qOpt) {
      quizScore[qOpt.dataset.qtrack] = (quizScore[qOpt.dataset.qtrack] || 0) + 1;
      quizStep++;
      renderQuiz();
      return;
    }

    var node = e.target.closest(".node");
    if (node) { openDrawer(node.dataset.role); return; }
  });

  $("overlay").addEventListener("click", function () { closeDrawer(); closeQuiz(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); closeQuiz(); } });

  $("expRange").addEventListener("input", function (e) {
    state.exp = parseInt(e.target.value, 10) || 0;
    $("expVal").textContent = state.exp + (state.exp === 15 ? "+" : "");
    renderBoard();
  });

  /* ---------- init ---------- */
  readURL();
  $("expRange").value = String(state.exp);
  $("expVal").textContent = state.exp + (state.exp === 15 ? "+" : "");
  renderEntryChips();
  renderTabs();
  renderLegend();
  renderBoard();
  if (!state.goal) openWizard(0);
})();
