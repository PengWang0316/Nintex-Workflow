import { fetchWorkflows } from '../../app/javascript/models/NWC';
import { fillTable } from '../../app/javascript/views/WorkflowTableView';
import { disableLoading, enableNormal } from '../../app/javascript/views/SearchBtnView';

import { searchWorkflows } from '../../app/javascript/controllers/SearchWorkFlowController';

jest.mock('../../app/javascript/models/NWC', () => ({ fetchWorkflows: jest.fn().mockResolvedValue('data') }));
jest.mock('../../app/javascript/views/WorkflowTableView', () => ({ fillTable: jest.fn() }));
jest.mock('../../app/javascript/views/SearchBtnView', () => ({
  disableLoading: jest.fn(),
  enableNormal: jest.fn(),
}));

describe('SearchWorkFlowController', () => {
  test('searchWorkflows', async () => {
    await searchWorkflows();

    expect(disableLoading).toHaveBeenCalledTimes(1);
    expect(fetchWorkflows).toHaveBeenCalledTimes(1);
    expect(fillTable).toHaveBeenLastCalledWith('data');
    expect(fillTable).toHaveBeenCalledTimes(1);
    expect(enableNormal).toHaveBeenCalledTimes(1);
  });
});
