/* Colombia OpenInfra User Group — js/app.js
 * No-build React (React.createElement, no JSX). Mirrors beanters.com architecture.
 * Content driven by window.SITE (data.js). Bilingual ES/EN, dark/light theme.
 */
const { useState, useEffect, useRef, useCallback, useMemo } = React;
const S = window.SITE;

/* ── i18n ─────────────────────────────────────────────────────────────── */
const STRINGS = {
  nav: {
    join:     { es: "Únete",          en: "Join" },
    events:   { es: "Eventos",        en: "Events" },
    about:    { es: "Nosotros",       en: "About" },
    speakers: { es: "Ponentes",       en: "Speakers" },
    sponsors: { es: "Patrocinadores", en: "Sponsors" },
    people:   { es: "Comunidad",      en: "Community" },
    agents:   { es: "IA+Agentes",     en: "AI+Agents" }
  },
  hero: {
    eyebrow:  { es: "Comunidad · Bogotá · Colombia", en: "Community · Bogotá · Colombia" },
    headline1:{ es: "Infraestructura abierta",        en: "Open infrastructure" },
    headline2:{ es: "para Colombia",                  en: "for Colombia" },
    sub:      { es: "Más de 375 miembros colaborando en OpenStack, Kubernetes, cloud-native y tecnologías de infraestructura de código abierto.",
                en: "Over 375 members collaborating on OpenStack, Kubernetes, cloud-native and open-source infrastructure technologies." },
    cta1:     { es: "Únete en Meetup",   en: "Join on Meetup" },
    cta2:     { es: "Ver eventos",       en: "See events" }
  },
  stats: {
    members:  { es: "miembros",   en: "members" },
    events:   { es: "eventos",    en: "events" },
    city:     { es: "Bogotá",     en: "Bogotá" },
    since:    { es: "desde 2022", en: "since 2022" }
  },
  about: {
    eyebrow:  { es: "Sobre nosotros", en: "About us" },
    title:    { es: "Somos la comunidad OpenInfra de Colombia", en: "We are the OpenInfra community of Colombia" },
    p1:       { es: "El Colombia OpenInfra User Group es una comunidad abierta y libre para explorar, aprender y colaborar en infraestructura de código abierto. Nos reunimos regularmente en Bogotá para compartir experiencias, escuchar ponencias técnicas y hacer crecer el ecosistema open source en Colombia.",
                en: "The Colombia OpenInfra User Group is an open and free community to explore, learn and collaborate on open-source infrastructure. We meet regularly in Bogotá to share experiences, hear technical talks and grow the open source ecosystem in Colombia." },
    p2:       { es: "Hacemos parte de la red global de grupos de usuarios OpenInfra, impulsados por la OpenInfra Foundation, con presencia en más de 110 países.",
                en: "We are part of the global network of OpenInfra user groups, driven by the OpenInfra Foundation, present in more than 110 countries." },
    topics:   { es: "Temas de la comunidad", en: "Community topics" }
  },
  events: {
    eyebrow:    { es: "Eventos",           en: "Events" },
    title:      { es: "Nuestros encuentros",en: "Our gatherings" },
    upcoming:   { es: "Próximos eventos",  en: "Upcoming events" },
    past:       { es: "Eventos pasados",   en: "Past events" },
    noUpcoming: { es: "No hay eventos próximos anunciados. ¡Síguenos en Meetup para enterarte primero!",
                  en: "No upcoming events announced yet. Follow us on Meetup to be the first to know!" },
    slides:     { es: "Ver presentación",  en: "View slides" },
    attendees:  { es: "asistentes",        en: "attendees" },
    register:   { es: "Regístrate en Meetup", en: "Register on Meetup" }
  },
  speakers: {
    eyebrow:  { es: "Ponentes del 5to Evento", en: "5th Event Speakers" },
    title:    { es: "Quienes compartieron su conocimiento", en: "Those who shared their knowledge" },
    slides:   { es: "Slides",  en: "Slides" }
  },
  join: {
    eyebrow:  { es: "Únete",         en: "Join" },
    title:    { es: "Haz parte de la comunidad", en: "Be part of the community" },
    sub:      { es: "Regístrate en Meetup para recibir notificaciones de eventos y conectarte con más de 375 profesionales de infraestructura abierta en Colombia.",
                en: "Join on Meetup to receive event notifications and connect with over 375 open infrastructure professionals in Colombia." },
    meetup:   { es: "Unirme en Meetup",     en: "Join on Meetup" },
    chat:     { es: "Canal de comunidad",   en: "Community channel" }
  },
  sponsors: {
    eyebrow:  { es: "Patrocinadores", en: "Sponsors" },
    title:    { es: "Con el apoyo de", en: "Supported by" }
  },
  people: {
    eyebrow:    { es: "Directorio",          en: "Directory" },
    title:      { es: "Nuestra comunidad",   en: "Our community" },
    sub:        { es: "Conoce a las personas que construyen el ecosistema OpenInfra en Colombia.", en: "Meet the people building the OpenInfra ecosystem in Colombia." },
    all:        { es: "Todos",               en: "All" },
    organizer:  { es: "Organizadores",       en: "Organizers" },
    speaker:    { es: "Ponentes",            en: "Speakers" },
    volunteer:  { es: "Voluntarios",         en: "Volunteers" },
    sponsor:    { es: "Patrocinadores",      en: "Sponsors" },
    mentor:     { es: "Mentores",            en: "Mentors" },
    empty:      { es: "No hay perfiles en esta categoría.", en: "No profiles in this category." }
  },
  agents: {
    eyebrow:    { es: "IA & Agentes",  en: "AI & Agents" },
    title:      { es: "Los agentes son a la infraestructura abierta lo que la IA es a Linux", en: "Agents are to Open Infrastructure what AI is to Linux" },
    sub:        { es: "OpenInfra no es solo la nube — es la capa de cómputo, orquestación y seguridad sobre la que los agentes de IA deben funcionar. Una capa fundamental nueva, como lo fue Linux para la IA.", en: "OpenInfra is not just the cloud — it's the compute, orchestration, and security layer that AI agents must run on. A fundamental new layer, just as Linux was for AI." },
    stack:      { es: "La pila fundacional para agentes autónomos",  en: "The foundational stack for autonomous agents" },
    cta:        { es: "Únete y construye el futuro",  en: "Join and build the future" },
    cta_sub:    { es: "Contribuye a la infraestructura que ejecutará la próxima generación de agentes de IA en Colombia y el mundo.", en: "Contribute to the infrastructure that will run the next generation of AI agents in Colombia and the world." }
  },
  footer: {
    tagline:  { es: "Construyendo infraestructura abierta en Colombia.", en: "Building open infrastructure in Colombia." },
    rights:   { es: "Todos los derechos reservados.", en: "All rights reserved." },
    privacy:  { es: "Privacidad", en: "Privacy" },
    terms:    { es: "Términos",   en: "Terms" }
  }
};

