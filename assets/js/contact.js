/* CredPoint — contact form. Validates the details, then opens the visitor's
   email app with a ready-to-send message to support. Nothing is stored here. */
(function () {
  "use strict";

  var SUPPORT = "support@credpoint.in";
  var MIN_WITHDRAWAL = 250;
  var form = document.getElementById("contact-form");
  if (!form) return;

  var topic = form.elements.topic;
  var statusBox = document.getElementById("form-status");
  var topicGroups = form.querySelectorAll("[data-topics]");
  var methodGroups = form.querySelectorAll("[data-method]");
  var messageOptional = document.getElementById("message-optional");

  function currentMethod() {
    var checked = form.querySelector('input[name="method"]:checked');
    return checked ? checked.value : "upi";
  }

  function refresh() {
    var t = topic.value;
    var m = currentMethod();
    topicGroups.forEach(function (g) {
      g.hidden = g.getAttribute("data-topics").split(" ").indexOf(t) === -1;
    });
    methodGroups.forEach(function (g) {
      g.hidden = g.getAttribute("data-method") !== m;
    });
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      if (f.name === "topic" || f.name === "website") return;
      var hiddenAncestor = f.closest("[hidden]");
      f.disabled = !!hiddenAncestor;
      if (f.hasAttribute("data-required")) f.required = !hiddenAncestor;
    });
    var needsMessage = ["general", "privacy", "partner"].indexOf(t) > -1;
    form.elements.message.required = needsMessage;
    if (messageOptional) messageOptional.hidden = needsMessage;
  }

  // Preselect a topic from links like contact.html?topic=withdrawal
  try {
    var preset = new URLSearchParams(window.location.search).get("topic");
    if (preset) {
      var safe = preset.replace(/[^a-z]/g, "");
      if (topic.querySelector('option[value="' + safe + '"]')) topic.value = safe;
    }
  } catch (e) { /* ignore on very old browsers */ }

  topic.addEventListener("change", refresh);
  form.querySelectorAll('input[name="method"]').forEach(function (r) { r.addEventListener("change", refresh); });
  refresh();

  function setError(f, msg) {
    var wrap = f.closest(".field") || f.closest(".consent");
    if (!wrap) return;
    wrap.classList.toggle("has-error", !!msg);
    var e = wrap.querySelector(".error");
    if (e) e.textContent = msg || "";
    if (msg) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid");
  }

  var rules = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address."; },
    upi: function (v) { return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/.test(v) ? "" : "Please enter a valid UPI ID, for example name@bank."; },
    account: function (v) { return /^\d{9,18}$/.test(v.replace(/\s/g, "")) ? "" : "Account numbers have 9 to 18 digits."; },
    ifsc: function (v) { return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()) ? "" : "IFSC codes look like ABCD0123456."; },
    amount: function (v) { return Number(v) >= MIN_WITHDRAWAL ? "" : "The minimum withdrawal is ₹" + MIN_WITHDRAWAL + "."; },
    value: function (v) { return Number(v) >= 0 ? "" : "Please enter a valid amount."; }
  };

  function validate() {
    var first = null;
    Array.prototype.forEach.call(form.elements, function (f) {
      if (!f.name || f.disabled || f.type === "submit" || f.type === "radio" || f.name === "website") return;
      var msg = "";
      if (f.type === "checkbox") {
        if (f.required && !f.checked) msg = "Please tick this box to continue.";
      } else {
        var v = (f.value || "").trim();
        if (f.required && !v) msg = "This field is required.";
        else if (v && rules[f.name]) msg = rules[f.name](v);
        else if (v && f.maxLength > 0 && v.length > f.maxLength) msg = "This is too long.";
      }
      setError(f, msg);
      if (msg && !first) first = f;
    });
    return first;
  }

  function labelText(f) {
    var l = form.querySelector('label[for="' + f.id + '"]');
    return l ? l.textContent.replace(/\(optional\)/i, "").trim() : f.name;
  }

  function compose() {
    var topicText = topic.options[topic.selectedIndex].text;
    var lines = ["Topic: " + topicText];
    Array.prototype.forEach.call(form.elements, function (f) {
      if (!f.name || f.disabled || ["topic", "message", "website", "consent"].indexOf(f.name) > -1) return;
      if (f.type === "submit") return;
      if (f.type === "radio") {
        if (f.checked) lines.push("Payout method: " + (f.value === "bank" ? "Bank transfer" : "UPI"));
        return;
      }
      var v = (f.value || "").trim();
      if (f.name === "ifsc") v = v.toUpperCase();
      if (v) lines.push(labelText(f) + ": " + v);
    });
    var msg = (form.elements.message.value || "").trim();
    var body = lines.join("\n") + (msg ? "\n\nMessage:\n" + msg : "") + "\n\n— Sent from the CredPoint contact page";
    var subject = "[CredPoint] " + topicText + " — " + form.elements.name.value.trim();
    return { subject: subject, body: body };
  }

  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements.website && form.elements.website.value) return; // spam trap
    statusBox.className = "form-status";
    statusBox.textContent = "";

    var bad = validate();
    if (bad) {
      statusBox.className = "form-status err show";
      statusBox.textContent = "Please check the highlighted fields.";
      bad.focus();
      return;
    }

    var mail = compose();
    window.location.href = "mailto:" + SUPPORT + "?subject=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mail.body);

    statusBox.className = "form-status ok show";
    var p1 = document.createElement("p");
    p1.textContent = "Your email app should open with this message addressed to " + SUPPORT + ". Press send there to reach us.";
    var p2 = document.createElement("p");
    p2.textContent = "Nothing opened? Copy the message and send it to " + SUPPORT + " from any email account.";
    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "btn btn-outline btn-sm";
    copy.textContent = "Copy message";
    copy.addEventListener("click", function () {
      copyText("To: " + SUPPORT + "\nSubject: " + mail.subject + "\n\n" + mail.body, function () { copy.textContent = "Copied"; });
    });
    statusBox.appendChild(p1);
    statusBox.appendChild(p2);
    statusBox.appendChild(copy);
  });

  form.addEventListener("input", function (e) {
    var w = e.target.closest && e.target.closest(".has-error");
    if (w) setError(e.target, "");
  });
})();
