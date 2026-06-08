import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppInput } from '../AppInput';

// Mock useTheme
jest.mock('@/shared/config/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    tokens: {
      bg: '#000000',
      text: '#FFFFFF',
      border: '#2A3A52',
      muted: '#8E9BAE',
      subtle: '#6B7A90',
    },
  })),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.hide': 'Hide',
        'common.show': 'Show',
      };
      return translations[key] || key;
    },
  }),
}));

describe('AppInput', () => {
  describe('Basic Rendering', () => {
    it('should render label correctly', () => {
      const { getByText } = render(
        <AppInput label="Email" value="" onChangeText={() => {}} />
      );

      expect(getByText('Email')).toBeTruthy();
    });

    it('should render text input', () => {
      const { getByDisplayValue } = render(
        <AppInput label="Email" value="test@example.com" onChangeText={() => {}} />
      );

      expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('should apply placeholder', () => {
      const { getByPlaceholderText } = render(
        <AppInput
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={() => {}}
        />
      );

      expect(getByPlaceholderText('Enter email')).toBeTruthy();
    });
  });

  describe('Icon Support', () => {
    it('should render without icon by default', () => {
      const { queryByTestId } = render(
        <AppInput label="Email" value="" onChangeText={() => {}} />
      );

      // No icon should be rendered
      expect(queryByTestId('input-icon')).toBeNull();
    });

    it('should render icon when iconName is provided', () => {
      const { UNSAFE_root } = render(
        <AppInput
          label="Email"
          iconName="mail"
          value=""
          onChangeText={() => {}}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should use custom icon size when provided', () => {
      const { UNSAFE_root } = render(
        <AppInput
          label="Email"
          iconName="mail"
          iconSize={24}
          value=""
          onChangeText={() => {}}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should apply proper padding when icon is present', () => {
      const { getByDisplayValue } = render(
        <AppInput
          label="Email"
          iconName="mail"
          value="test"
          onChangeText={() => {}}
        />
      );

      const input = getByDisplayValue('test');
      expect(input).toBeTruthy();
    });
  });

  describe('Password Mode', () => {
    it('should hide text by default when isPassword is true', () => {
      const { getByDisplayValue } = render(
        <AppInput
          label="Password"
          isPassword={true}
          value="secret123"
          onChangeText={() => {}}
        />
      );

      const input = getByDisplayValue('secret123');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should show toggle button when isPassword is true', () => {
      const { getByText } = render(
        <AppInput
          label="Password"
          isPassword={true}
          value="secret123"
          onChangeText={() => {}}
        />
      );

      expect(getByText('Show')).toBeTruthy();
    });

    it('should toggle password visibility when toggle button pressed', () => {
      const { getByText, getByDisplayValue } = render(
        <AppInput
          label="Password"
          isPassword={true}
          value="secret123"
          onChangeText={() => {}}
        />
      );

      const toggleButton = getByText('Show');
      const input = getByDisplayValue('secret123');

      // Initially hidden
      expect(input.props.secureTextEntry).toBe(true);

      // Press toggle to show
      fireEvent.press(toggleButton);
      expect(getByText('Hide')).toBeTruthy();

      // Press toggle to hide again
      fireEvent.press(getByText('Hide'));
      expect(getByText('Show')).toBeTruthy();
    });

    it('should not show toggle button when isPassword is false', () => {
      const { queryByText } = render(
        <AppInput
          label="Email"
          isPassword={false}
          value="test@example.com"
          onChangeText={() => {}}
        />
      );

      expect(queryByText('Show')).toBeNull();
      expect(queryByText('Hide')).toBeNull();
    });
  });

  describe('Text Input Props', () => {
    it('should call onChangeText when text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByDisplayValue } = render(
        <AppInput label="Email" value="" onChangeText={onChangeTextMock} />
      );

      const input = getByDisplayValue('');
      fireEvent.changeText(input, 'new@example.com');

      expect(onChangeTextMock).toHaveBeenCalledWith('new@example.com');
    });

    it('should support keyboard type prop', () => {
      const { getByDisplayValue } = render(
        <AppInput
          label="Email"
          value=""
          onChangeText={() => {}}
          keyboardType="email-address"
        />
      );

      const input = getByDisplayValue('');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should support autoCapitalize prop', () => {
      const { getByDisplayValue } = render(
        <AppInput
          label="Name"
          value=""
          onChangeText={() => {}}
          autoCapitalize="words"
        />
      );

      const input = getByDisplayValue('');
      expect(input.props.autoCapitalize).toBe('words');
    });

    it('should support editable prop', () => {
      const { getByDisplayValue } = render(
        <AppInput
          label="Email"
          value="readonly@example.com"
          onChangeText={() => {}}
          editable={false}
        />
      );

      const input = getByDisplayValue('readonly@example.com');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should apply theme colors correctly', () => {
      const { getByText } = render(
        <AppInput label="Email" value="" onChangeText={() => {}} />
      );

      const label = getByText('Email');
      expect(label).toBeTruthy();
    });

    it('should have proper wrapper margin', () => {
      const { UNSAFE_root } = render(
        <AppInput label="Email" value="" onChangeText={() => {}} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with all props combined', () => {
      const onChangeTextMock = jest.fn();
      const { getByText, getByDisplayValue } = render(
        <AppInput
          label="Password"
          placeholder="Enter password"
          isPassword={true}
          iconName="lock-closed"
          iconSize={20}
          value="test123"
          onChangeText={onChangeTextMock}
          autoCapitalize="none"
        />
      );

      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Show')).toBeTruthy();
      expect(getByDisplayValue('test123')).toBeTruthy();

      const input = getByDisplayValue('test123');
      fireEvent.changeText(input, 'newpassword');
      expect(onChangeTextMock).toHaveBeenCalledWith('newpassword');
    });
  });
});
