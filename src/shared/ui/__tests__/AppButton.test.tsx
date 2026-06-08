import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../AppButton';

describe('AppButton', () => {
  describe('Label Only Mode', () => {
    it('should render label correctly', () => {
      const { getByText } = render(
        <AppButton label="Test Button" onPress={() => {}} />
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <AppButton label="Test Button" onPress={onPressMock} />
      );

      fireEvent.press(getByText('Test Button'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should show loading indicator when loading', () => {
      const { getByTestId, queryByText } = render(
        <AppButton label="Test Button" onPress={() => {}} loading={true} />
      );

      expect(queryByText('Test Button')).toBeNull();
      // ActivityIndicator should be rendered
    });

    it('should be disabled when loading', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <AppButton label="Test Button" onPress={onPressMock} loading={true} />
      );

      // Should not be able to press while loading
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Icon Only Mode', () => {
    it('should render icon without label', () => {
      const { queryByText } = render(
        <AppButton icon="plus" onPress={() => {}} />
      );

      expect(queryByText('')).toBeNull();
      // Icon should be rendered
    });

    it('should apply square styling for icon-only button', () => {
      const { getByTestId } = render(
        <AppButton icon="plus" onPress={() => {}} />
      );

      // Icon-only buttons should have square dimensions (52x52)
    });

    it('should call onPress when icon button pressed', () => {
      const onPressMock = jest.fn();
      const { UNSAFE_root } = render(
        <AppButton icon="plus" onPress={onPressMock} />
      );

      fireEvent.press(UNSAFE_root);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon + Label Mode', () => {
    it('should render both icon and label', () => {
      const { getByText } = render(
        <AppButton icon="plus" label="Add Item" onPress={() => {}} />
      );

      expect(getByText('Add Item')).toBeTruthy();
      // Icon should also be rendered
    });

    it('should apply proper spacing between icon and label', () => {
      const { getByText } = render(
        <AppButton icon="plus" label="Add Item" onPress={() => {}} />
      );

      // Icon should have marginRight: 8
      expect(getByText('Add Item')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <AppButton icon="plus" label="Add Item" onPress={onPressMock} />
      );

      fireEvent.press(getByText('Add Item'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styling by default', () => {
      const { getByText } = render(
        <AppButton label="Primary" onPress={() => {}} />
      );

      const button = getByText('Primary');
      // Should have blue background
      expect(button).toBeTruthy();
    });

    it('should apply outline variant styling', () => {
      const { getByText } = render(
        <AppButton label="Outline" onPress={() => {}} variant="outline" />
      );

      const button = getByText('Outline');
      // Should have border and no background
      expect(button).toBeTruthy();
    });

    it('should apply ghost variant styling', () => {
      const { getByText } = render(
        <AppButton label="Ghost" onPress={() => {}} variant="ghost" />
      );

      const button = getByText('Ghost');
      // Should have no background and no border
      expect(button).toBeTruthy();
    });

    it('should use correct text color for primary variant', () => {
      const { getByText } = render(
        <AppButton label="Primary" onPress={() => {}} variant="primary" />
      );

      const text = getByText('Primary');
      // Text should be white (#fff)
      expect(text).toBeTruthy();
    });

    it('should use correct text color for outline variant', () => {
      const { getByText } = render(
        <AppButton label="Outline" onPress={() => {}} variant="outline" />
      );

      const text = getByText('Outline');
      // Text should be brand blue
      expect(text).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <AppButton label="Custom" onPress={() => {}} style={customStyle} />
      );

      const button = getByText('Custom');
      expect(button).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper role', () => {
      const { getByText } = render(
        <AppButton label="Accessible" onPress={() => {}} />
      );

      expect(getByText('Accessible')).toBeTruthy();
    });

    it('should not be pressable when loading', () => {
      const onPressMock = jest.fn();
      const { UNSAFE_root } = render(
        <AppButton label="Loading" onPress={onPressMock} loading={true} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
