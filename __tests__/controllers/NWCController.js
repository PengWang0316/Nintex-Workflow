import { fetchNWCApis, removeNWCApi, addNWCApi } from '../../app/javascript/models/NWC';
import {
  initialNWCApiView, toggleRemoveAlert, toggleAddModal, disableSaveBtn, enableSaveBtn, appendBadge,
} from '../../app/javascript/views/NWCApiView';
import {
  DELETE_CONFIRM_BTN_ID, ADD_NWC_BTN_ID, ADD_NWC_NAME_ID,
  ADD_NWC_KEY_ID, ADD_NWC_CONFIRM_BTN_ID, RM_BTN_CLASS,
} from '../../app/javascript/config';

import {
  removeNWCKey, confirmRm, initialNWC, checkInputListener, addNwcApiListener,
} from '../../app/javascript/controllers/NWCController';

// Mock $ operator for jQuery
window.$ = jest.fn().mockReturnValue({
  attr: jest.fn().mockReturnValue('attrReturn'),
  val: jest.fn().mockReturnValue(' valReturn '),
  on: jest.fn(),
  detach: jest.fn(),
});

jest.mock('../../app/javascript/models/NWC', () => ({
  fetchNWCApis: jest.fn().mockReturnValue(null),
  removeNWCApi: jest.fn(),
  addNWCApi: jest.fn(),
}));
jest.mock('../../app/javascript/views/NWCApiView', () => ({
  initialNWCApiView: jest.fn(),
  toggleRemoveAlert: jest.fn(),
  toggleAddModal: jest.fn(),
  disableSaveBtn: jest.fn(),
  enableSaveBtn: jest.fn(),
  appendBadge: jest.fn(),
}));

