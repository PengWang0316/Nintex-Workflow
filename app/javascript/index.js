import { initialNWC } from './controllers/NWCController';
import searchWorkflows from './controllers/SearchWorkFlowController';
import { initialActionBtns } from './controllers/WorkflowActionController';
import { TOOLTIP_DATA_TOGGLE, SEARCH_BTN_ID, NAME_FILTER_ID } from './config';
import { fillTable, filterName } from './views/WorkflowTableView';

const handler = () => {
  // Initialize the tooltip
  $(TOOLTIP_DATA_TOGGLE).tooltip();
  // Initialize the NWC panel
  initialNWC();
  initialActionBtns();

  // Initialize an empty table
  fillTable([]);

  /* Register the listeners */
  // Search button
  $(SEARCH_BTN_ID).on('click', 'img', searchWorkflows);
  // Name filter input
  $(NAME_FILTER_ID).on('input', filterName);
};

handler();
