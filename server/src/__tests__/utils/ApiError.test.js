import { describe, it, expect } from 'vitest';
import { ApiError } from '../../utils/ApiError.js';

describe('ApiError', () => {
  it('sets statusCode and message', () => {
    const err = new ApiError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
  });

  it('marks isOperational as true', () => {
    const err = new ApiError(400, 'Bad request');
    expect(err.isOperational).toBe(true);
  });

  it('is an instance of Error', () => {
    expect(new ApiError(500, 'oops')).toBeInstanceOf(Error);
  });

  it('preserves the stack trace', () => {
    const err = new ApiError(500, 'server error');
    expect(err.stack).toBeDefined();
  });
});
