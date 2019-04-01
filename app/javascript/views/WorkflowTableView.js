import Tabulator from 'tabulator-tables';

import { WORKFLOW_TABLE_ID, NAME_FILTER_ID } from '../config';

let table;
const nameFilterInput = $(NAME_FILTER_ID);

const columns = [
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
    title: 'Last Edited', field: 'lastEdited', align: 'left', sorter: 'date', formatter: 'datetime',
  },
  {
    title: 'Edited By', field: 'editedBy', align: 'left', sorter: 'string',
  },
  {
    title: 'Actions',
    field: 'id',
    align: 'center',
    formatter(cell, formatterParams, onRendered) {
      // cell - the cell component
      // formatterParams - parameters set for the column
      // onRendered - function to call when the formatter has been rendered

      return '...'; // return the contents of the cell;
    },
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

export default fillTable;