function t(path, lang) {
  const parts = path.split(".");
  let node = STRINGS;
  for (const p of parts) { node = node?.[p]; }
  if (!node) return path;
  return node[lang] || node.es || path;
}

function bi(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.es || obj.en || "";
}

/* ── Hooks ────────────────────────────────────────────────────────────── */
function useTheme() {
  const getInitial = () => {
    try {
      const s = localStorage.getItem("coiug-theme");
      if (s === "light" || s === "dark") return s;
    } catch (e) {}
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };
  const [theme, setTheme] = useState(getInitial);
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    try { localStorage.setItem("coiug-theme", theme); } catch (e) {}
  }, [theme]);
  return [theme, () => setTheme(t => t === "dark" ? "light" : "dark")];
}

function useLang() {
  const getInitial = () => {
    try {
      const s = localStorage.getItem("coiug-lang");
      if (s === "en" || s === "es") return s;
    } catch (e) {}
    return "es";
  };
  const [lang, setLang] = useState(getInitial);
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem("coiug-lang", lang); } catch (e) {}
  }, [lang]);
  return [lang, l => setLang(l)];
}

function useIntersection(ref, options = { threshold: 0.1 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, options);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ── Icon ─────────────────────────────────────────────────────────────── */
function Icon({ name, size = 20, color = "currentColor", sw = 1.5 }) {
  const paths = {
    menu:      "M3 12h18M3 6h18M3 18h18",
    x:         "M18 6L6 18M6 6l12 12",
    sun:       "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z",
    moon:      "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    youtube:   "M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
    linkedin:  "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
    instagram: "M17.5 2h-11A4.5 4.5 0 002 6.5v11A4.5 4.5 0 006.5 22h11a4.5 4.5 0 004.5-4.5v-11A4.5 4.5 0 0017.5 2zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7zm4.5-9a1 1 0 110-2 1 1 0 010 2z",
    meetup:    "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-11h2v6h-2zm0-3h2v2h-2z",
    github:    "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7C6.64 19.91 6.07 18 6.07 18c-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z",
    download:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
    calendar:  "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
    users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    globe:     "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20",
    k8s:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    layers:    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    cpu:       "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
    network:   "M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM15 6l-6 9M18 9l-3 12",
    external:  "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
    robot:     "M12 2a3 3 0 013 3v1h3a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h3V5a3 3 0 013-3zm-3 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-5 4h4",
    spark:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    branch:    "M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM15 6l-6 9M18 9l-3 12",
    zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
  };
  const d = paths[name] || paths.globe;
  return React.createElement("svg", {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: sw,
    strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": "true", style: { display: "inline-block", flexShrink: 0 }
  }, React.createElement("path", { d }));
}

/* ── Nav ──────────────────────────────────────────────────────────────── */
function Nav({ theme, toggleTheme, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about",    label: t("nav.about", lang) },
    { href: "#events",   label: t("nav.events", lang) },
    { href: "#speakers", label: t("nav.speakers", lang) },
    { href: "#people",   label: t("nav.people", lang) },
    { href: "#agents",   label: t("nav.agents", lang) },
    { href: "#sponsors", label: t("nav.sponsors", lang) }
  ];
  const socials = [
    { icon: "youtube",   href: S.socials.youtube,   label: "YouTube" },
    { icon: "linkedin",  href: S.socials.linkedin,  label: "LinkedIn" },
    { icon: "instagram", href: S.socials.instagram, label: "Instagram" },
    { icon: "meetup",    href: S.socials.meetup,    label: "Meetup" }
  ];
  return React.createElement("nav", {
    role: "navigation", "aria-label": "Primary navigation",
    style: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "color-mix(in oklab, var(--bg) 80%, transparent)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      padding: "0 2rem", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: "64px"
    }
  },
    /* Logo */
    React.createElement("a", {
      href: "#",
      "aria-label": "Colombia OpenInfra User Group — inicio",
      style: { display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }
    },
      React.createElement("span", {
        style: {
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px",
          width: 28, height: 28
        }
      },
        ...["#ED362F","#43B85C","#2CB4E2","#F7B749"].map(c =>
          React.createElement("span", {
            key: c,
            style: { background: c, borderRadius: "3px" }
          })
        )
      ),
      React.createElement("span", {
        style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }
      }, "Colombia OpenInfra")
    ),

    /* Desktop links */
    React.createElement("ul", {
      className: "desktop-only",
      style: { display: "flex", gap: "0.25rem", listStyle: "none", alignItems: "center" }
    },
      ...links.map(l =>
        React.createElement("li", { key: l.href },
          React.createElement("a", {
            href: l.href,
            style: {
              padding: "0.4rem 0.8rem", borderRadius: "6px", textDecoration: "none",
              color: "var(--text-mid)", fontSize: "0.9rem", fontWeight: 500,
              transition: "color 0.2s, background 0.2s"
            },
            onMouseOver: e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "color-mix(in oklab, var(--text) 6%, transparent)"; },
            onMouseOut:  e => { e.currentTarget.style.color = "var(--text-mid)"; e.currentTarget.style.background = "transparent"; }
          }, l.label)
        )
      )
    ),

    /* Right controls */
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" } },
      /* Social icons (desktop) */
      ...socials.map(s =>
        React.createElement("a", {
          key: s.icon, href: s.href, target: "_blank", rel: "noopener noreferrer",
          "aria-label": s.label, className: "desktop-only",
          style: {
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "8px", color: "var(--text-dim)",
            textDecoration: "none", transition: "color 0.2s, background 0.2s"
          },
          onMouseOver: e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "color-mix(in oklab, var(--text) 8%, transparent)"; },
          onMouseOut:  e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }
        }, React.createElement(Icon, { name: s.icon, size: 18 }))
      ),

      /* Lang toggle */
      React.createElement("button", {
        onClick: () => setLang(lang === "es" ? "en" : "es"),
        "aria-label": lang === "es" ? "Switch to English" : "Cambiar a Español",
        style: {
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "0.3rem 0.6rem",
          color: "var(--text-mid)", fontFamily: "var(--font-mono)",
          fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
          transition: "background 0.2s, color 0.2s"
        }
      }, lang === "es" ? "EN" : "ES"),

      /* Theme toggle */
      React.createElement("button", {
        onClick: toggleTheme,
        "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        style: {
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "0.4rem", color: "var(--text-mid)",
          cursor: "pointer", display: "flex", alignItems: "center", transition: "background 0.2s, color 0.2s"
        }
      }, React.createElement(Icon, { name: theme === "dark" ? "sun" : "moon", size: 16 })),

      /* Join CTA */
      React.createElement("a", {
        href: S.registrationUrl, target: "_blank", rel: "noopener noreferrer",
        className: "btn btn-red desktop-only",
        style: { padding: "0.5rem 1.1rem", fontSize: "0.88rem" }
      }, t("nav.join", lang)),

      /* Hamburger */
      React.createElement("button", {
        className: "mobile-only",
        onClick: () => setOpen(o => !o),
        "aria-label": open ? "Close menu" : "Open menu",
        "aria-expanded": open,
        style: {
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "0.4rem", color: "var(--text)",
          cursor: "pointer", display: "flex", alignItems: "center"
        }
      }, React.createElement(Icon, { name: open ? "x" : "menu", size: 20 }))
    ),

    /* Mobile drawer */
    open && React.createElement("div", {
      style: {
        position: "absolute", top: "64px", left: 0, right: 0,
        background: "var(--bg-2)", borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem"
      }
    },
      ...links.map(l =>
        React.createElement("a", {
          key: l.href, href: l.href,
          onClick: () => setOpen(false),
          style: {
            padding: "0.6rem 0.75rem", borderRadius: "8px", textDecoration: "none",
            color: "var(--text)", fontSize: "1rem", fontWeight: 500
          }
        }, l.label)
      ),
      React.createElement("a", {
        href: S.registrationUrl, target: "_blank", rel: "noopener noreferrer",
        style: {
          marginTop: "0.5rem", padding: "0.75rem 1rem", borderRadius: "100px",
          background: "var(--red)", color: "#fff", fontWeight: 600,
          textDecoration: "none", textAlign: "center"
        }
      }, t("nav.join", lang))
    )
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero({ lang }) {
  return React.createElement("section", {
    id: "main-content",
    style: { minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "64px", overflow: "hidden" }
  },
    /* Aurora blobs */
    React.createElement("div", {
      className: "aurora-blob",
      style: { width: 600, height: 600, background: "#ED362F", top: -100, right: -100, animation: "float 18s ease-in-out infinite" }
    }),
    React.createElement("div", {
      className: "aurora-blob",
      style: { width: 500, height: 500, background: "#43B85C", bottom: -50, left: -80, animation: "float2 22s ease-in-out infinite" }
    }),
    React.createElement("div", {
      className: "aurora-blob",
      style: { width: 400, height: 400, background: "#2CB4E2", top: "30%", left: "40%", animation: "float3 26s ease-in-out infinite" }
    }),

    React.createElement("div", {
      className: "container",
      style: { display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }
    },
      React.createElement("div", { style: { maxWidth: 680, animation: "fadeUp 0.8s ease both" } },
        React.createElement("p", { className: "section-eyebrow" },
          React.createElement("span", { style: { display: "inline-flex", gap: 6 } },
            ["#ED362F","#43B85C","#2CB4E2","#F7B749"].map(c =>
              React.createElement("span", {
                key: c,
                style: { width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", marginTop: 2 }
              })
            )
          ),
          React.createElement("span", null, t("hero.eyebrow", lang))
        ),
        React.createElement("h1", { className: "section-title", style: { fontSize: "clamp(2.6rem, 6vw, 4.2rem)" } },
          React.createElement("span", { className: "gradient-text" }, t("hero.headline1", lang)),
          React.createElement("br", null),
          t("hero.headline2", lang)
        ),
        React.createElement("p", { style: { color: "var(--text-mid)", fontSize: "1.15rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 560 } },
          t("hero.sub", lang)
        ),
        React.createElement("div", { style: { display: "flex", gap: "1rem", flexWrap: "wrap" } },
          React.createElement("a", {
            href: S.registrationUrl, target: "_blank", rel: "noopener noreferrer",
            className: "btn btn-red",
            style: { fontSize: "1.05rem", padding: "1rem 2rem" }
          }, t("hero.cta1", lang), " ", React.createElement(Icon, { name: "external", size: 16 })),
          React.createElement("a", {
            href: "#events",
            className: "btn btn-ghost",
            style: { fontSize: "1.05rem", padding: "1rem 2rem" }
          }, t("hero.cta2", lang))
        )
      ),

      /* Stats bar */
      React.createElement("div", {
        style: {
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem", animation: "fadeUp 0.8s 0.2s ease both", opacity: 0,
          animationFillMode: "forwards"
        }
      },
        [
          { num: S.group.members + "+", label: t("stats.members", lang), icon: "users", color: "#ED362F" },
          { num: S.group.events,        label: t("stats.events", lang),  icon: "calendar", color: "#43B85C" },
          { num: t("stats.city", lang), label: t("stats.since", lang),   icon: "globe", color: "#2CB4E2" }
        ].map(stat =>
          React.createElement("div", {
            key: stat.label,
            style: {
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "1.5rem",
              display: "flex", flexDirection: "column", gap: "0.5rem"
            }
          },
            React.createElement(Icon, { name: stat.icon, size: 22, color: stat.color }),
            React.createElement("div", {
              style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "2rem", color: "var(--text)" }
            }, stat.num),
            React.createElement("div", { style: { color: "var(--text-dim)", fontSize: "0.85rem" } }, stat.label)
          )
        )
      )
    )
  );
}

/* ── About ────────────────────────────────────────────────────────────── */
function About({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const topics = ["OpenStack","Kubernetes","cloud-native","BPF / eBPF","Observabilidad","Redes privadas","IA en infraestructura","Open source"];
  return React.createElement("section", {
    id: "about",
    ref,
    style: {
      background: "var(--bg-2)",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },
      React.createElement("div", { style: { maxWidth: 760 } },
        React.createElement("p", { className: "section-eyebrow" }, t("about.eyebrow", lang)),
        React.createElement("h2", { className: "section-title" }, t("about.title", lang)),
        React.createElement("p", { style: { color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "1.5rem" } }, t("about.p1", lang)),
        React.createElement("p", { style: { color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "2.5rem" } }, t("about.p2", lang))
      ),
      React.createElement("div", null,
        React.createElement("p", {
          style: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em",
                   textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem" }
        }, t("about.topics", lang)),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.6rem" } },
          ...topics.map(topic =>
            React.createElement("span", {
              key: topic,
              style: {
                padding: "0.4rem 0.9rem", borderRadius: "100px",
                background: "var(--surface)", border: "1px solid var(--border)",
                fontSize: "0.85rem", color: "var(--text-mid)", fontFamily: "var(--font-mono)"
              }
            }, topic)
          )
        )
      )
    )
  );
}

/* ── Events ───────────────────────────────────────────────────────────── */
function Events({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const upcoming = S.upcoming || [];
  const past = S.events.filter(e => !e.upcoming);

  function EventCard({ event, featured }) {
    const colorBars = ["#ED362F","#43B85C","#2CB4E2","#F7B749"];
    const d = new Date(event.date);
    const dateStr = d.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { year: "numeric", month: "long", day: "numeric" });
    return React.createElement("div", {
      style: {
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
        boxShadow: featured ? "var(--shadow-card)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s"
      },
      onMouseOver: e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; },
      onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = featured ? "var(--shadow-card)" : "none"; }
    },
      /* Color bar */
      React.createElement("div", {
        style: { height: 4, display: "flex" }
      }, ...colorBars.map(c => React.createElement("div", { key: c, style: { flex: 1, background: c } }))),
      React.createElement("div", { style: { padding: "1.5rem 2rem 2rem" } },
        React.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }
        },
          React.createElement(Icon, { name: "calendar", size: 14, color: "var(--text-dim)" }),
          React.createElement("span", { style: { fontSize: "0.82rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" } }, dateStr),
          event.attendees && React.createElement("span", {
            style: { marginLeft: "auto", fontSize: "0.82rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }
          }, event.attendees + " " + t("events.attendees", lang))
        ),
        React.createElement("h3", {
          style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: featured ? "1.4rem" : "1.1rem", marginBottom: "0.75rem", lineHeight: 1.2 }
        }, bi(event.title, lang)),
        event.venue && React.createElement("p", {
          style: { color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: "0.75rem" }
        }, React.createElement(Icon, { name: "globe", size: 13, color: "var(--text-dim)" }), " ", event.venue),
        React.createElement("p", {
          style: { color: "var(--text-mid)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.5rem" }
        }, bi(event.description, lang)),
        React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
          event.meetupUrl && React.createElement("a", {
            href: event.meetupUrl, target: "_blank", rel: "noopener noreferrer",
            className: "btn btn-ghost",
            style: { fontSize: "0.85rem", padding: "0.55rem 1.1rem" }
          }, t(event.upcoming ? "events.register" : "events.register", lang),
             React.createElement(Icon, { name: "external", size: 14 })),
          event.speakers?.some(s => s.slidesUrl) && React.createElement("a", {
            href: "#speakers",
            className: "btn btn-ghost",
            style: { fontSize: "0.85rem", padding: "0.55rem 1.1rem" }
          }, React.createElement(Icon, { name: "download", size: 14 }), " " + t("events.slides", lang))
        )
      )
    );
  }

  return React.createElement("section", {
    id: "events",
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },
      React.createElement("p", { className: "section-eyebrow" }, t("events.eyebrow", lang)),
      React.createElement("h2", { className: "section-title" }, t("events.title", lang)),

      /* Upcoming */
      React.createElement("h3", {
        style: {
          fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text-mid)",
          fontWeight: 600, marginBottom: "1.5rem", marginTop: "1rem",
          display: "flex", alignItems: "center", gap: "0.5rem"
        }
      },
        React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "#43B85C", display: "inline-block", animation: "pulse 2s ease-in-out infinite" } }),
        t("events.upcoming", lang)
      ),
      upcoming.length === 0
        ? React.createElement("div", {
            style: {
              background: "var(--surface)", border: "1px dashed var(--border-strong)",
              borderRadius: "var(--radius-md)", padding: "2rem",
              color: "var(--text-dim)", fontSize: "0.95rem", marginBottom: "3rem",
              display: "flex", alignItems: "center", gap: "1rem"
            }
          },
            React.createElement(Icon, { name: "calendar", size: 20, color: "var(--text-dim)" }),
            React.createElement("span", null, t("events.noUpcoming", lang))
          )
        : React.createElement("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }
          }, ...upcoming.map(e => React.createElement(EventCard, { key: e.id, event: e, featured: true }))),

      /* Past */
      React.createElement("h3", {
        style: { fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text-mid)", fontWeight: 600, marginBottom: "1.5rem" }
      }, t("events.past", lang)),
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }
      }, ...past.map(e => React.createElement(EventCard, { key: e.id, event: e, featured: e.id === "evt-5" })))
    )
  );
}