describe('NWCController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('removeNWCKey', () => {
    removeNWCKey({ target: 'target' });

    expect(window.$).toHaveBeenCalledTimes(2);
    expect(window.$).toHaveBeenNthCalledWith(1, DELETE_CONFIRM_BTN_ID);
    expect(window.$).toHaveBeenNthCalledWith(2, 'target');
    const { attr } = window.$();
    expect(attr).toHaveBeenCalledTimes(2);
    expect(attr).toHaveBeenNthCalledWith(1, 'data-key');
    expect(attr).toHaveBeenNthCalledWith(2, 'data-key', 'attrReturn');
    expect(toggleRemoveAlert).toHaveBeenCalledTimes(1);
  });

  test('checkInputListener with non empty key and name', () => {
    checkInputListener();

    expect(window.$).toHaveBeenCalledTimes(2);
    expect(window.$).toHaveBeenNthCalledWith(1, ADD_NWC_NAME_ID);
    expect(window.$).toHaveBeenNthCalledWith(2, ADD_NWC_KEY_ID);
    expect(enableSaveBtn).toHaveBeenCalledTimes(1);
    expect(disableSaveBtn).not.toHaveBeenCalled();
  });

  test('checkInputListener with empty key or name', () => {
    const { val } = window.$();
    val.mockReturnValueOnce('  ');
    val.mockReturnValueOnce(' aaa ');
    checkInputListener();

    expect(window.$).toHaveBeenCalledTimes(3);
    expect(window.$).toHaveBeenNthCalledWith(2, ADD_NWC_NAME_ID);
    expect(window.$).toHaveBeenNthCalledWith(3, ADD_NWC_KEY_ID);
    expect(disableSaveBtn).toHaveBeenCalledTimes(1);
    expect(enableSaveBtn).not.toHaveBeenCalled();

    jest.clearAllMocks();
    val.mockReturnValueOnce(' aaa ');
    val.mockReturnValueOnce('  ');
    checkInputListener();
    expect(disableSaveBtn).toHaveBeenCalledTimes(1);
    expect(enableSaveBtn).not.toHaveBeenCalled();
  });

  test('addNwcApiListener', () => {
    addNwcApiListener();

    expect(window.$).toHaveBeenCalledTimes(3);
    expect(window.$).toHaveBeenNthCalledWith(1, ADD_NWC_NAME_ID);
    expect(window.$).toHaveBeenNthCalledWith(2, ADD_NWC_KEY_ID);
    expect(window.$).toHaveBeenNthCalledWith(3, `.${RM_BTN_CLASS}`);
    expect(addNWCApi).toHaveBeenCalledTimes(1);
    expect(addNWCApi).toHaveBeenLastCalledWith(' valReturn ', ' valReturn ');
    expect(appendBadge).toHaveBeenCalledTimes(1);
    expect(appendBadge).toHaveBeenLastCalledWith(' valReturn ');
    const { on, val } = window.$();
    expect(on).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenLastCalledWith('click', removeNWCKey);
    expect(val).toHaveBeenCalledTimes(5);
    expect(val).toHaveBeenNthCalledWith(1);
    expect(val).toHaveBeenNthCalledWith(2);
    expect(val).toHaveBeenNthCalledWith(3);
    expect(val).toHaveBeenNthCalledWith(4, '');
    expect(val).toHaveBeenNthCalledWith(5, '');
    expect(toggleAddModal).toHaveBeenCalledTimes(1);
  });

  test('confirmRm', () => {
    confirmRm({ target: 'target' });

    expect(window.$).toHaveBeenCalledTimes(2);
    expect(window.$).toHaveBeenNthCalledWith(1, 'target');
    expect(window.$).toHaveBeenNthCalledWith(2, '#nwc_attrReturn');
    const { attr, detach } = window.$();
    expect(attr).toHaveBeenCalledTimes(1);
    expect(attr).toHaveBeenLastCalledWith('data-key');
    expect(detach).toHaveBeenCalledTimes(1);
    expect(toggleRemoveAlert).toHaveBeenCalledTimes(1);
    expect(removeNWCApi).toHaveBeenCalledTimes(1);
    expect(removeNWCApi).toHaveBeenLastCalledWith('attrReturn');
  });

  test('initialNWC with null and zero key', () => {
    initialNWC();

    expect(initialNWCApiView).not.toHaveBeenCalled();

    fetchNWCApis.mockReturnValueOnce({});
    initialNWC();

    expect(initialNWCApiView).not.toHaveBeenCalled();
  });

  test('initialNWC', () => {
    fetchNWCApis.mockReturnValueOnce({ key: 'key' });
    initialNWC();

    expect(initialNWCApiView).toHaveBeenCalledTimes(1);
    expect(initialNWCApiView).toHaveBeenLastCalledWith({ key: 'key' });
    expect(window.$).toHaveBeenCalledTimes(6);
    expect(window.$).toHaveBeenNthCalledWith(1, `.${RM_BTN_CLASS}`);
    expect(window.$).toHaveBeenNthCalledWith(2, ADD_NWC_BTN_ID);
    expect(window.$).toHaveBeenNthCalledWith(3, ADD_NWC_NAME_ID);
    expect(window.$).toHaveBeenNthCalledWith(4, ADD_NWC_KEY_ID);
    expect(window.$).toHaveBeenNthCalledWith(5, ADD_NWC_CONFIRM_BTN_ID);
    expect(window.$).toHaveBeenNthCalledWith(6, DELETE_CONFIRM_BTN_ID);
    const { on } = window.$();
    expect(on).toHaveBeenCalledTimes(6);
    expect(on).toHaveBeenNthCalledWith(1, 'click', removeNWCKey);
    expect(on).toHaveBeenNthCalledWith(2, 'click', toggleAddModal);
    expect(on).toHaveBeenNthCalledWith(3, 'input', checkInputListener);
    expect(on).toHaveBeenNthCalledWith(4, 'input', checkInputListener);
    expect(on).toHaveBeenNthCalledWith(5, 'click', addNwcApiListener);
    expect(on).toHaveBeenNthCalledWith(6, 'click', confirmRm);
  });
});
