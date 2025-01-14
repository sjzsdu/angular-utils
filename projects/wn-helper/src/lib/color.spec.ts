import { hexToRgb, rgbToHex, hslToRgb, rgbToHsl, hexToHsl, hslToHex } from './color';

describe('Color Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0, 1]);
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0, 1]);
      expect(hexToRgb('#0000ff')).toEqual([0, 0, 255, 1]);
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual([255, 0, 0, 1]);
    });

    it('should handle 3-digit hex', () => {
      expect(hexToRgb('#f00')).toEqual([255, 0, 0, 1]);
      expect(hexToRgb('#0f0')).toEqual([0, 255, 0, 1]);
      expect(hexToRgb('#00f')).toEqual([0, 0, 255, 1]);
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('should handle edge values', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });
  });

  describe('hslToRgb', () => {
    it('should convert HSL to RGB', () => {
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
      expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
      expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
    });

    it('should handle edge cases', () => {
      expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]);
      expect(hslToRgb(0, 100, 100)).toEqual([255, 255, 255]);
    });
  });

  describe('rgbToHsl', () => {
    it('should convert RGB to HSL', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
      expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
      expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
    });

    it('should handle edge cases', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
      expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
    });
  });

  describe('hexToHsl', () => {
    it('should convert hex to HSL', () => {
      expect(hexToHsl('#ff0000')).toEqual([0, 100, 50]);
      expect(hexToHsl('#00ff00')).toEqual([120, 100, 50]);
      expect(hexToHsl('#0000ff')).toEqual([240, 100, 50]);
    });
  });

  describe('hslToHex', () => {
    it('should convert HSL to hex', () => {
      expect(hslToHex(0, 100, 50)).toBe('#ff0000');
      expect(hslToHex(120, 100, 50)).toBe('#00ff00');
      expect(hslToHex(240, 100, 50)).toBe('#0000ff');
    });
  });
});
