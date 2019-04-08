import { fetchWorkflows } from '../models/NWC';
import { fetchWorkflows as fetchOfficeWorkflows } from '../models/Office';
import { fillTable } from '../views/WorkflowTableView';
import { disableLoading, enableNormal } from '../views/SearchBtnView';

export const searchWorkflows = () => {
  disableLoading();
  // const nwcData = await fetchWorkflows();
  // const officeData = await fetchOfficeWorkflows();
  // fillTable([...nwcData, ...officeData]);
  // enableNormal();

  let nwcData;
  let officeData;
  // Use two promises and manually check result to make sure
  // the http calls for different sources will be issued parallelly.
  fetchWorkflows().then((data) => {
    nwcData = data;
    if (nwcData && officeData) {
      fillTable([...nwcData, ...officeData]);
      enableNormal();
    }
  });

  fetchOfficeWorkflows().then((data) => {
    officeData = data;
    if (nwcData && officeData) {
      fillTable([...nwcData, ...officeData]);
      enableNormal();
    }
  });
};

export default searchWorkflows;
