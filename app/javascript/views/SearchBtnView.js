import {
  SEARCH_BTN_ID, SEARCH_IMG_ID, SEARCH_ICON, LOADING_ICON,
} from '../config';

const searchBtn = $(SEARCH_BTN_ID);
const searchImg = $(SEARCH_IMG_ID);

export const disableLoading = () => {
  searchBtn.tooltip('hide');
  searchBtn.prop('disabled', true);
  searchImg.attr('src', LOADING_ICON);
};

export const enableNormal = () => {
  searchBtn.prop('disabled', false);
  searchImg.attr('src', SEARCH_ICON);
};
