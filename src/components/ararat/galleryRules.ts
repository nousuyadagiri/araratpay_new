export const GALLERY_INTERVAL = 6000;
export const GALLERY_INTERACTION_PAUSE = 12000;
export const GALLERY_PANEL_COUNT = 28;
export function canAdvanceGallery(visible: boolean, hidden: boolean, hovered: boolean, reduced: boolean, now: number, lastInteraction: number) {
 return visible && !hidden && !hovered && !reduced && now - lastInteraction >= GALLERY_INTERACTION_PAUSE;
}
