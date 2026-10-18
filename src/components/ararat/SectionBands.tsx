import { useEffect } from "react";
import "./section-backgrounds.css";

const protectedContent = "button,a,input,select,textarea,svg,canvas,[role=button],[role=slider],[data-surface],article,.mf-step-card,.mf-pills,.mf-invoice-tilt,.mf-progress,.mf-flow-list,.coverage-feed,.coverage-rails,.coverage-map,.rails-split,.cockpit-dashboard,.flow-signature,.flow-dash,.flow-receipt,.flow-code,.flow-currency,.flow-map,.flow-card-visual,.flow-fan-card,.platform-card,.api-tool,.api-right,.api-inline-code,.code-window,.ledger-clock,.ledger-day-stage,.solutions-scene,.solutions-toggle-panel,.solutions-phone,.final-peak";

/** Keep panel roles unchanged while replacing only teal section paint and exposed light ink. */
function applyPaleSectionBackgrounds(main: HTMLElement) {
  document.querySelectorAll("[data-pale-section],[data-pale-ink]").forEach(node => {
    node.removeAttribute("data-pale-section"); node.removeAttribute("data-pale-ink");
  });
  if (document.documentElement.dataset["theme"] !== "light" || location.pathname === "/hero-film-review") return;
  const roots = Array.from(main.querySelectorAll<HTMLElement>("section,.home-sheet"))
    .filter(node => !node.parentElement?.closest("section") && !node.matches(".cinema-hero"));
  const changed = roots.filter(node => {
    if (node.matches(".fee-towers-section,.split-section,.cockpit-section,.p2-section") || node.matches(".home-sheet") && node.querySelector(".fee-towers-section,.split-section,.cockpit-section,.p2-section,.site-footer")) return false;
    return node.dataset["band"] === "dark" || node.matches(".mf-section,.use-gallery,.globe-section") || getComputedStyle(node).backgroundColor === "rgb(63, 116, 116)";
  });
  for (const section of changed) section.dataset["paleSection"] = "";
  for (const section of changed) {
    for (const node of Array.from(section.querySelectorAll<HTMLElement>("*"))) {
      if (node.closest(protectedContent) || node.querySelector("svg") || !Array.from(node.childNodes).some(child => child.nodeType === Node.TEXT_NODE && child.textContent?.trim())) continue;
      let parent = node.parentElement;
      let framed = false;
      while (parent && parent !== section && !parent.hasAttribute("data-pale-section")) {
        const style = getComputedStyle(parent);
        if (style.backgroundColor !== "rgba(0, 0, 0, 0)" || style.backgroundImage !== "none") { framed = true; break; }
        parent = parent.parentElement;
      }
      if (framed) continue;
      const color = getComputedStyle(node).color;
      const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      const oklch = color.match(/^oklch\(([\d.]+)/);
      const isLight = rgb ? Number(rgb[1]) * .2126 + Number(rgb[2]) * .7152 + Number(rgb[3]) * .0722 > 180 : oklch ? Number(oklch[1]) > .75 : false;
      if (isLight) node.dataset["paleInk"] = "";
    }
  }
}

export function sectionBandForIndex(index: number, home: boolean) {
  if (home) return index === 0 ? "dark" : index === 1 ? "white" : index % 2 ? "dark" : "light";
  return index % 2 ? "dark" : "light";
}

/** Theme roles follow document order, including lazily mounted sheets; never touch scroll state. */
export function SectionBands() {
  useEffect(() => {
    let frame = 0;
    let themeTimer: ReturnType<typeof setTimeout> | undefined;
    const assign = () => {
      frame = 0;
      const main = document.querySelector("main");
      if (!main || location.pathname === "/hero-film-review") return;
      const home = main.classList.contains("home-sheets");
      const candidates = home
        ? Array.from(main.querySelectorAll<HTMLElement>(":scope > .home-sheet"))
        : Array.from(main.querySelectorAll<HTMLElement>("section")).filter(section => !section.parentElement?.closest("section"));
      let index = 0;
      for (const section of candidates) {
        if (section.matches(".flow-hero,.solutions-hero,.security-dive,.company-hero,.company-manifesto,.inner-hero,.price-hero") || section.closest(".solutions-hero-pin,.security-dive-wrapper") || section.querySelector(".site-footer")) { delete section.dataset["band"]; continue; }
         section.dataset["band"] = sectionBandForIndex(index++, home);
        section.querySelectorAll<HTMLElement>(".use-gallery-detail,.developer-section,.invoice-object,.checkout-widget,.flow-dash,.flow-receipt,.code-window,.flow-code,.fee-result,.radar-panel,.api-code-panel,.api-extra-code,.api-table-wrap,.api-inline-note,.price-receipt,.flow-why-grid article:has(.flow-bars),.contact-form,.contact-success,.faq-search,.api-tool,.resource-card,.sdk-item,.cap-card,.ledger-day-stage,.ledger-events em,.solutions-phone,.coverage-card,.coverage-stat,input:not([type=range]):not([type=checkbox]),textarea,select,.fee-toggle,.use-gallery-pill,.d-feature-chips > span").forEach(card => card.dataset["surface"] = "light");
      }
      applyPaleSectionBackgrounds(main);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(assign); };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    const themeObserver = new MutationObserver(() => {
      schedule();
      clearTimeout(themeTimer);
      themeTimer = setTimeout(schedule, 400);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    assign();
    themeTimer = setTimeout(schedule, 400);
    return () => { observer.disconnect(); themeObserver.disconnect(); cancelAnimationFrame(frame); clearTimeout(themeTimer); };
  }, []);
  return null;
}