/* ── Speakers ─────────────────────────────────────────────────────────── */
function Speakers({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const latestEvent = S.events.find(e => e.id === "evt-5");
  const speakers = latestEvent?.speakers || [];
  const colors = ["#ED362F","#43B85C","#2CB4E2","#F7B749","#ED362F","#43B85C"];

  return React.createElement("section", {
    id: "speakers",
    ref,
    style: {
      background: "var(--bg-2)",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },
      React.createElement("p", { className: "section-eyebrow" }, t("speakers.eyebrow", lang)),
      React.createElement("h2", { className: "section-title" }, t("speakers.title", lang)),
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }
      },
        ...speakers.map((speaker, i) =>
          React.createElement("div", {
            key: speaker.name,
            style: {
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "1.5rem",
              borderLeft: `3px solid ${colors[i % colors.length]}`,
              transition: "transform 0.2s, box-shadow 0.2s"
            },
            onMouseOver: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-pop)"; },
            onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }
          },
            /* Avatar initials */
            React.createElement("div", {
              style: {
                width: 48, height: 48, borderRadius: "50%",
                background: colors[i % colors.length] + "22",
                border: `2px solid ${colors[i % colors.length]}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem",
                color: colors[i % colors.length], marginBottom: "1rem"
              }
            }, speaker.name.split(" ").map(n => n[0]).join("").slice(0, 2)),
            React.createElement("p", {
              style: { fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }
            }, speaker.name),
            speaker.affiliation && React.createElement("p", {
              style: { color: "var(--text-dim)", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }
            }, speaker.affiliation),
            React.createElement("p", {
              style: { color: "var(--text-mid)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1rem" }
            }, bi(speaker.talk, lang)),
            speaker.slidesUrl && React.createElement("a", {
              href: speaker.slidesUrl, target: "_blank", rel: "noopener noreferrer",
              style: {
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.82rem", color: colors[i % colors.length],
                textDecoration: "none", fontWeight: 600,
                fontFamily: "var(--font-mono)"
              }
            }, React.createElement(Icon, { name: "download", size: 14, color: colors[i % colors.length] }), t("speakers.slides", lang))
          )
        )
      )
    )
  );
}

/* ── People ───────────────────────────────────────────────────────────── */
function People({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const [activeRole, setActiveRole] = useState("all");

  const roleColors = {
    organizer: "#ED362F", "co-organizer": "#ED362F", speaker: "#2CB4E2",
    volunteer: "#43B85C", sponsor: "#F7B749", mentor: "#43B85C",
    ambassador: "#43B85C", contributor: "#2CB4E2"
  };
  const roleBg = r => (roleColors[r] || "#2CB4E2") + "20";

  const allPeople = (S.people && S.people.length > 0)
    ? S.people
    : (S.events || []).flatMap(e => (e.speakers || []).map(s => ({
        id: s.name, name: s.name, role: "speaker",
        company: s.affiliation || null, titleJob: null,
        bio: s.talk, linkedinUrl: null, githubUrl: null,
        featured: false, active: true
      })));

  const roleTabs = [
    { key: "all",       label: t("people.all", lang) },
    { key: "organizer", label: t("people.organizer", lang) },
    { key: "speaker",   label: t("people.speaker", lang) },
    { key: "volunteer", label: t("people.volunteer", lang) },
    { key: "sponsor",   label: t("people.sponsor", lang) },
    { key: "mentor",    label: t("people.mentor", lang) }
  ].filter(tab => tab.key === "all" || allPeople.some(p => p.role === tab.key));

  const filtered = activeRole === "all" ? allPeople : allPeople.filter(p => p.role === activeRole);

  return React.createElement("section", {
    id: "people", ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },
      React.createElement("p", { className: "section-eyebrow" }, t("people.eyebrow", lang)),
      React.createElement("h2", { className: "section-title" }, t("people.title", lang)),
      React.createElement("p", {
        style: { color: "var(--text-mid)", marginBottom: "2rem", maxWidth: 600, lineHeight: 1.7 }
      }, t("people.sub", lang)),

      /* Role filter tabs */
      React.createElement("div", {
        style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }
      },
        ...roleTabs.map(tab =>
          React.createElement("button", {
            key: tab.key,
            onClick: () => setActiveRole(tab.key),
            style: {
              padding: "0.4rem 1rem", borderRadius: "999px", border: "1px solid",
              borderColor: activeRole === tab.key ? (roleColors[tab.key] || "#2CB4E2") : "var(--border)",
              background: activeRole === tab.key ? (roleColors[tab.key] || "#2CB4E2") + "18" : "transparent",
              color: activeRole === tab.key ? (roleColors[tab.key] || "#2CB4E2") : "var(--text-mid)",
              fontSize: "0.85rem", fontWeight: activeRole === tab.key ? 600 : 400,
              fontFamily: "var(--font-head)", cursor: "pointer", transition: "all 0.2s"
            }
          }, tab.label)
        )
      ),

      /* People grid */
      filtered.length === 0
        ? React.createElement("p", { style: { color: "var(--text-dim)", fontStyle: "italic" } }, t("people.empty", lang))
        : React.createElement("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }
          },
            ...filtered.map(person => {
              const color = roleColors[person.role] || "#2CB4E2";
              const initials = person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return React.createElement("div", {
                key: person.id || person.name,
                style: {
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", padding: "1.5rem",
                  borderTop: `3px solid ${color}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex", flexDirection: "column", gap: "0.75rem"
                },
                onMouseOver: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-pop)"; },
                onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }
              },
                /* Avatar + name */
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1rem" } },
                  person.photoUrl
                    ? React.createElement("img", {
                        src: person.photoUrl, alt: person.name,
                        style: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${color}` }
                      })
                    : React.createElement("div", {
                        style: {
                          width: 48, height: 48, borderRadius: "50%",
                          background: color + "22", border: `2px solid ${color}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem",
                          color, flexShrink: 0
                        }
                      }, initials),
                  React.createElement("div", null,
                    React.createElement("p", {
                      style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }
                    }, person.name),
                    (person.titleJob || person.company) && React.createElement("p", {
                      style: { color: "var(--text-dim)", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }
                    }, [person.titleJob, person.company].filter(Boolean).join(" · "))
                  )
                ),

                /* Role badge */
                React.createElement("span", {
                  style: {
                    display: "inline-block", alignSelf: "flex-start",
                    padding: "0.2rem 0.6rem", borderRadius: "999px",
                    background: roleBg(person.role), color, border: `1px solid ${color}40`,
                    fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 600
                  }
                }, (lang === "es" ? person.role : person.role)),

                /* Bio */
                person.bio && React.createElement("p", {
                  style: { color: "var(--text-mid)", fontSize: "0.88rem", lineHeight: 1.6, flex: 1 }
                }, bi(person.bio, lang)),

                /* Social links */
                (person.linkedinUrl || person.githubUrl || person.twitterUrl) && React.createElement("div", {
                  style: { display: "flex", gap: "0.6rem", paddingTop: "0.25rem" }
                },
                  person.linkedinUrl && React.createElement("a", {
                    href: person.linkedinUrl, target: "_blank", rel: "noopener noreferrer",
                    "aria-label": "LinkedIn de " + person.name,
                    style: { color: "var(--text-dim)", transition: "color 0.2s", textDecoration: "none" },
                    onMouseOver: e => { e.currentTarget.style.color = "#2CB4E2"; },
                    onMouseOut:  e => { e.currentTarget.style.color = "var(--text-dim)"; }
                  }, React.createElement(Icon, { name: "linkedin", size: 16 })),
                  person.githubUrl && React.createElement("a", {
                    href: person.githubUrl, target: "_blank", rel: "noopener noreferrer",
                    "aria-label": "GitHub de " + person.name,
                    style: { color: "var(--text-dim)", transition: "color 0.2s", textDecoration: "none" },
                    onMouseOver: e => { e.currentTarget.style.color = "var(--text)"; },
                    onMouseOut:  e => { e.currentTarget.style.color = "var(--text-dim)"; }
                  }, React.createElement(Icon, { name: "github", size: 16 })),
                  person.twitterUrl && React.createElement("a", {
                    href: person.twitterUrl, target: "_blank", rel: "noopener noreferrer",
                    "aria-label": "Twitter de " + person.name,
                    style: { color: "var(--text-dim)", transition: "color 0.2s", textDecoration: "none" },
                    onMouseOver: e => { e.currentTarget.style.color = "#1DA1F2"; },
                    onMouseOut:  e => { e.currentTarget.style.color = "var(--text-dim)"; }
                  }, React.createElement(Icon, { name: "globe", size: 16 }))
                )
              );
            })
          )
    )
  );
}

