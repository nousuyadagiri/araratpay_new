const photoModules = import.meta.glob('@/assets/use-cases/photo-*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const uiModules = import.meta.glob('@/assets/use-cases/ui-*.webp.asset.json', { eager: true, import: 'default' }) as Record<string, { url: string }>;
const sorted = (modules: Record<string, { url: string }>) => Object.keys(modules).sort().map(key => modules[key]?.url ?? '');
export const photos = Object.keys(photoModules).sort().map(key => photoModules[key] ?? '');
export const productImages = sorted(uiModules);
export const industryPhotos = (industry: number) => [2 * industry, 2 * industry + 1, 12 + 2 * industry, 13 + 2 * industry];
