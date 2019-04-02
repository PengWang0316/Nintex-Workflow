import { fetchWorkflows } from '../models/NWC';
import { fillTable } from '../views/WorkflowTableView';
import { disableLoading, enableNormal } from '../views/SearchBtnView';

export const searchWorkflows = async () => {
  disableLoading();
  const data = await fetchWorkflows();
  fillTable(data);
  enableNormal();
};

export default searchWorkflows;
