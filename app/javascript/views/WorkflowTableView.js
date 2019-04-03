import Tabulator from 'tabulator-tables';

import {
  WORKFLOW_TABLE_ID, NAME_FILTER_ID, TABLE_RADIO_NAME,
  NWC_PLATFORM, NWC_ICON, OFFICE_ICON, SECONDAY_INFO_DESCRIPTION_ID,
  SECONDAY_INFO_ID, SECONDAY_INFO_EVENTTYPE_ID, SECONDAY_INFO_TYPE_ID, SECONDAY_INFO_TENANT_ID,
} from '../config';
import { deactivate } from '../controllers/WorkflowActionController';

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
    title: 'Health Scores', field: 'healthScores', align: 'left', sorter: 'string',
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
    rowClick: (e, row) => { // Handle showing secondary information modal
      const {
        type, eventType, tenant, description,
      } = JSON.parse(row._row.data.secondaryInfo);
      $(SECONDAY_INFO_EVENTTYPE_ID).text(eventType);
      $(SECONDAY_INFO_TYPE_ID).text(type);
      $(SECONDAY_INFO_TENANT_ID).text(tenant);
      $(SECONDAY_INFO_DESCRIPTION_ID).text(description);
      $(SECONDAY_INFO_ID).modal('toggle');
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
    if (row._row.data.status === 'Published') {
      deactivate(row._row.data.workflowId, row._row.data.tenant);
      row.update({ active: 'false' });
    }
  });
};
