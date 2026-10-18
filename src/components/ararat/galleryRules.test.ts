import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
const expect = (actual: unknown) => ({ toBe: (expected: unknown) => assert.equal(actual, expected) });
import { canAdvanceGallery, GALLERY_INTERVAL, GALLERY_PANEL_COUNT } from './galleryRules';
describe('gallery motion rules',()=>{
 it('advances every six seconds',()=>expect(GALLERY_INTERVAL).toBe(6000));
 it('contains 28 panels',()=>expect(GALLERY_PANEL_COUNT).toBe(28));
 it('pauses for twelve seconds after interaction',()=>{expect(canAdvanceGallery(true,false,false,false,11999,0)).toBe(false);expect(canAdvanceGallery(true,false,false,false,12000,0)).toBe(true);});
 it('never advances offscreen',()=>expect(canAdvanceGallery(false,false,false,false,20000,0)).toBe(false));
 it('never advances in a hidden tab',()=>expect(canAdvanceGallery(true,true,false,false,20000,0)).toBe(false));
 it('pauses on hover',()=>expect(canAdvanceGallery(true,false,true,false,20000,0)).toBe(false));
 it('never autoplays with reduced motion',()=>expect(canAdvanceGallery(true,false,false,true,20000,0)).toBe(false));
});
