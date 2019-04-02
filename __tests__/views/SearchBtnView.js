import {
  SEARCH_BTN_ID, SEARCH_IMG_ID, SEARCH_ICON, LOADING_ICON,
} from '../../app/javascript/config';

import { disableLoading, enableNormal } from '../../app/javascript/views/SearchBtnView';

const mockPropFn = jest.fn();
const mockAttrFn = jest.fn();
// Mock $ operator for jQuery
window.$ = jest.fn().mockReturnValue({
  prop: mockPropFn,
  attr: mockAttrFn,
});

describe('SearchBtnView', () => {
  beforeEach(() => jest.clearAllMocks());

  test('disableLoading', () => {
    disableLoading();

    expect(mockPropFn).toHaveBeenCalledTimes(1);
    expect(mockPropFn).toHaveBeenLastCalledWith('disabled', true);
    expect(mockAttrFn).toHaveBeenCalledTimes(1);
    expect(mockAttrFn).toHaveBeenLastCalledWith('src', LOADING_ICON);
  });

  test('enableNormal', () => {
    enableNormal();

    expect(mockPropFn).toHaveBeenCalledTimes(1);
    expect(mockPropFn).toHaveBeenLastCalledWith('disabled', false);
    expect(mockAttrFn).toHaveBeenCalledTimes(1);
    expect(mockAttrFn).toHaveBeenLastCalledWith('src', SEARCH_ICON);
  });
});
