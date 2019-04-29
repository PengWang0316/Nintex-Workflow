import Tabulator from 'tabulator-tables';

import {
  WORKFLOW_TABLE_ID, NAME_FILTER_ID, TABLE_RADIO_NAME, NEW_ICON, SCORE_LOADING_ICON,
  NWC_PLATFORM, NWC_ICON, OFFICE_ICON, SECONDAY_INFO_DESCRIPTION_ID,
  SECONDAY_INFO_ID, SECONDAY_INFO_EVENTTYPE_ID, SECONDAY_INFO_TYPE_ID, SECONDAY_INFO_TENANT_ID,
} from '../config';
import { deactivate } from '../controllers/WorkflowActionController';
import { activateAct, deactivateAct, fetchHealthScores } from '../models/NWC';
import { toggleAlert } from './AlertView';

let table;
const nameFilterInput = $(NAME_FILTER_ID);

const columns = [
  {
    title: '',
    field: 'workflowId',
    align: 'right',
    width: 30,
    resizable: false,
    // frozen: true,
    headerSort: false,
    formatter(cell, formatterParams, onRendered) {
      // cell - the cell component
      // formatterParams - parameters set for the column
      // onRendered - function to call when the formatter has been rendered
      return `<input class="form-check-input" type="radio" name="${TABLE_RADIO_NAME}" value="${cell._cell.value}" />`; // return the contents of the cell;
    },
  },
  {
    title: '',
    field: 'platform',
    align: 'center',
    width: 40,
    resizable: false,
    headerSort: true,
    sorter: 'string',
    formatter(cell) {
      if (cell._cell.value === NEW_ICON) return `<img src="${NEW_ICON}" alt="new workflow" class="platform-icon" />`;
      return `<img src="${cell._cell.value === NWC_PLATFORM ? NWC_ICON : OFFICE_ICON}" alt="${cell._cell.value === NWC_PLATFORM ? 'NWC' : 'Office 365'}" class="platform-icon" />`;
    },
  },
  {
    title: 'Name', field: 'name', align: 'left', sorter: 'string',
  },
  {
    title: 'Department', field: 'department', align: 'left', sorter: 'string',
  },
  {
    title: 'Author', field: 'editedBy', align: 'left', sorter: 'string',
  },
  {
    title: 'Created', field: 'created', align: 'left', sorter: 'date', formatter: 'datetime',
  },
  {
    title: 'Health Scores',
    field: 'healthScores',
    align: 'center',
    // headerSort: true,
    // sorter: 'number',
    formatter(cell) {
      const { status, platform, healthScores } = cell._cell.row.data;
      if (!healthScores) return status === 'Published' && platform === NWC_PLATFORM ? '<button type="button" class="btn btn-light btn-sm">...</button>' : '';
      if (healthScores === SCORE_LOADING_ICON) return `<img src=${SCORE_LOADING_ICON} />`;
      return `
        <div><span class="badge badge-success mr-1">C ${healthScores.completed}</span><span class="badge badge-danger mr-1">F ${healthScores.failed}</span></div>
        <div>${healthScores.completed === 0 && healthScores.failed === 0 ? '--' : Math.floor((healthScores.completed / (healthScores.completed + healthScores.failed)) * 100)}%</div>
      `;
    },
  },
  {
    title: 'Active', field: 'active', align: 'left', sorter: 'string',
  },
  {
    title: 'Status', field: 'status', align: 'left', sorter: 'string',
  },
  { // A hidden column to track the row number in the table for updating.
    title: '',
    field: 'id',
    visible: false,
  },
  { // A hidden column to keep the secondary info.
    title: '',
    field: 'secondaryInfo',
    visible: false,
  },
  { // A hidden column to keep the tenant name.
    title: '',
    field: 'tenant',
    visible: false,
  },
];


export const fillTable = (data) => {
  table = new Tabulator(WORKFLOW_TABLE_ID, {
    pagination: 'local',
    paginationSize: 10,
    height: '100%',
    data,
    layout: 'fitColumns', // fit columns to width of table (optional)
    columns,
    rowClick: async ({ target }, row) => { // Handle showing secondary information modal
      // Disable the click on the first column
      if (target.tagName === 'INPUT' || target.firstChild.tagName === 'INPUT') return;
      if (target.tagName === 'BUTTON') {
        // Change button to a loading icon
        row.update({ healthScores: SCORE_LOADING_ICON });
        const { workflowId, tenant } = row._row.data;
        // Fetch and update the health scores
        row.update({ healthScores: await fetchHealthScores(workflowId, tenant) });
      } else if (target.attributes[2].nodeValue === 'active') {
        // Active or deactive when click on the Active column
        if (target.innerText === 'true') {
          deactivateAct(row._row.data.workflowId, row._row.data.tenant);
          row.update({ active: 'false' });
          toggleAlert('The workflow has been deactivated successfully');
        } else if (target.innerText === 'false') {
          activateAct(row._row.data.workflowId, row._row.data.tenant);
          row.update({ active: 'true' });
          toggleAlert('The workflow has been activated successfully');
        }
      } else {
        // Show the secondary info modal
        const {
          type, eventType, tenant, description,
        } = JSON.parse(row._row.data.secondaryInfo);
        $(SECONDAY_INFO_EVENTTYPE_ID).text(eventType);
        $(SECONDAY_INFO_TYPE_ID).text(type);
        $(SECONDAY_INFO_TENANT_ID).text(tenant);
        $(SECONDAY_INFO_DESCRIPTION_ID).text(description);
        $(SECONDAY_INFO_ID).modal('toggle');
      }
    },
  });
};

export const filterName = () => {
  if (table && nameFilterInput) table.setFilter('name', 'like', nameFilterInput.val());
};

export const updateActiveColumn = (activeElement) => {
  activeElement.innerText = activeElement.innerText === 'true' ? 'false' : 'true';
};

export const removeRow = (rowNum) => {
  if (table) table.deleteRow(rowNum);
};

export const addNewData = (data) => {
  if (table) data.reverse().forEach((rowData) => {
    table.addRow(rowData, true);
    const row = table.getRow(0);
    // Deactive if it is a published workflow
    if (row._row.data.status === 'Published') {
      deactivate(row._row.data.workflowId, row._row.data.tenant);
      row.update({ active: 'false' });
    }
    // update the platform icon to a new icon
    row.update({ platform: NEW_ICON });
    // Update the background color
    // This is like a hack way to do this :)
    // TODO: Change it
    $($('.tabulator-row')[0]).addClass('newRow');
  });
};

export const updateHealthScore = (existedNWCWorkflows) => {
  const data = table.getData();
  const updateData = [];
  data.forEach((row) => {
    if (existedNWCWorkflows[row.workflowId] && existedNWCWorkflows[row.workflowId].completed !== null && existedNWCWorkflows[row.workflowId].failed !== null) {
      updateData.push({
        id: row.id,
        healthScores: { completed: existedNWCWorkflows[row.workflowId].completed, failed: existedNWCWorkflows[row.workflowId].failed },
      });
    }
  });
  console.log(updateData);
  table.updateData(updateData);
};
