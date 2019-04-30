import { fetchWorkflows, fetchHealthScore, insertNWCWorkflows } from '../models/NWC';
import { fetchWorkflows as fetchOfficeWorkflows, insertOfficeWorkflows } from '../models/Office';
import { fillTable, updateHealthScore, updateOfficeDepartment } from '../views/WorkflowTableView';
import { disableLoading, enableNormal } from '../views/SearchBtnView';

export const searchWorkflows = async () => {
  disableLoading();
  // const nwcData = await fetchWorkflows();
  // const officeData = await fetchOfficeWorkflows();
  // fillTable([...nwcData, ...officeData]);
  // enableNormal();

  const data = await Promise.all([fetchWorkflows(), fetchOfficeWorkflows()]);
  fillTable([...data[0], ...data[1]]);

  if (data[0].length !== 0) {
    const existedNWCWorkflows = (await fetchHealthScore(data[0].map(({ workflowId }) => workflowId))).data;
    // Transfer it to an object
    const existedNWCWorkflowsObj = {};
    existedNWCWorkflows.forEach((workflow) => {
      existedNWCWorkflowsObj[workflow.id] = { completed: workflow.completed, failed: workflow.failed, department: workflow.department };
    });
    // Update the table data with the score info
    updateHealthScore(existedNWCWorkflowsObj);
    // Compare and issue a insert API call
    insertNWCWorkflows(data[0], existedNWCWorkflowsObj);
  }
  // TODO: make insertOfficeWorkflows separately with the getDepartment API to unblock user's interface
  if (data[1].length !== 0) updateOfficeDepartment(await insertOfficeWorkflows(data[1]), data[1]);

  enableNormal();

  // let nwcData;
  // let officeData;
  // // Use two promises and manually check result to make sure
  // // the http calls for different sources will be issued parallelly.
  // fetchWorkflows().then((data) => {
  //   nwcData = data;
  //   if (nwcData && officeData) {
  //     fillTable([...nwcData, ...officeData]);
  //     enableNormal();
  //   }
  // });

  // fetchOfficeWorkflows().then((data) => {
  //   officeData = data;
  //   if (nwcData && officeData) {
  //     fillTable([...nwcData, ...officeData]);
  //     enableNormal();
  //   }
  // });
};

export default searchWorkflows;
