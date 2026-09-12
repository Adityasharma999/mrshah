/* M. R. Shah Logistics Pvt. Ltd. — interactions v2 */
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader with counter ---------- */
  var pre = document.getElementById("preloader");
  var preNum = pre ? pre.querySelector(".pl-n") : null;
  function finishPre() {
    document.body.classList.add("ready");
    if (pre) pre.classList.add("done");
  }
  if (pre) {
    if (reduced) {
      if (preNum) preNum.textContent = "100";
      finishPre();
    } else {
      var t0 = null, DUR = 1100;
      var tick = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / DUR, 1);
        if (preNum) preNum.textContent = String(Math.round(p * 100)).padStart(3, "0");
        if (p < 1) requestAnimationFrame(tick);
        else setTimeout(finishPre, 250);
      };
      requestAnimationFrame(tick);
      setTimeout(finishPre, 2600); /* safety net */
    }
  } else {
    document.body.classList.add("ready");
  }

  /* ---------- Header shadow ---------- */
  var header = document.querySelector(".hdr");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.classList.remove("open");
      }
    });
  }

  /* ---------- Reveal on scroll (.rv + line masks .mask) ---------- */
  var revealEls = document.querySelectorAll(".rv, .mask");
  if (!reduced && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("vis"); });
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1700, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = dec ? (target * eased).toFixed(dec) : Math.round(target * eased).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (!reduced && "IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) {
        var d = el.getAttribute("data-decimals");
        el.textContent = d ? parseFloat(el.getAttribute("data-count")).toFixed(parseInt(d, 10)) : parseInt(el.getAttribute("data-count"), 10).toLocaleString("en-IN");
      });
    }
  }

  /* ---------- Parallax ---------- */
  var plx = document.querySelectorAll("[data-plx]");
  if (plx.length && !reduced) {
    var ticking = false;
    var updatePlx = function () {
      var vh = window.innerHeight;
      plx.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var f = parseFloat(el.getAttribute("data-plx")) || 0.08;
        var off = (r.top + r.height / 2 - vh / 2) * -f;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updatePlx); }
    }, { passive: true });
    updatePlx();
  }

  /* ---------- Cursor-following preview on cargo index ---------- */
  var prev = document.querySelector(".preview");
  var rows = document.querySelectorAll(".idx-row[data-img]");
  if (prev && rows.length && !reduced && window.matchMedia("(hover: hover)").matches) {
    var img = prev.querySelector("img");
    var px = 0, py = 0, cx = 0, cy = 0, raf = null;
    var loop = function () {
      cx += (px - cx) * 0.14; cy += (py - cy) * 0.14;
      prev.style.left = cx + "px"; prev.style.top = cy + "px";
      raf = requestAnimationFrame(loop);
    };
    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        img.src = row.getAttribute("data-img");
        prev.classList.add("on");
        if (!raf) loop();
      });
      row.addEventListener("mouseleave", function () {
        prev.classList.remove("on");
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    });
    window.addEventListener("mousemove", function (e) { px = e.clientX + 40; py = e.clientY; }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".mag").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = "translate(" + (dx * 8).toFixed(1) + "px," + (dy * 6).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Scroll progress ---------- */
  var prog = document.querySelector(".scroll-progress");
  if (prog) {
    var updateProg = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.setProperty("--p", (max > 0 ? (h.scrollTop / max) * 100 : 0).toFixed(2) + "%");
    };
    window.addEventListener("scroll", updateProg, { passive: true });
    window.addEventListener("resize", updateProg);
    updateProg();
  }

  /* ---------- SMIL cleanup for reduced motion ---------- */
  if (reduced) {
    document.querySelectorAll("animateMotion, mpath").forEach(function (el) { el.remove(); });
  }

  /* ---------- Enquiry form ---------- */
  var form = document.querySelector("#enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").toString().trim();
      var email = (d.get("email") || "").toString().trim();
      var message = (d.get("message") || "").toString().trim();
      if (!name || !email || !message) { showToast("Please complete name, email and message."); return; }
      var subject = "Enquiry from " + name + ((d.get("company") || "") ? " (" + d.get("company") + ")" : "");
      var body = "Name: " + name + "\nCompany: " + (d.get("company") || "") + "\nEmail: " + email +
        "\nPhone: " + (d.get("phone") || "") + "\nCargo: " + (d.get("cargo") || "") + "\n\n" + message + "\n";
      window.location.href = "mailto:info@mrshahgroup.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showToast("Opening your mail app — thank you.");
      form.reset();
    });
  }
  var toastEl = null, toastTimer = null;
  function showToast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 4200);
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
