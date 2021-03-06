import { initialNWC } from './controllers/NWCController';
import { initialOffice } from './controllers/OfficeController';
import searchWorkflows from './controllers/SearchWorkFlowController';
import { initialActionBtns } from './controllers/WorkflowActionController';
import { handleClick } from './controllers/FetchBtnController';
import {
  TOOLTIP_DATA_TOGGLE, SEARCH_BTN_ID, NAME_FILTER_ID, AUTO_FETCHING_BTN_ID,
} from './config';
import { fillTable, filterName } from './views/WorkflowTableView';

const handler = () => {
  // Initialize the tooltip
  $(TOOLTIP_DATA_TOGGLE).tooltip();
  // Initialize the NWC panel
  initialNWC();
  // Initialize the Office 365 panel
  initialOffice();
  initialActionBtns();

  // Initialize an empty table
  fillTable([]);

  /* Register the listeners */
  // Search button
  $(SEARCH_BTN_ID).on('click', 'img', searchWorkflows);
  // Name filter input
  $(NAME_FILTER_ID).on('input', filterName);
  // Auto Fetching button
  $(AUTO_FETCHING_BTN_ID).on('click', handleClick);
};

handler();
