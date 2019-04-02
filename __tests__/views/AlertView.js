import { ALERT_ELEMENT_ID } from '../../app/javascript/config';

import { toggleAlert } from '../../app/javascript/views/AlertView';

const mockSlideToggleFn = jest.fn().mockImplementation((speed, mode, fn) => { if (fn) fn(); });
// Mock $ operator for jQuery
window.$ = jest.fn().mockReturnValue({
  text: jest.fn(),
  slideToggle: mockSlideToggleFn,
});

describe('AlertView', () => {
  beforeEach(() => jest.clearAllMocks());

  test('toggleAlert without a previous timeout', () => {
    jest.useFakeTimers();
    toggleAlert('show text');

    expect(window.$).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith(ALERT_ELEMENT_ID);
    expect(clearTimeout).not.toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(mockSlideToggleFn).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(mockSlideToggleFn).toHaveBeenCalledTimes(2);
  });

  test('toggleAlert with a previous timeout', () => {
    jest.useFakeTimers();
    toggleAlert('show text');
    toggleAlert('show text');

    expect(clearTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(mockSlideToggleFn).toHaveBeenCalledTimes(2);
    jest.runAllTimers();
    expect(mockSlideToggleFn).toHaveBeenCalledTimes(3);
  });
});
