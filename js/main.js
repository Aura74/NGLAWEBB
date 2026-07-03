/* ==========================================================================
   LA-Studio — main.js (moderniserad 2026-07)
   Ersätter gamla app.js (minifierad WOW.js + meny-kod).
   Vanilla JS: nav, mobilmeny, scroll-reveals (IntersectionObserver),
   tema-toggle, effektväljare (Essential/Balanced/Cinematic), FPS-test.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var PERF = root.getAttribute("data-perf") || "cinematic";
  var PERF_KEY = "ngla:perfMode";
  var lenis = null;

  /* ===== Toast ===== */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message, actionLabel, onAction, duration) {
    if (!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.innerHTML = "";
    toastEl.appendChild(document.createTextNode(message));
    if (actionLabel && onAction) {
      var btn = document.createElement("button");
      btn.className = "toast-action";
      btn.type = "button";
      btn.textContent = actionLabel;
      btn.addEventListener("click", onAction);
      toastEl.appendChild(btn);
    }
    toastEl.hidden = false;
    requestAnimationFrame(function () {
      toastEl.classList.add("is-visible");
    });
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
      setTimeout(function () {
        toastEl.hidden = true;
      }, 300);
    }, duration || 5000);
  }

  /* ===== Årtal i footer ===== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Nav: transparent överst, solid + kompakt efter scroll ===== */
  var nav = document.getElementById("mainNav");

  function updateNav() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("is-transparent", y <= 10);
    nav.classList.toggle("is-scrolled", y > 10);
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ===== Scroll-spy: markera aktiv länk ===== */
  var sectionIds = ["intro", "getStarted", "transfer", "portfolio", "demo", "pricing", "about"];
  var navAnchors = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ===== Mobilmeny (slide-in med X-stängning) ===== */
  var menuOpen = document.getElementById("menuOpen");
  var menuClose = document.getElementById("menuClose");
  var panel = document.getElementById("mobilePanel");
  var overlay = document.getElementById("mobileOverlay");

  function openMenu() {
    panel.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add("is-open");
      overlay.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
    menuOpen.setAttribute("aria-expanded", "true");
    menuClose.focus();
  }

  function closeMenu() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    menuOpen.setAttribute("aria-expanded", "false");
    setTimeout(function () {
      panel.hidden = true;
      overlay.hidden = true;
    }, 350);
    menuOpen.focus();
  }

  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("is-open")) closeMenu();
  });
  panel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ===== Mjuk scroll för knappar/länkar med data-scroll ===== */
  function smoothScrollTo(target) {
    var el = document.querySelector(target);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -60 });
    } else {
      el.scrollIntoView({ behavior: PERF === "essential" ? "auto" : "smooth" });
    }
  }

  document.querySelectorAll("[data-scroll]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      smoothScrollTo(el.getAttribute("data-scroll"));
    });
  });

  // Ankarlänkar går via samma väg — annars slåss native hopp med Lenis
  document.querySelectorAll('a[href^="#"]:not([data-scroll])').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (hash.length < 2) return;
      e.preventDefault();
      smoothScrollTo(hash);
    });
  });

  /* ===== Team-kort: tapp togglar overlay på touch ===== */
  var touchOnly = window.matchMedia("(hover: none)").matches;
  document.querySelectorAll(".team-item").forEach(function (item) {
    item.addEventListener("click", function (e) {
      if (!touchOnly) return;
      // Låt "Learn more" fungera när kortet redan är öppet
      if (e.target.closest("a") && item.classList.contains("js-active")) return;
      e.preventDefault();
      document.querySelectorAll(".team-item.js-active").forEach(function (other) {
        if (other !== item) other.classList.remove("js-active");
      });
      item.classList.toggle("js-active");
    });
  });

  /* ===== Scroll-reveals (ersätter WOW.js) ===== */
  if (PERF !== "essential" && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  /* ===== Herovideo: pausa när den inte syns ===== */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && PERF !== "essential") {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              heroVideo.play().catch(function () {});
            } else {
              heroVideo.pause();
            }
          });
        },
        { threshold: 0.1 }
      ).observe(heroVideo);
    }
  }

  /* ===== Tema-toggle (localStorage: theme) ===== */
  var themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", function () {
    var isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });

  /* ===== Effektväljare ===== */
  var perfBtn = document.getElementById("perfBtn");
  var perfPopover = document.getElementById("perfPopover");

  function markActivePerf() {
    perfPopover.querySelectorAll(".perf-option").forEach(function (opt) {
      opt.classList.toggle("is-active", opt.getAttribute("data-perf-set") === PERF);
    });
  }

  function togglePopover(force) {
    var open = typeof force === "boolean" ? force : perfPopover.hidden;
    perfPopover.hidden = !open;
    perfBtn.setAttribute("aria-expanded", String(open));
    if (open) markActivePerf();
  }

  perfBtn.addEventListener("click", function () {
    togglePopover();
  });

  document.addEventListener("click", function (e) {
    if (!perfPopover.hidden && !e.target.closest(".perf-widget")) togglePopover(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !perfPopover.hidden) togglePopover(false);
  });

  function setPerfMode(mode) {
    localStorage.setItem(PERF_KEY, mode);
    // Ladda om för ren ominitiering (Lenis, video, reveals)
    location.reload();
  }

  perfPopover.querySelectorAll("[data-perf-set]").forEach(function (opt) {
    opt.addEventListener("click", function () {
      setPerfMode(opt.getAttribute("data-perf-set"));
    });
  });

  /* ===== Lenis (endast Cinematic) ===== */
  function initLenis() {
    if (PERF !== "cinematic" || typeof Lenis === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  if (document.readyState === "complete") {
    initLenis();
  } else {
    window.addEventListener("load", initLenis);
  }

  /* ===== FPS-test: föreslå Balanced om auto-valt Cinematic hackar ===== */
  var isAuto = root.hasAttribute("data-perf-auto");
  if (isAuto && PERF === "cinematic") {
    window.addEventListener("load", function () {
      setTimeout(function () {
        var frames = 0;
        var slow = 0;
        var last = performance.now();
        var start = last;

        function probe(now) {
          frames++;
          if (now - last > 22) slow++; // >22 ms ≈ under ~45 fps
          last = now;
          if (now - start < 2000) {
            requestAnimationFrame(probe);
          } else {
            var avgFps = frames / ((now - start) / 1000);
            var stutter = slow / frames;
            if (avgFps < 45 || stutter > 0.25) {
              showToast(
                "Sidan verkar hacka på din dator.",
                "Byt till Balanced",
                function () {
                  setPerfMode("balanced");
                },
                9000
              );
            }
          }
        }
        requestAnimationFrame(probe);
      }, 1500);
    });
  }
})();