/* ── Agents ───────────────────────────────────────────────────────────── */
function Agents({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  const layers = [
    {
      icon: "robot", color: "#F7B749",
      name: { es: "Agentes de IA", en: "AI Agents" },
      desc: { es: "LLMs, frameworks agénticos, pipelines de razonamiento y acción autónoma.", en: "LLMs, agentic frameworks, reasoning pipelines and autonomous action." }
    },
    {
      icon: "k8s", color: "#2CB4E2",
      name: { es: "Kubernetes — Orquestación", en: "Kubernetes — Orchestration" },
      desc: { es: "Programa, escala y monitoriza las cargas de trabajo de los agentes en clústeres híbridos.", en: "Schedule, scale, and health-monitor agent workloads across hybrid clusters." }
    },
    {
      icon: "cpu", color: "#43B85C",
      name: { es: "OpenStack — Cómputo", en: "OpenStack — Compute" },
      desc: { es: "Recursos de CPU/GPU declarativos para entrenamiento e inferencia distribuida a escala cloud.", en: "Declarative CPU/GPU resources for distributed training and inference at cloud scale." }
    },
    {
      icon: "shield", color: "#ED362F",
      name: { es: "Kata Containers — Sandbox Seguro", en: "Kata Containers — Secure Sandbox" },
      desc: { es: "Aislamiento a nivel VM para código generado por agentes — sin compartir kernel.", en: "VM-level isolation for agent-generated code execution — no shared kernel." }
    },
    {
      icon: "branch", color: "#43B85C",
      name: { es: "Zuul — CI/CD para ML", en: "Zuul — CI/CD for ML" },
      desc: { es: "Pipelines de prueba multi-nodo y gating para código generado por agentes y experimentos de ML.", en: "Multi-node test pipelines and gating for agent-generated code and ML experiments." }
    },
    {
      icon: "network", color: "#2CB4E2",
      name: { es: "StarlingX — Edge AI", en: "StarlingX — Edge AI" },
      desc: { es: "Inferencia de ultra-baja latencia en hardware de borde, estaciones 5G e IoT industrial.", en: "Ultra-low-latency inference on edge hardware, 5G base stations, and industrial IoT." }
    }
  ];

  const quote = {
    es: "\"Los agentes son a la infraestructura abierta lo que la IA fue a Linux — una capa nueva y fundamental que lo cambia todo.\"",
    en: "\"Agents are to Open Infrastructure what AI was to Linux — a new fundamental layer that changes everything.\""
  };

  return React.createElement("section", {
    id: "agents", ref,
    style: {
      background: "var(--bg-2)",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },

      /* Header */
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" } },
        React.createElement(Icon, { name: "robot", size: 18, color: "#F7B749" }),
        React.createElement("p", { className: "section-eyebrow", style: { margin: 0 } }, t("agents.eyebrow", lang))
      ),
      React.createElement("h2", { className: "section-title", style: { maxWidth: 700 } }, t("agents.title", lang)),
      React.createElement("p", {
        style: { color: "var(--text-mid)", lineHeight: 1.8, maxWidth: 680, marginBottom: "3rem" }
      }, t("agents.sub", lang)),

      /* Quote block */
      React.createElement("blockquote", {
        style: {
          borderLeft: "4px solid #F7B749", padding: "1rem 1.5rem",
          margin: "0 0 3rem", background: "#F7B74910",
          borderRadius: "0 var(--radius-md) var(--radius-md) 0"
        }
      },
        React.createElement("p", {
          style: {
            fontFamily: "var(--font-head)", fontStyle: "italic",
            fontSize: "1.05rem", color: "var(--text)", lineHeight: 1.6
          }
        }, bi(quote, lang))
      ),

      /* Stack section title */
      React.createElement("p", {
        style: { fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-mid)", marginBottom: "1.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }
      }, t("agents.stack", lang)),

      /* Layer cards grid */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }
      },
        ...layers.map((layer, i) =>
          React.createElement("div", {
            key: layer.name.en,
            style: {
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "1.25rem",
              borderLeft: `3px solid ${layer.color}`,
              display: "flex", flexDirection: "column", gap: "0.6rem",
              transition: "transform 0.2s, box-shadow 0.2s"
            },
            onMouseOver: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${layer.color}30`; },
            onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.6rem" } },
              React.createElement("span", {
                style: {
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 36, height: 36, borderRadius: "8px",
                  background: layer.color + "18", flexShrink: 0
                }
              }, React.createElement(Icon, { name: layer.icon, size: 18, color: layer.color })),
              React.createElement("p", {
                style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.3 }
              }, bi(layer.name, lang))
            ),
            React.createElement("p", {
              style: { color: "var(--text-mid)", fontSize: "0.85rem", lineHeight: 1.6 }
            }, bi(layer.desc, lang)),
            /* Layer badge */
            React.createElement("span", {
              style: {
                alignSelf: "flex-start", padding: "0.15rem 0.5rem", borderRadius: "4px",
                background: layer.color + "12", color: layer.color,
                fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 600
              }
            }, "Layer " + (layers.length - i))
          )
        )
      ),

      /* CTA */
      React.createElement("div", {
        style: {
          background: "linear-gradient(135deg, #ED362F18 0%, #2CB4E218 50%, #F7B74918 100%)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
          padding: "2.5rem", textAlign: "center"
        }
      },
        React.createElement("p", {
          style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.75rem" }
        }, t("agents.cta", lang)),
        React.createElement("p", {
          style: { color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 520, margin: "0 auto 1.5rem" }
        }, t("agents.cta_sub", lang)),
        React.createElement("a", {
          href: S.registrationUrl, target: "_blank", rel: "noopener noreferrer",
          className: "btn btn-red"
        }, t("join.meetup", lang), " ", React.createElement(Icon, { name: "external", size: 16 }))
      )
    )
  );
}

/* ── Join ─────────────────────────────────────────────────────────────── */
function Join({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const colorBlocks = [
    { color: "#ED362F", icon: "meetup",   label: "Meetup",    url: S.socials.meetup },
    { color: "#43B85C", icon: "youtube",  label: "YouTube",   url: S.socials.youtube },
    { color: "#2CB4E2", icon: "linkedin", label: "LinkedIn",  url: S.socials.linkedin },
    { color: "#F7B749", icon: "instagram",label: "Instagram", url: S.socials.instagram }
  ];
  return React.createElement("section", {
    id: "join",
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container" },
      React.createElement("div", {
        style: {
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center"
        }
      },
        React.createElement("div", null,
          React.createElement("p", { className: "section-eyebrow" }, t("join.eyebrow", lang)),
          React.createElement("h2", { className: "section-title" }, t("join.title", lang)),
          React.createElement("p", {
            style: { color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "2rem" }
          }, t("join.sub", lang)),
          React.createElement("div", { style: { display: "flex", gap: "1rem", flexWrap: "wrap" } },
            React.createElement("a", {
              href: S.registrationUrl, target: "_blank", rel: "noopener noreferrer",
              className: "btn btn-red"
            }, t("join.meetup", lang), " ", React.createElement(Icon, { name: "external", size: 16 })),
            React.createElement("a", {
              href: S.chatUrl, target: "_blank", rel: "noopener noreferrer",
              className: "btn btn-ghost"
            }, t("join.chat", lang))
          )
        ),

        /* Social blocks grid */
        React.createElement("div", {
          style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }
        },
          ...colorBlocks.map(block =>
            React.createElement("a", {
              key: block.label,
              href: block.url, target: "_blank", rel: "noopener noreferrer",
              "aria-label": block.label,
              style: {
                background: block.color + "15",
                border: `1px solid ${block.color}40`,
                borderRadius: "var(--radius-md)", padding: "1.5rem",
                display: "flex", flexDirection: "column", gap: "0.75rem",
                textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                color: "var(--text)"
              },
              onMouseOver: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${block.color}30`; },
              onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }
            },
              React.createElement(Icon, { name: block.icon, size: 24, color: block.color }),
              React.createElement("span", {
                style: { fontFamily: "var(--font-head)", fontWeight: 700, color: block.color }
              }, block.label)
            )
          )
        )
      )
    )
  );
}

