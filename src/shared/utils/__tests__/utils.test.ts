const { createAppError } = require('../error');

describe('Error Utils', () => {
  describe('createAppError', () => {
    it('should create AppError with message', () => {
      const error = createAppError('Test error message');

      expect(error).toHaveProperty('id');
      expect(error).toHaveProperty('message');
      expect(error.message).toBe('Test error message');
    });

    it('should generate unique ID for each error', () => {
      const error1 = createAppError('Error 1');
      const error2 = createAppError('Error 2');

      expect(error1.id).not.toBe(error2.id);
    });

    it('should create ID with timestamp and random string', () => {
      const error = createAppError('Test error');

      expect(error.id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should handle empty message', () => {
      const error = createAppError('');

      expect(error.message).toBe('');
      expect(error.id).toBeTruthy();
    });

    it('should handle long message', () => {
      const longMessage = 'A'.repeat(1000);
      const error = createAppError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(1000);
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error: "test" & <script>alert(1)</script>';
      const error = createAppError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });
  });
});

describe('Result Type', () => {
  describe('Success Result', () => {
    it('should create success result with data', () => {
      const result = {
        success: true,
        data: 'test data',
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test data');
      }
    });

    it('should work with different data types', () => {
      const stringResult = {
        success: true,
        data: 'text',
      };

      const numberResult = {
        success: true,
        data: 42,
      };

      const objectResult = {
        success: true,
        data: { name: 'John' },
      };

      expect(stringResult.success).toBe(true);
      expect(numberResult.success).toBe(true);
      expect(objectResult.success).toBe(true);
    });

    it('should handle null data', () => {
      const result = {
        success: true,
        data: null,
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });
  });

  describe('Error Result', () => {
    it('should create error result with AppError', () => {
      const result = {
        success: false,
        error: createAppError('Something went wrong'),
      };

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Something went wrong');
      }
    });
  });
});
