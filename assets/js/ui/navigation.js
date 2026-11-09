/**
 * Navegación: menú móvil, enlace activo según la sección visible y año actual.
 */

import { icon } from './icons.js';

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-movil');

  if (!toggle || !menu) {
    return;
  }

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    toggle.innerHTML = icon(open ? 'close' : 'menu', 'h-5 w-5');
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(menu.hidden);
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (menu.hidden) {
      return;
    }
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  const desktop = window.matchMedia('(min-width: 768px)');
  const handleChange = (event) => {
    if (event.matches) {
      setOpen(false);
    }
  };

  if (typeof desktop.addEventListener === 'function') {
    desktop.addEventListener('change', handleChange);
  } else {
    desktop.addListener(handleChange);
  }
}

function initScrollSpy() {
  const links = [...document.querySelectorAll('[data-nav-link]')];
  const sections = ['inicio', 'ejercicios', 'conceptos', 'proyecto']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (links.length === 0 || sections.length === 0) {
    return;
  }

  const setActive = (id) => {
    for (const link of links) {
      if (link.getAttribute('href') === `#${id}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  setActive('inicio');

  for (const link of links) {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href')?.slice(1);
      if (id) {
        setActive(id);
      }
    });
  }

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

export function initNavigation() {
  const year = document.getElementById('current-year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  initMobileMenu();
  initScrollSpy();
}
