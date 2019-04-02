import {
  ACTIVATE_ACT_ID, EXPORT_ACT_ID,
  MOVE_ACT_ID, DELETE_ACT_ID, TABLE_RADIO_NAME,
} from '../../app/javascript/config';
import {
  activateAct, deactivateAct, exportDraftAct, exportPublishedAct, deleteWorkflowAct,
} from '../../app/javascript/models/NWC';
import { updateActiveColumn, removeRow } from '../../app/javascript/views/WorkflowTableView';
import { toggleAlert } from '../../app/javascript/views/AlertView';

import {
  toggleActivateAct, exportAct, moveAct, deleteAct, initialActionBtns,
} from '../../app/javascript/controllers/WorkflowActionController';

const mockRowElement = {
  childNodes: [
    {},
    { innerText: 'tenantName' },
    {},
    {},
    {},
    { innerText: 'Draft' },
    { innerText: '' },
    {},
    {},
    { innerText: 'rowId' },
  ],
};

const mockVal = jest.fn().mockReturnValue('workflowId');

// Mock $ operator for jQuery
window.$ = jest.fn().mockReturnValue({
  on: jest.fn(),
  val: mockVal,
  parent: jest.fn().mockReturnValue({ parent: jest.fn().mockReturnValue([mockRowElement]) }),
});

jest.mock('../../app/javascript/models/NWC', () => ({
  activateAct: jest.fn(),
  deactivateAct: jest.fn(),
  exportDraftAct: jest.fn(),
  exportPublishedAct: jest.fn(),
  deleteWorkflowAct: jest.fn(),
}));
jest.mock('../../app/javascript/views/WorkflowTableView', () => ({
  updateActiveColumn: jest.fn(),
  removeRow: jest.fn(),
}));
jest.mock('../../app/javascript/views/AlertView', () => ({ toggleAlert: jest.fn() }));

describe('WorkflowActionController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('toggleActivateAct without workflowId', () => {
    mockVal.mockReturnValueOnce('');
    toggleActivateAct();

    expect(window.$).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith(`input[name='${TABLE_RADIO_NAME}']:checked`);
    const { val, parent } = window.$();
    expect(val).toHaveBeenCalledTimes(1);
    expect(parent).toHaveBeenCalledTimes(1);
    expect(parent().parent).toHaveBeenCalledTimes(1);
    expect(activateAct).not.toHaveBeenCalled();
    expect(deactivateAct).not.toHaveBeenCalled();
    expect(toggleAlert).not.toHaveBeenCalled();
    expect(updateActiveColumn).not.toHaveBeenCalled();
  });

  test('toggleActivateAct without activeElement text', () => {
    toggleActivateAct();

    expect(window.$).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith(`input[name='${TABLE_RADIO_NAME}']:checked`);
    const { val, parent } = window.$();
    expect(val).toHaveBeenCalledTimes(1);
    expect(parent).toHaveBeenCalledTimes(1);
    expect(parent().parent).toHaveBeenCalledTimes(1);
    expect(activateAct).not.toHaveBeenCalled();
    expect(deactivateAct).not.toHaveBeenCalled();
    expect(toggleAlert).not.toHaveBeenCalled();
    expect(updateActiveColumn).not.toHaveBeenCalled();
  });

  test('toggleActivateAct without activeElement text false', () => {
    mockRowElement.childNodes[6].innerText = 'false';
    toggleActivateAct();

    expect(window.$).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith(`input[name='${TABLE_RADIO_NAME}']:checked`);
    const { val, parent } = window.$();
    expect(val).toHaveBeenCalledTimes(1);
    expect(parent).toHaveBeenCalledTimes(1);
    expect(parent().parent).toHaveBeenCalledTimes(1);
    expect(activateAct).toHaveBeenCalledTimes(1);
    expect(activateAct).toHaveBeenLastCalledWith('workflowId', 'tenantName');
    expect(deactivateAct).not.toHaveBeenCalled();
    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('The workflow has been activated successfully');
    expect(updateActiveColumn).toHaveBeenCalledTimes(1);
    expect(updateActiveColumn).toHaveBeenLastCalledWith(mockRowElement.childNodes[6]);
  });

  test('toggleActivateAct without activeElement text true', () => {
    mockRowElement.childNodes[6].innerText = 'true';
    toggleActivateAct();

    expect(window.$).toHaveBeenCalledTimes(1);
    expect(window.$).toHaveBeenLastCalledWith(`input[name='${TABLE_RADIO_NAME}']:checked`);
    const { val, parent } = window.$();
    expect(val).toHaveBeenCalledTimes(1);
    expect(parent).toHaveBeenCalledTimes(1);
    expect(parent().parent).toHaveBeenCalledTimes(1);
    expect(activateAct).not.toHaveBeenCalled();
    expect(deactivateAct).toHaveBeenCalledTimes(1);
    expect(deactivateAct).toHaveBeenLastCalledWith('workflowId', 'tenantName');
    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('The workflow has been deactivated successfully');
    expect(updateActiveColumn).toHaveBeenCalledTimes(1);
    expect(updateActiveColumn).toHaveBeenLastCalledWith(mockRowElement.childNodes[6]);
  });

  test('exportAct draft', () => {
    exportAct();

    expect(exportDraftAct).toHaveBeenCalledTimes(1);
    expect(exportDraftAct).toHaveBeenLastCalledWith('workflowId', 'tenantName');
    expect(exportPublishedAct).not.toHaveBeenCalled();
    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('The workflow has been exported successfully');
  });

  test('exportAct published', () => {
    mockRowElement.childNodes[5].innerText = 'published';
    exportAct();

    expect(exportPublishedAct).toHaveBeenCalledTimes(1);
    expect(exportPublishedAct).toHaveBeenLastCalledWith('workflowId', 'tenantName');
    expect(exportDraftAct).not.toHaveBeenCalled();
    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('The workflow has been exported successfully');
  });

  test('moveAct', () => {
    moveAct();

    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('No implement yet!');
  });

  test('deleteAct', () => {
    deleteAct();

    expect(removeRow).toHaveBeenCalledTimes(1);
    expect(removeRow).toHaveBeenLastCalledWith('rowId');
    expect(deleteWorkflowAct).toHaveBeenCalledTimes(1);
    expect(deleteWorkflowAct).toHaveBeenLastCalledWith('workflowId', 'tenantName');
    expect(toggleAlert).toHaveBeenCalledTimes(1);
    expect(toggleAlert).toHaveBeenLastCalledWith('The workflow has been deleted successfully');
  });

  test('initialActionBtns', () => {
    initialActionBtns();

    expect(window.$).toHaveBeenCalledTimes(4);
    const { on } = window.$();
    expect(on).toHaveBeenNthCalledWith(1, 'click', toggleActivateAct);
    expect(on).toHaveBeenNthCalledWith(2, 'click', exportAct);
    expect(on).toHaveBeenNthCalledWith(3, 'click', moveAct);
    expect(on).toHaveBeenNthCalledWith(4, 'click', deleteAct);
  });
});
