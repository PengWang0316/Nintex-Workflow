import Tabulator from 'tabulator-tables';

import { WORKFLOW_TABLE_ID, NAME_FILTER_ID, TABLE_RADIO_NAME } from '../config';

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
      return `<input class="form-check-input" type="radio" name="${TABLE_RADIO_NAME}" value="${cell._cell.value}">`; // return the contents of the cell;
    },
  },
  {
    title: 'Tenant', field: 'tenant', align: 'left', sorter: 'string',
  },
  {
    title: 'Name', field: 'name', align: 'left', sorter: 'string',
  },
  {
    title: 'Event Type', field: 'eventType', align: 'left', sorter: 'string',
  },
  {
    title: 'Type', field: 'type', align: 'left', sorter: 'string',
  },
  {
    title: 'Status', field: 'status', align: 'left', sorter: 'string',
  },
  {
    title: 'Active', field: 'active', align: 'left', sorter: 'string',
  },
  {
    title: 'Last Edited', field: 'lastEdited', align: 'left', sorter: 'date', formatter: 'datetime',
  },
  {
    title: 'Edited By', field: 'editedBy', align: 'left', sorter: 'string',
  },
  { // A hidden column to track the row number in the table for updating.
    title: '',
    field: 'id',
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
