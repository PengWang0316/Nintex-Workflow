import { fetchNWCApis, removeNWCApi } from '../models/NWC';
import { initialNWCApiView, toggleRemoveAlert } from '../views/NWCApiView';
import { DELETE_CONFIRM_BTN_ID } from '../config';

export const initialNWC = () => {
  const nwcKeys = fetchNWCApis();
  initialNWCApiView(nwcKeys);
};

export const removeNWCKey = ({ target }) => {
  // Bind the delete confirm button with the right key
  $(DELETE_CONFIRM_BTN_ID).attr('data-key', $(target).attr('data-key'));
  toggleRemoveAlert();
};

export const confirmRm = ({ target }) => {
  const key = $(target).attr('data-key');
  $(`#nwc_${key}`).detach();
  toggleRemoveAlert();
  removeNWCApi(key);
};

export const addNWCKey = () => {};
