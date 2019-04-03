import { fetchWorkflows } from '../models/NWC';
import { fetchWorkflows as fetchOfficeWorkflows } from '../models/Office';
import { fillTable } from '../views/WorkflowTableView';
import { disableLoading, enableNormal } from '../views/SearchBtnView';

export const searchWorkflows = async () => {
  disableLoading();
  const nwcData = await fetchWorkflows();
  const officeData = await fetchOfficeWorkflows();
  fillTable([...nwcData, ...officeData]);
  // fillTable(nwcData);
  enableNormal();
};

export default searchWorkflows;
