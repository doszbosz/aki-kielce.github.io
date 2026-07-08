document.documentElement.classList.add("js-enabled");

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");

const closeMobileNav = () => {
  if (!toggle || !nav) return;
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "Menu";
};

if (toggle && nav) {
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Zamknij" : "Menu";
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 860px)").matches) {
      closeMobileNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!window.matchMedia("(max-width: 860px)").matches) return;
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest(".site-header")) return;
    closeMobileNav();
  });
}

if (nav) {
  const links = [...nav.querySelectorAll("a")];
  const activeLink = nav.querySelector("a[aria-current='page']") || links[0];
  const indicator = document.createElement("span");
  indicator.className = "nav-indicator";
  nav.appendChild(indicator);
  nav.classList.add("has-indicator");

  const setTarget = (link) => {
    links.forEach((item) => item.classList.toggle("is-nav-target", item === link));
  };

  const moveIndicator = (link) => {
    if (!link || window.matchMedia("(max-width: 860px)").matches) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    indicator.style.width = `${linkBox.width}px`;
    indicator.style.transform = `translateX(${linkBox.left - navBox.left}px)`;
    setTarget(link);
  };

  requestAnimationFrame(() => moveIndicator(activeLink));
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => moveIndicator(link));
    link.addEventListener("focus", () => moveIndicator(link));
  });
  nav.addEventListener("mouseleave", () => moveIndicator(activeLink));
  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 860px)").matches) {
      indicator.style.width = "0";
      setTarget(activeLink);
    } else {
      closeMobileNav();
      moveIndicator(activeLink);
    }
  });
}

const revealTargets = document.querySelectorAll(
  ".hero-content, .hero-card, .page-hero, .section, .menu-card, .menu-section, .gallery-item, .contact-card, .quote-card"
);

const showRevealTargets = () => {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
    target.style.transitionDelay = "";
  });
};

if ("IntersectionObserver" in window && revealTargets.length) {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.transitionDelay = `${Math.min((index % 4) * 0.015, 0.045)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.04 }
  );

  revealTargets.forEach((target) => observer.observe(target));
  window.addEventListener("pageshow", showRevealTargets, { once: true });
  window.setTimeout(showRevealTargets, 900);
} else {
  showRevealTargets();
}