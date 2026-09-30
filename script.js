"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");
  const mobileLinks = document.querySelectorAll("#mobileMenu a");
  const loginTrigger = document.getElementById("loginTrigger");
  const loginModal = document.getElementById("loginModal");
  const loginDialog = loginModal?.querySelector(".login-dialog");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginMessage = document.getElementById("loginMessage");
  const loginCloseButtons = document.querySelectorAll("[data-login-close]");
  let lastFocusedElement = null;
  let loginSuccessTimer = null;
  let lockedScrollY = 0;

  const hamburgerIcon = `
    <path d="M4 6h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 18h16"></path>
  `;
  const closeIcon = `
    <path d="M6 6l12 12"></path>
    <path d="M18 6L6 18"></path>
  `;

  // Keep the menu state and its accessible name in one place.
  const setMenuState = (isOpen) => {
    if (!menuButton || !mobileMenu) return;

    mobileMenu.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (menuIcon) {
      menuIcon.innerHTML = isOpen ? closeIcon : hamburgerIcon;
    }
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setMenuState(false);
  });

  const setLoginMessage = (message, isSuccess = false) => {
    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.classList.toggle("is-success", isSuccess);
  };

  const setLoginState = (isOpen) => {
    if (!loginModal || !loginTrigger) return;

    loginModal.classList.toggle("is-open", isOpen);
    loginModal.setAttribute("aria-hidden", String(!isOpen));
    loginTrigger.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      lockedScrollY = window.scrollY;
      document.documentElement.classList.add("modal-open");
      lastFocusedElement = document.activeElement;
      setLoginMessage("");
      window.setTimeout(() => loginEmail?.focus(), 0);
    } else {
      window.clearTimeout(loginSuccessTimer);
      loginForm?.reset();
      setLoginMessage("");
      document.documentElement.classList.remove("modal-open");
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: "instant" });
      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }
  };

  loginTrigger?.addEventListener("click", () => setLoginState(true));
  loginCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setLoginState(false));
  });

  // Demo only: real authentication belongs on a backend, and passwords must never
  // be stored directly in frontend JavaScript.
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = loginEmail?.value.trim() || "";
    const password = loginPassword?.value || "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setLoginMessage("Please enter a valid email address.");
      loginEmail?.focus();
      return;
    }

    if (!password) {
      setLoginMessage("Please enter your password.");
      loginPassword?.focus();
      return;
    }

    if (email !== "demo@example.com" || password !== "123456") {
      setLoginMessage("Invalid email or password.");
      return;
    }

    setLoginMessage("Login successful! Welcome back.", true);
    loginTrigger.textContent = "Logged in";
    loginTrigger.setAttribute("aria-label", "Logged in");
    loginSuccessTimer = window.setTimeout(() => setLoginState(false), 1400);
  });

  document.addEventListener("keydown", (event) => {
    if (!loginModal?.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      setLoginState(false);
      return;
    }

    if (event.key !== "Tab" || !loginDialog) return;

    const focusableElements = loginDialog.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled])"
    );
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  document.documentElement.classList.add("motion-ready");

  const navigation = document.querySelector(".site-nav");
  const navigationEntries = navigation
    ? Array.from(
        navigation.querySelectorAll(
          ".brand-link, .desktop-nav .nav-link, .nav-actions > *"
        )
      )
    : [];
  navigation?.classList.add("nav-entry");
  navigationEntries.forEach((entry, index) => {
    entry.classList.add("nav-item-entry");
    entry.style.setProperty("--entry-index", String(index));
  });

  const heroEntries = [
    document.querySelector(".social-proof"),
    document.querySelector(".hero-title"),
    document.querySelector(".hero-description"),
    document.querySelector(".hero-actions"),
    document.querySelector(".metrics-grid"),
  ].filter(Boolean);
  const heroVisual = document.querySelector(".hero-glow");
  heroEntries.forEach((entry) => entry.classList.add("hero-entry"));
  heroVisual?.classList.add("hero-visual");
  document
    .querySelectorAll(".bottom-glow, .blue-light, .orange-light")
    .forEach((element) => element.classList.add("ambient-motion"));

  const revealGroups = [
    {
      selector:
        ".ai-features-intro, .story-intro, .story-bottom, .pricing-heading, .pricing-toggle, .faq-heading, .cta-content, .site-footer",
      stagger: false,
    },
    {
      selector: ".ai-feature-card, .story-stat, .pricing-card, .faq-item",
      stagger: true,
    },
  ];
  const revealElements = new Set();

  revealGroups.forEach(({ selector, stagger }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (revealElements.has(element)) return;

      element.classList.add("reveal");
      if (stagger) {
        element.classList.add("reveal-stagger");
        element.style.setProperty("--reveal-index", String(index));
      }
      revealElements.add(element);
    });
  });

  const counterRecords = new WeakMap();
  const prepareCounter = (element) => {
    const originalText = element.textContent.trim();
    const match = originalText.match(/^([\d,]+)(K)?(\+?)$/i);
    if (!match) return;

    counterRecords.set(element, {
      originalText,
      target: Number(match[1].replace(/,/g, "")),
      suffix: `${match[2] || ""}${match[3] || ""}`,
    });
    element.textContent = `0${match[2] || ""}${match[3] || ""}`;
  };

  const startCounter = (element) => {
    const record = counterRecords.get(element);
    if (!record) return;

    counterRecords.delete(element);
    const startedAt = performance.now();
    const duration = 1050;

    const updateCounter = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(record.target * easedProgress);
      element.textContent = `${value.toLocaleString()}${record.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = record.originalText;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const storyStatNumbers = document.querySelectorAll(".story-stat-number");
  if (!reducedMotion && "IntersectionObserver" in window) {
    storyStatNumbers.forEach(prepareCounter);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          if (entry.target.matches(".story-stat")) {
            const number = entry.target.querySelector(".story-stat-number");
            if (number) startCounter(number);
          }
          entry.target
            .querySelectorAll(".story-stat-number")
            .forEach(startCounter);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  requestAnimationFrame(() => {
    navigation?.classList.add("is-visible");
    navigationEntries.forEach((entry) => entry.classList.add("is-visible"));

    heroEntries.forEach((entry, index) => {
      entry.style.transitionDelay = `${260 + index * 125}ms`;
      entry.classList.add("is-visible");
      if (entry.matches(".metrics-grid")) {
        entry.querySelectorAll(".metric-value").forEach((metric) => {
          if (!reducedMotion) prepareCounter(metric);
          startCounter(metric);
        });
      }
    });

    if (heroVisual) {
      heroVisual.style.transitionDelay = `${900 + heroEntries.length * 70}ms`;
      heroVisual.classList.add("is-visible");
    }
  });
});