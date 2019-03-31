import {
  SEARCH_BTN_ID, SEARCH_IMG_ID, SEARCH_ICON, LOADING_ICON,
} from '../config';

export const disableLoading = () => {
  $(SEARCH_BTN_ID).prop('disabled', true);
  $(SEARCH_IMG_ID).attr('src', LOADING_ICON);
};

export const enableNormal = () => {
  $(SEARCH_BTN_ID).prop('disabled', false);
  $(SEARCH_IMG_ID).attr('src', SEARCH_ICON);
};
