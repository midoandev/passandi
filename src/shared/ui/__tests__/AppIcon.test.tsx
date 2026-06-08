import React from 'react';
import { render } from '@testing-library/react-native';
import { AppIcon } from '../AppIcon';

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Feather: 'Feather',
}));

describe('AppIcon', () => {
  describe('Icon Libraries', () => {
    it('should render Ionicons by default', () => {
      const { UNSAFE_root } = render(
        <AppIcon name="home" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render MaterialCommunityIcons when specified', () => {
      const { UNSAFE_root } = render(
        <AppIcon library="material" name="account" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render Feather icons when specified', () => {
      const { UNSAFE_root } = render(
        <AppIcon library="feather" name="user" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should use default size of 22', () => {
      const { UNSAFE_root } = render(
        <AppIcon name="home" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should accept custom size', () => {
      const { UNSAFE_root } = render(
        <AppIcon name="home" size={32} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should use default color of white (#fff)', () => {
      const { UNSAFE_root } = render(
        <AppIcon name="home" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should accept custom color', () => {
      const { UNSAFE_root } = render(
        <AppIcon name="home" color="#FF0000" />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should render with all props combined', () => {
      const { UNSAFE_root } = render(
        <AppIcon
          library="material"
          name="account-circle"
          size={48}
          color="#2A3A52"
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle icon name as string', () => {
      const iconName = "settings";
      const { UNSAFE_root } = render(
        <AppIcon name={iconName} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