/* ── Sponsors ─────────────────────────────────────────────────────────── */
function Sponsors({ lang }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return React.createElement("section", {
    id: "sponsors",
    ref,
    style: {
      background: "var(--bg-2)",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }
  },
    React.createElement("div", { className: "container", style: { textAlign: "center" } },
      React.createElement("p", { className: "section-eyebrow", style: { justifyContent: "center" } }, t("sponsors.eyebrow", lang)),
      React.createElement("h2", { className: "section-title" }, t("sponsors.title", lang)),
      React.createElement("div", {
        style: { display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }
      },
        ...S.sponsors.map(s =>
          React.createElement("a", {
            key: s.name,
            href: s.url, target: "_blank", rel: "noopener noreferrer",
            style: {
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "1.5rem 2.5rem",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
              textDecoration: "none", color: "var(--text-mid)", minWidth: 220,
              transition: "transform 0.2s, box-shadow 0.2s"
            },
            onMouseOver: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-pop)"; },
            onMouseOut:  e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }
          },
            React.createElement(Icon, { name: "k8s", size: 28, color: "#ED362F" }),
            React.createElement("span", {
              style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }
            }, s.name),
            React.createElement("span", {
              style: { fontSize: "0.8rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }
            }, bi(s.role, lang))
          )
        )
      )
    )
  );
}

