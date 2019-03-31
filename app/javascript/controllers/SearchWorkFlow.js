import { fetchWorkflows } from '../models/NWC';

import { fillTable } from '../views/WorkflowTableView';

export const searchWorkflows = async () => {
  const data = await fetchWorkflows();
  fillTable(data);
};

export default searchWorkflows;
