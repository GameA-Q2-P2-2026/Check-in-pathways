(function () {
  "use strict";

  var D = window.CHECKIN_DATA;
  var PREFIX = "gdci:v1:";
  var CFG = window.CHECKIN_CONFIG || {};
  var FIELDS = ["evidence", "finished", "next", "blocked", "q0", "q1", "goal"];

  var $ = function (id) { return document.getElementById(id); };

  var params = new URLSearchParams(window.location.search);
  var pathId = params.get("path");
  if (!D.paths[pathId]) pathId = D.order[0];
  var week = parseInt(params.get("week"), 10);
  if (!(week >= 1 && week <= D.paths[pathId].weeks.length)) week = 1;

  function store(key, value) {
    try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* storage may be blocked */ }
  }
  function load(key) {
    try {
      var raw = window.localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function remove(key) {
    try { window.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
  }

  function say(message, isError) {
    var box = $("message");
    box.textContent = message;
    box.className = isError ? "message error" : "message";
  }

  function readForm() {
    var data = { name: $("name").value.trim(), period: $("period").value.trim(), code: $("code").value.trim() };
    FIELDS.forEach(function (f) { data[f] = $(f).value.trim(); });
    var checked = document.querySelector('input[name="status"]:checked');
    data.status = checked ? checked.value : "";
    return data;
  }

  function weekKey(p, w) { return p + ":" + w; }

  function hasContent(d) {
    if (!d) return false;
    return FIELDS.some(function (f) { return d[f]; }) || !!d.status;
  }

  function saveDraft() {
    var d = readForm();
    store("name", d.name);
    store("period", d.period);
    store("code", d.code);
    store(weekKey(pathId, week), d);
    remove(weekKey(pathId, week) + ":sent");
    renderTrack();
  }

  function fillForm() {
    var saved = load(weekKey(pathId, week)) || {};
    $("name").value = load("name") || "";
    $("period").value = load("period") || "";
    $("code").value = load("code") || "";
    FIELDS.forEach(function (f) { $(f).value = saved[f] || ""; });
    var radios = document.querySelectorAll('input[name="status"]');
    Array.prototype.forEach.call(radios, function (r) { r.checked = (r.value === saved.status); });
  }

  function statusLabel(id) {
    for (var i = 0; i < D.status.length; i++) if (D.status[i].id === id) return D.status[i];
    return null;
  }

  function renderTrack() {
    var list = $("track");
    list.innerHTML = "";
    for (var w = 1; w <= D.paths[pathId].weeks.length; w++) {
      var saved = load(weekKey(pathId, w));
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "checkin.html?path=" + pathId + "&week=" + w;
      a.setAttribute("data-week", w);
      if (w === week) a.setAttribute("aria-current", "step");
      var num = document.createElement("span");
      num.className = "tile-num";
      num.textContent = w;
      var note = document.createElement("span");
      note.className = "tile-note";
      var s = saved && statusLabel(saved.status);
      var sent = load(weekKey(pathId, w) + ":sent");
      if (sent) note.textContent = "Submitted";
      else if (s) note.textContent = s.label;
      else if (hasContent(saved)) note.textContent = "Draft";
      else note.textContent = "Not started";
      if (s) li.setAttribute("data-status", s.id);
      a.appendChild(document.createTextNode("Week "));
      a.appendChild(num);
      a.appendChild(note);
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  function renderWeek() {
    var p = D.paths[pathId];
    var w = p.weeks[week - 1];
    document.body.setAttribute("data-path", pathId);
    document.title = p.name + " check-in, week " + week;
    $("path-select").value = pathId;
    $("heading").textContent = p.name + ": week " + week + " check-in";
    $("target").textContent = w.target;
    $("evidence-ask").textContent = w.evidence;
    $("q0-label").textContent = w.questions[0];
    $("q1-label").textContent = w.questions[1];
    var unityLink = $("unity-link");
    if (p.link) {
      unityLink.href = p.link;
      unityLink.textContent = "Open the Unity Learn pathway";
      unityLink.hidden = false;
    } else {
      unityLink.hidden = true;
    }
    fillForm();
    renderTrack();
    say("");
  }

  function go(newPath, newWeek) {
    if (newWeek > D.paths[newPath].weeks.length) newWeek = 1;
    pathId = newPath;
    week = newWeek;
    window.history.replaceState(null, "", "checkin.html?path=" + pathId + "&week=" + week);
    renderWeek();
  }

  function buildText() {
    var p = D.paths[pathId];
    var w = p.weeks[week - 1];
    var d = readForm();
    var s = statusLabel(d.status);
    var lines = [
      "GAME DESIGN CHECK-IN",
      "Name: " + d.name,
      d.period ? "Class period: " + d.period : null,
      "Path: " + p.name + " (" + p.unity + ")",
      "Week: " + week + " of " + p.weeks.length,
      "Target this week: " + w.target,
      "",
      "Evidence I can show (" + w.evidence + "):",
      d.evidence || "(none yet)",
      "",
      "Finished: " + (d.finished || "(blank)"),
      "Doing next: " + (d.next || "(blank)"),
      "Blocked by: " + (d.blocked || "Nothing"),
      "",
      w.questions[0],
      d.q0 || "(blank)",
      "",
      w.questions[1],
      d.q1 || "(blank)",
      "",
      "Status: " + (s ? s.label + " - " + s.text : ""),
      "Goal for next week: " + (d.goal || "(blank)")
    ];
    return lines.filter(function (l) { return l !== null; }).join("\n");
  }

  function validate(needCode) {
    var d = readForm();
    if (needCode && !d.code) { say("Enter the class code from your teacher.", true); $("code").focus(); return false; }
    if (!d.name) { say("Add your name first.", true); $("name").focus(); return false; }
    if (!d.status) { say("Pick a status: green, yellow, or red.", true); document.querySelector('input[name="status"]').focus(); return false; }
    if (!d.finished || !d.next || !d.goal) {
      say("Fill in what you finished, what you are doing next, and your goal for next week.", true);
      (!d.finished ? $("finished") : !d.next ? $("next") : $("goal")).focus();
      return false;
    }
    return true;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function buildPayload() {
    var p = D.paths[pathId];
    var w = p.weeks[week - 1];
    var d = readForm();
    return {
      code: d.code,
      name: d.name,
      period: d.period,
      path: pathId,
      pathName: p.name,
      week: week,
      target: w.target,
      evidenceAsked: w.evidence,
      evidence: d.evidence,
      finished: d.finished,
      next: d.next,
      blocked: d.blocked,
      question1: w.questions[0],
      answer1: d.q0,
      question2: w.questions[1],
      answer2: d.q1,
      status: d.status,
      goal: d.goal
    };
  }

  function submitOnline() {
    if (!validate(true)) return;
    var btn = $("submit");
    btn.disabled = true;
    say("Sending...");
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 20000);
    fetch(CFG.submitUrl, {
      method: "POST",
      body: JSON.stringify(buildPayload()),
      signal: controller.signal
    }).then(function (res) {
      return res.json();
    }).then(function (result) {
      clearTimeout(timer);
      btn.disabled = false;
      if (result && result.ok) {
        store(weekKey(pathId, week) + ":sent", new Date().toISOString());
        renderTrack();
        say("Submitted. Your teacher can see this check-in. You can edit and submit again if you need to fix something.");
      } else {
        say((result && result.error) || "The check-in was not accepted. Check your class code and try again.", true);
      }
    }).catch(function () {
      clearTimeout(timer);
      btn.disabled = false;
      say("Could not confirm that it was sent. Use Download check-in and give the file to your teacher.", true);
    });
  }

  function init() {
    var online = !!CFG.submitUrl;
    $("submit").hidden = !online;
    $("code-field").hidden = !online;
    if (!online) $("copy").className = "primary";
    $("submit").addEventListener("click", submitOnline);

    var select = $("path-select");
    D.order.forEach(function (id) {
      var o = document.createElement("option");
      o.value = id;
      o.textContent = D.paths[id].name;
      select.appendChild(o);
    });

    var statusBox = $("status-options");
    D.status.forEach(function (s) {
      var label = document.createElement("label");
      label.className = "status-option";
      label.setAttribute("data-status", s.id);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "status";
      input.value = s.id;
      var strong = document.createElement("strong");
      strong.textContent = s.label;
      var span = document.createElement("span");
      span.textContent = s.text;
      label.appendChild(input);
      label.appendChild(strong);
      label.appendChild(span);
      statusBox.appendChild(label);
    });

    select.addEventListener("change", function () { go(select.value, week); });

    $("track").addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      saveDraft();
      go(pathId, parseInt(a.getAttribute("data-week"), 10));
    });

    $("form").addEventListener("input", saveDraft);
    $("form").addEventListener("change", saveDraft);
    $("form").addEventListener("submit", function (e) { e.preventDefault(); });

    $("copy").addEventListener("click", function () {
      if (!validate()) return;
      copyText(buildText()).then(function () {
        say("Copied. Paste it into the Week " + week + " check-in in Google Classroom.");
      }, function () {
        say("Copy was blocked. Use Download instead and attach the file in Google Classroom.", true);
      });
    });

    $("download").addEventListener("click", function () {
      if (!validate()) return;
      var d = readForm();
      var safeName = d.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "student";
      var blob = new Blob([buildText() + "\n"], { type: "text/plain" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = safeName + "-" + pathId + "-week" + week + "-checkin.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      say("Downloaded. Attach the file to the Week " + week + " check-in in Google Classroom.");
    });

    $("clear").addEventListener("click", function () {
      if (!window.confirm("Clear everything you wrote for this week on this computer?")) return;
      remove(weekKey(pathId, week));
      remove(weekKey(pathId, week) + ":sent");
      fillForm();
      renderTrack();
      say("This week was cleared.");
    });

    renderWeek();
  }

  init();
})();