/* ── Footer ───────────────────────────────────────────────────────────── */
function Footer({ lang }) {
  const year = new Date().getFullYear();
  return React.createElement("footer", {
    style: {
      background: "var(--bg-3)", borderTop: "1px solid var(--border)",
      padding: "3rem 2rem", textAlign: "center"
    }
  },
    React.createElement("div", { className: "container" },
      /* Logo mark */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", width: 32, height: 32, margin: "0 auto 1rem" }
      }, ...["#ED362F","#43B85C","#2CB4E2","#F7B749"].map(c =>
        React.createElement("div", { key: c, style: { background: c, borderRadius: "3px" } })
      )),
      React.createElement("p", {
        style: { fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }
      }, S.group.name),
      React.createElement("p", {
        style: { color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: "1.5rem" }
      }, t("footer.tagline", lang)),
      /* Social links */
      React.createElement("div", {
        style: { display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }
      },
        [
          { icon: "meetup",    href: S.socials.meetup,    label: "Meetup" },
          { icon: "youtube",   href: S.socials.youtube,   label: "YouTube" },
          { icon: "linkedin",  href: S.socials.linkedin,  label: "LinkedIn" },
          { icon: "instagram", href: S.socials.instagram, label: "Instagram" },
          { icon: "github",    href: S.socials.github,    label: "GitHub" }
        ].map(s =>
          React.createElement("a", {
            key: s.icon, href: s.href, target: "_blank", rel: "noopener noreferrer",
            "aria-label": s.label, className: "footer-link",
            style: {
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: "10px",
              background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--text-dim)", textDecoration: "none"
            }
          }, React.createElement(Icon, { name: s.icon, size: 18 }))
        )
      ),
      React.createElement("p", { style: { color: "var(--text-dim)", fontSize: "0.82rem" } },
        "© " + year + " " + S.group.name + ". " + t("footer.rights", lang) + " · ",
        React.createElement("a", {
          href: "privacy.html", className: "footer-link",
          style: { color: "var(--text-dim)", textDecoration: "none" }
        }, t("footer.privacy", lang)),
        " · ",
        React.createElement("a", {
          href: "terms.html", className: "footer-link",
          style: { color: "var(--text-dim)", textDecoration: "none" }
        }, t("footer.terms", lang))
      )
    )
  );
}

/* ── App root ─────────────────────────────────────────────────────────── */
function App() {
  const [theme, toggleTheme] = useTheme();
  const [lang, setLang] = useLang();
  return React.createElement(React.Fragment, null,
    React.createElement(Nav, { theme, toggleTheme, lang, setLang }),
    React.createElement(Hero, { lang }),
    React.createElement(About, { lang }),
    React.createElement(Events, { lang }),
    React.createElement(Speakers, { lang }),
    React.createElement(People, { lang }),
    React.createElement(Agents, { lang }),
    React.createElement(Join, { lang }),
    React.createElement(Sponsors, { lang }),
    React.createElement(Footer, { lang })
  );
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
