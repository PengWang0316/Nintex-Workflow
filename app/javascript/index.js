import {
  initialNWC, removeNWCKey, addNWCKey, confirmRm,
} from './controllers/NWCController';
import searchWorkflows from './controllers/SearchWorkFlowController';
import {
  TOOLTIP_DATA_TOGGLE, SEARCH_BTN_ID, RM_BTN_CLASS, DELETE_CONFIRM_BTN_ID,
} from './config';
import { fillTable } from './views/WorkflowTableView';

const handler = () => {
  // Initialize the tooltip
  $(TOOLTIP_DATA_TOGGLE).tooltip();
  // Initialize the NWC panel
  initialNWC();

  // Initialize an empty table
  fillTable([]);

  /* Register the listeners */
  // Search button
  $(SEARCH_BTN_ID).on('click', 'img', searchWorkflows);
  // Remove buttons
  $(`.${RM_BTN_CLASS}`).on('click', removeNWCKey);
  // Confirm remove MWC Button
  $(DELETE_CONFIRM_BTN_ID).on('click', confirmRm);
};

handler();
