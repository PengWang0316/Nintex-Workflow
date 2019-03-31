import Tabulator from 'tabulator-tables';

import { WORKFLOW_TABLE_ID } from '../config';

let table;

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
    title: 'Last Edited', field: 'lastEdited', align: 'left', sorter: 'date',
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
    height: '100%',
    data,
    layout: 'fitColumns', // fit columns to width of table (optional)
    columns,
  });
};

export default fillTable;