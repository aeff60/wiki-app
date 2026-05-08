import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorize } from '../../middleware/authorize.js';
import { ApiError } from '../../utils/ApiError.js';

describe('authorize middleware', () => {
  const mockNext = vi.fn();

  function makeReq(role) {
    return { user: { role } };
  }

  beforeEach(() => {
    mockNext.mockReset();
  });

  it('calls next() with no args when role is exactly the minimum', () => {
    authorize('editor')(makeReq('editor'), {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('calls next() with no args when role exceeds the minimum', () => {
    authorize('editor')(makeReq('admin'), {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('calls next() with no args for viewer accessing viewer-level route', () => {
    authorize('viewer')(makeReq('viewer'), {}, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('calls next(ApiError 403) when role is below the minimum', () => {
    authorize('admin')(makeReq('editor'), {}, mockNext);
    const [err] = mockNext.mock.calls[0];
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(403);
  });

  it('calls next(ApiError 403) when user is null', () => {
    authorize('viewer')({ user: null }, {}, mockNext);
    const [err] = mockNext.mock.calls[0];
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(403);
  });

  it('calls next(ApiError 403) when user is undefined', () => {
    authorize('viewer')({}, {}, mockNext);
    const [err] = mockNext.mock.calls[0];
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(403);
  });
});
