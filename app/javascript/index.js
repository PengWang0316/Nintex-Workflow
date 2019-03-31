import initialNWC from './controllers/InitialNWC';
import searchWorkflows from './controllers/SearchWorkFlow';
import { TOOLTIP_DATA_TOGGLE, SEARCH_BTN_ID } from './config';

const handler = () => {
  // Initialize the tooltip
  $(TOOLTIP_DATA_TOGGLE).tooltip();
  // Initialize the NWC panel
  initialNWC();

  /* Register the listeners */
  // Search button
  $(SEARCH_BTN_ID).on('click', 'img', searchWorkflows);
};

handler();
