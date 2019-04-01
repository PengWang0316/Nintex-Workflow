import { initialNWC } from '../app/javascript/controllers/NWCController';
import searchWorkflows from '../app/javascript/controllers/SearchWorkFlowController';
import { initialActionBtns } from '../app/javascript/controllers/WorkflowActionController';
import { TOOLTIP_DATA_TOGGLE, SEARCH_BTN_ID, NAME_FILTER_ID } from '../app/javascript/config';
import { fillTable, filterName } from '../app/javascript/views/WorkflowTableView';

// Mock $ operator for jQuery
window.$ = jest.fn().mockReturnValue({
  tooltip: jest.fn(),
  on: jest.fn(),
});

jest.mock('../app/javascript/controllers/NWCController', () => ({ initialNWC: jest.fn() }));
jest.mock('../app/javascript/controllers/SearchWorkFlowController', () => jest.fn());
jest.mock('../app/javascript/controllers/WorkflowActionController', () => ({ initialActionBtns: jest.fn() }));
jest.mock('../app/javascript/views/WorkflowTableView', () => ({ fillTable: jest.fn(), filterName: jest.fn() }));

describe('index.js', () => {
  beforeEach(() => jest.clearAllMocks());

  test('handler', () => {
    require('../app/javascript/index');

    expect(window.$).toHaveBeenCalledTimes(3);
    expect(window.$).toHaveBeenNthCalledWith(1, TOOLTIP_DATA_TOGGLE);
    expect(window.$).toHaveBeenNthCalledWith(2, SEARCH_BTN_ID);
    expect(window.$).toHaveBeenNthCalledWith(3, NAME_FILTER_ID);
    expect(window.$().tooltip).toHaveBeenCalledTimes(1);
    expect(window.$().on).toHaveBeenCalledTimes(2);
    expect(window.$().on).toHaveBeenNthCalledWith(1, 'click', 'img', searchWorkflows);
    expect(window.$().on).toHaveBeenNthCalledWith(2, 'input', filterName);
    expect(initialNWC).toHaveBeenCalledTimes(1);
    expect(initialActionBtns).toHaveBeenCalledTimes(1);
    expect(fillTable).toHaveBeenCalledTimes(1);
    expect(fillTable).toHaveBeenLastCalledWith([]);
  });
});
