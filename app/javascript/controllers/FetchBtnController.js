import { fetchNewWorkflows } from '../models/NWC';
import { addNewData } from '../views/WorkflowTableView';

import { FETCHING_INTERVAL } from '../config';

let fetchTimeoutFn = null;

export const handleClick = () => {
  if (fetchTimeoutFn !== null) {
    clearInterval(fetchTimeoutFn);
    fetchTimeoutFn = null;
  } else {
    fetchTimeoutFn = setInterval(async () => {
      const newData = await fetchNewWorkflows();
      addNewData(newData);
    }, FETCHING_INTERVAL);
  }
};

export default handleClick;
