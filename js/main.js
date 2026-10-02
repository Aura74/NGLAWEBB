/* ==========================================================================
   LA-Studio — main.js
   Vanilla JS: nav, mobilmeny, scroll-reveals, tema, effektväljare
   (Essential/Balanced/Cinematic), preloader, split-text-hero, magnetiska
   CTA, arbetsgalleri med lightbox, statistikräknare, omdömes-karusell
   (Swiper), kontaktformulär (demo), AI-chatt med lokal fallback.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var PERF = root.getAttribute("data-perf") || "cinematic";
  var PERF_KEY = "ngla:perfMode";
  var lenis = null;
  var fmtReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lås sidans scroll bakom meny/lightbox. Måste ligga på <html> — html har
     overflow-x: hidden, och då förs body:s overflow inte vidare till fönstret. */
  function lockScroll(lock) {
    root.classList.toggle("is-locked", lock);
    if (lenis) {
      if (lock) lenis.stop();
      else lenis.start();
    }
  }

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

  /* ===== Preloader ===== */
  var preloader = document.getElementById("preloader");

  function hidePreloader() {
    if (preloader) preloader.classList.add("is-done");
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 2500); // säkerhetsnät om load dröjer
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

  /* ===== Scroll-spy ===== */
  var sectionIds = ["intro", "getStarted", "transfer", "demo", "testimonials", "pricing", "about"];
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

  /* ===== Mobilmeny ===== */
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
    lockScroll(true);
    menuOpen.setAttribute("aria-expanded", "true");
    menuClose.focus();
  }

  function closeMenu() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    lockScroll(false);
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

  /* ===== Mjuk scroll ===== */
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
      if (e.target.closest("a") && item.classList.contains("js-active")) return;
      e.preventDefault();
      document.querySelectorAll(".team-item.js-active").forEach(function (other) {
        if (other !== item) other.classList.remove("js-active");
      });
      item.classList.toggle("js-active");
    });
  });

  /* ===== Scroll-reveals ===== */
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

  /* ===== Split-text i hero (tecken för tecken, som Cullen) ===== */
  var heroTitle = document.getElementById("heroTitle");
  if (heroTitle && PERF !== "essential" && !fmtReduced) {
    var text = heroTitle.textContent;
    heroTitle.textContent = "";
    Array.prototype.forEach.call(text, function (ch, i) {
      var span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--ci", i);
      span.textContent = ch;
      heroTitle.appendChild(span);
    });
    heroTitle.classList.add("is-split");
  }

  /* ===== Herovideo: pausa när den inte syns ===== */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && PERF !== "essential" && heroVideo.getAttribute("data-src")) {
    heroVideo.src = heroVideo.getAttribute("data-src");
  }
  if (heroVideo && PERF !== "essential" && "IntersectionObserver" in window) {
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

  /* ===== Magnetiska CTA-knappar (endast Cinematic, mus) ===== */
  if (
    PERF === "cinematic" &&
    !fmtReduced &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      var raf = null;

      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          btn.style.transition = "none";
          btn.style.transform =
            "translate(" + x * 0.18 + "px," + y * 0.32 + "px)";
        });
      });

      btn.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transition = "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)";
        btn.style.transform = "";
      });
    });
  }

  /* ===== Skapade hemsidor: lightbox med hela skärmdumpen ===== */
  var workItems = Array.prototype.slice.call(document.querySelectorAll(".work-item"));
  var lightbox = document.getElementById("lightbox");
  if (lightbox && workItems.length) {
    var lbImg = document.getElementById("lightboxImg");
    var lbTitle = document.getElementById("lightboxTitle");
    var lbMeta = document.getElementById("lightboxMeta");
    var lbVisit = document.getElementById("lightboxVisit");
    var lbWrap = lightbox.querySelector(".lightbox-img-wrap");
    var lbCloseBtn = document.getElementById("lightboxClose");
    var lbIndex = 0;
    var lbOpener = null;

    function lbRender() {
      var item = workItems[lbIndex];
      var img = item.querySelector(".work-view img");
      var url = item.getAttribute("data-url");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbTitle.textContent = item.getAttribute("data-title");
      lbMeta.textContent = item.getAttribute("data-tech") || "";
      if (url) {
        lbVisit.href = url;
        lbVisit.classList.remove("is-hidden");
      } else {
        lbVisit.classList.add("is-hidden");
      }
      lbWrap.scrollTop = 0;
    }

    function lbOpen(index, opener) {
      lbIndex = index;
      lbOpener = opener;
      lbRender();
      lightbox.hidden = false;
      lockScroll(true);
      lbCloseBtn.focus();
    }

    function lbClose() {
      lightbox.hidden = true;
      lockScroll(false);
      if (lbOpener) lbOpener.focus({ preventScroll: true });
    }

    function lbStep(dir) {
      lbIndex = (lbIndex + dir + workItems.length) % workItems.length;
      lbRender();
    }

    workItems.forEach(function (item, i) {
      item.querySelectorAll("[data-work-open]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          lbOpen(i, btn);
        });
      });
    });

    lbCloseBtn.addEventListener("click", lbClose);
    document.getElementById("lightboxBackdrop").addEventListener("click", lbClose);
    document.getElementById("lightboxPrev").addEventListener("click", function () {
      lbStep(-1);
    });
    document.getElementById("lightboxNext").addEventListener("click", function () {
      lbStep(1);
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") lbClose();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
  }

  /* ===== Offertkalkylator ===== */
  var calc = document.getElementById("kalkyl");
  if (calc) {
    var calcList = document.getElementById("calcList");
    var calcTotal = document.getElementById("calcTotal");
    var calcSend = document.getElementById("calcSend");

    var fmtKr = function (n) {
      return n.toLocaleString("sv-SE") + " kr";
    };

    var updateCalc = function () {
      var items = [];
      var total = 0;
      var paket = calc.querySelector('input[name="calcPaket"]:checked');
      total += Number(paket.value);
      items.push(["Paket " + paket.getAttribute("data-label"), Number(paket.value)]);
      calc.querySelectorAll('input[name="calcTillval"]:checked').forEach(function (c) {
        total += Number(c.value);
        items.push([c.getAttribute("data-label"), Number(c.value)]);
      });

      calcList.innerHTML = "";
      items.forEach(function (it) {
        var li = document.createElement("li");
        var name = document.createElement("span");
        name.textContent = it[0];
        var price = document.createElement("span");
        price.textContent = fmtKr(it[1]);
        li.appendChild(name);
        li.appendChild(price);
        calcList.appendChild(li);
      });
      calcTotal.textContent = fmtKr(total);

      var body =
        "Hej Lars!\n\nJag vill gärna ha en offert på följande:\n" +
        items
          .map(function (it) {
            return "• " + it[0] + " (" + fmtKr(it[1]) + ")";
          })
          .join("\n") +
        "\n\nRiktpris enligt kalkylatorn: " +
        fmtKr(total) +
        "\n\nMitt namn:\nTelefon:\nBerätta gärna kort om projektet:\n";
      calcSend.href =
        "mailto:lars@lastudio.se?subject=" +
        encodeURIComponent("Offertförfrågan — LA Studio") +
        "&body=" +
        encodeURIComponent(body);
    };

    calc.addEventListener("change", updateCalc);
    updateCalc();
  }

  /* ===== FAQ-accordion (en öppen åt gången) ===== */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-a").style.maxHeight = "";
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (open) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ===== Scroll-progress (endast Cinematic) ===== */
  var progressBar = document.getElementById("scrollProgress");
  if (progressBar && PERF === "cinematic") {
    window.addEventListener(
      "scroll",
      function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      },
      { passive: true }
    );
  }

  /* ===== Statistikräknare ===== */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (PERF === "essential" || fmtReduced) {
      el.textContent = target;
      return;
    }
    var start = null;
    var dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsBand = document.querySelector(".stats-band");
  if (statsBand) {
    if (PERF === "essential" || !("IntersectionObserver" in window)) {
      statsBand.querySelectorAll("[data-count]").forEach(animateCount);
    } else {
      var statsIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              statsBand.querySelectorAll("[data-count]").forEach(animateCount);
              statsIO.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      statsIO.observe(statsBand);
    }
  }

  /* ===== Omdömes-karusell (Swiper) ===== */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    new Swiper(".testi-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      autoplay:
        PERF === "cinematic" && !fmtReduced
          ? { delay: 5000, disableOnInteraction: true }
          : false,
      pagination: {
        el: ".testi-swiper .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  /* ===== Kontaktformulär (demo — koppla Formspree/Web3Forms för skarpt läge) ===== */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      contactForm.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.value.trim().length > 0;
        if (field.type === "email") {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        field.classList.toggle("is-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        showToast("Fyll i alla fält med en giltig e-postadress.");
        return;
      }
      var name = contactForm.querySelector('[name="name"]').value.trim().split(" ")[0];
      contactForm.reset();
      showToast("Tack " + name + "! Jag återkommer inom 24 timmar.", null, null, 6000);
    });
  }

  /* ===== Bokningsknapp (stub — Cal.com/Calendly i skarpt läge) ===== */
  var bookingBtn = document.getElementById("bookingBtn");
  if (bookingBtn) {
    bookingBtn.addEventListener("click", function () {
      showToast("Demo — här öppnas bokningskalendern (Cal.com eller Calendly) i skarpt läge.");
    });
  }

  /* ===== Tema-toggle ===== */
  document.getElementById("themeToggle").addEventListener("click", function () {
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
    sessionStorage.setItem("ngla:skipPreloader", "1");
    location.reload(); // ren ominitiering av Lenis/video/reveals
  }

  perfPopover.querySelectorAll("[data-perf-set]").forEach(function (opt) {
    opt.addEventListener("click", function () {
      setPerfMode(opt.getAttribute("data-perf-set"));
    });
  });

  /* ===== Lenis (endast Cinematic) ===== */
  function initLenis() {
    if (PERF !== "cinematic" || typeof Lenis === "undefined" || fmtReduced) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function onLoad() {
    initLenis();
    initSwiper();
  }

  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }

  /* ===== FPS-test: föreslå Balanced om auto-valt Cinematic hackar ===== */
  if (root.hasAttribute("data-perf-auto") && PERF === "cinematic") {
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
            if (avgFps < 45 || slow / frames > 0.25) {
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

  /* ========================================================================
     AI-chatt — LA Assistent
     Lokal kunskapsbank som standard. Vill du koppla Gemini: lägg nyckeln i en
     gitignorerad js/apikey.js som sätter window.GEMINI_API_KEY och ladda den
     före main.js (mönstret från LALilaTech). Hårdkoda aldrig nyckeln här.
     ======================================================================== */
  var GEMINI_API_KEY = window.GEMINI_API_KEY || ""; // tom = endast lokal fallback
  // flash-lite först: gemini-flash-latest kan hänga helt utan svar
  var GEMINI_MODELS = ["gemini-flash-lite-latest", "gemini-flash-latest"];
  var GEMINI_TIMEOUT = 12000;
  var SYSTEM_PROMPT =
    "Du är LA Assistent på webbyrån LA Studio (Lars Asplund). Svara kort och vänligt på svenska " +
    "om hemsidor, priser (Start från 4 900 kr, Företag från 12 900 kr, Premium från 24 900 kr — engångspris), " +
    "tidsplaner och AI-utbildning. Hänvisa till kontaktformuläret för offert.";

  var chatFab = document.getElementById("chatFab");
  var chatWidget = document.getElementById("chatWidget");
  var chatClose = document.getElementById("chatClose");
  var chatBox = document.getElementById("chatBox");
  var chatMessages = document.getElementById("chatMessages");
  var chatTyping = document.getElementById("chatTyping");
  var chatInput = document.getElementById("chatInput");
  var chatSend = document.getElementById("chatSend");
  var chatSuggestions = document.getElementById("chatSuggestions");

  var chatBusy = false;
  var chatOpened = false;
  var geminiHistory = [];

  // Hälsningar ligger sist så att "hej, vad kostar…" ger prissvaret
  var localBrain = [
    {
      triggers: ["pris", "kostar", "kostnad", "billig", "offert", "paket"],
      response:
        "Våra paket är **engångspriser**: Start från 4 900 kr, Företag från 12 900 kr och Premium från 24 900 kr. Exakt offert får du efter ett kostnadsfritt första möte — använd formuläret under **Kontakt**.",
    },
    {
      triggers: ["tid", "lang", "lång", "vecka", "snabbt", "leverans", "klar"],
      response:
        "En enkel onepager är oftast klar på **1–2 veckor**, en flersidig företagssajt på **3–5 veckor**. Vi sätter en tydlig tidsplan innan vi börjar.",
    },
    {
      triggers: ["boka", "mote", "möte", "träffas", "ring", "kontakt"],
      response:
        "Vad kul! Enklast är att fylla i **kontaktformuläret** längst ner på sidan eller mejla lars@lastudio.se — så bokar vi ett kostnadsfritt första möte.",
    },
    {
      triggers: ["ai", "utbildning", "kurs", "chatgpt", "artificiell"],
      response:
        "Vi håller en **endagsutbildning i AI** för företag — praktiska verktyg och arbetsflöden ditt team kan använda direkt. Hör av dig via formuläret så berättar jag mer.",
    },
    {
      triggers: ["responsiv", "mobil", "teknik", "wordpress", "seo", "domän", "doman"],
      response:
        "Alla sajter byggs **responsiva** och snabba, med SEO-grund, egen domän och SSL. Jag hjälper även till med webbhotell och e-postadresser.",
    },
    {
      triggers: ["hej", "halla", "tjena", "hello", "hallå", "god morgon", "hejsan"],
      response: "Hej! Jag är LA Assistent. Fråga mig om priser, tidsplaner eller vad LA Studio kan göra för dig.",
    },
    {
      triggers: ["tack", "tackar", "toppen", "perfekt"],
      response: "Varsågod! Hör av dig om du undrar något mer. 😊",
    },
  ];

  var localFallback =
    "Bra fråga! Den svarar jag bäst på personligen — skriv i **kontaktformuläret** längst ner så återkommer jag inom 24 timmar.";

  function chatFormat(text) {
    var safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }

  // Matchar början av ord — annars träffar "ring" i "kring" och "ai" i "mail"
  function localResponse(input) {
    var n = input.toLowerCase().replace(/[?!.,]/g, "");
    var words = n.split(/\s+/);
    function hit(trigger) {
      if (trigger.indexOf(" ") !== -1) return n.indexOf(trigger) !== -1;
      return words.some(function (w) {
        return w.indexOf(trigger) === 0;
      });
    }
    for (var i = 0; i < localBrain.length; i++) {
      if (localBrain[i].triggers.some(hit)) return localBrain[i].response;
    }
    return localFallback;
  }

  function askGeminiModel(model) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () {
      ctrl.abort();
    }, GEMINI_TIMEOUT);
    return fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: geminiHistory,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
        }),
      }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var cand = data.candidates && data.candidates[0];
        var parts = (cand && cand.content && cand.content.parts) || [];
        var text = parts
          .map(function (p) {
            return p.text || "";
          })
          .join("")
          .trim();
        if (!text) throw new Error("Tomt svar");
        return text;
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  function callGemini(message) {
    geminiHistory.push({ role: "user", parts: [{ text: message }] });
    var attempt = Promise.reject();
    GEMINI_MODELS.forEach(function (model) {
      attempt = attempt.catch(function () {
        return askGeminiModel(model);
      });
    });
    return attempt.then(
      function (text) {
        geminiHistory.push({ role: "model", parts: [{ text: text }] });
        if (geminiHistory.length > 30) geminiHistory = geminiHistory.slice(-30);
        return text;
      },
      function (err) {
        geminiHistory.pop(); // inget svar — ta bort frågan ur historiken
        throw err;
      }
    );
  }

  function addChatMsg(text, sender) {
    var el = document.createElement("div");
    el.className = "chat-msg " + sender;
    if (sender === "bot") {
      el.innerHTML = chatFormat(text);
    } else {
      el.textContent = text;
    }
    chatMessages.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
    return el;
  }

  function typewriter(el, text) {
    return new Promise(function (resolve) {
      if (PERF === "essential" || fmtReduced) {
        el.innerHTML = chatFormat(text);
        chatBox.scrollTop = chatBox.scrollHeight;
        resolve();
        return;
      }
      var plain = text.replace(/\*\*/g, "");
      var i = 0;
      var speed = Math.max(8, Math.min(22, 1100 / plain.length));
      (function type() {
        if (i <= plain.length) {
          el.textContent = plain.slice(0, i);
          chatBox.scrollTop = chatBox.scrollHeight;
          i += 1;
          setTimeout(type, speed);
        } else {
          el.innerHTML = chatFormat(text);
          resolve();
        }
      })();
    });
  }

  function chatRespond(message) {
    if (chatBusy) return;
    chatBusy = true;
    addChatMsg(message, "user");
    chatInput.value = "";
    chatSend.disabled = true;
    chatTyping.hidden = false;
    chatBox.scrollTop = chatBox.scrollHeight;

    var getAnswer = GEMINI_API_KEY
      ? callGemini(message).catch(function () {
          return localResponse(message);
        })
      : new Promise(function (r) {
          setTimeout(function () {
            r(localResponse(message));
          }, 500 + Math.random() * 500);
        });

    getAnswer.then(function (answer) {
      chatTyping.hidden = true;
      var bubble = addChatMsg("", "bot");
      typewriter(bubble, answer).then(function () {
        chatBusy = false;
      });
    });
  }

  function openChat() {
    chatWidget.hidden = false;
    chatFab.hidden = true;
    if (!chatOpened) {
      chatOpened = true;
      var welcome = document.createElement("div");
      welcome.className = "chat-welcome";
      welcome.innerHTML =
        '<div class="chat-welcome-title">LA Assistent</div>' +
        "<p>Hej! Fråga mig om priser, tidsplaner eller AI-utbildning — eller välj en fråga nedan.</p>";
      chatMessages.appendChild(welcome);
    }
    setTimeout(function () {
      chatInput.focus();
    }, 250);
  }

  function closeChat() {
    chatWidget.hidden = true;
    chatFab.hidden = false;
  }

  if (chatFab) {
    chatFab.addEventListener("click", openChat);
    chatClose.addEventListener("click", closeChat);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !chatWidget.hidden) closeChat();
    });

    chatInput.addEventListener("input", function () {
      chatSend.disabled = chatInput.value.trim().length === 0;
    });

    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && chatInput.value.trim()) {
        e.preventDefault();
        chatRespond(chatInput.value.trim());
      }
    });

    chatSend.addEventListener("click", function () {
      if (chatInput.value.trim()) chatRespond(chatInput.value.trim());
    });

    chatSuggestions.querySelectorAll(".chat-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        chatRespond(chip.getAttribute("data-msg"));
      });
    });
  }
})();
