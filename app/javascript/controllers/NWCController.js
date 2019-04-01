import { fetchNWCApis, removeNWCApi, addNWCApi } from '../models/NWC';
import {
  initialNWCApiView, toggleRemoveAlert, toggleAddModal, disableSaveBtn, enableSaveBtn, appendBadge,
} from '../views/NWCApiView';
import {
  DELETE_CONFIRM_BTN_ID, ADD_NWC_BTN_ID, ADD_NWC_NAME_ID,
  ADD_NWC_KEY_ID, ADD_NWC_CONFIRM_BTN_ID, RM_BTN_CLASS,
} from '../config';

export const removeNWCKey = ({ target }) => {
  // Bind the delete confirm button with the right key
  $(DELETE_CONFIRM_BTN_ID).attr('data-key', $(target).attr('data-key'));
  toggleRemoveAlert();
};

/**
 * Check the name and key input to disable the confirm button when they are empty
 */
const checkInput = () => {
  const name = $(ADD_NWC_NAME_ID).val().trim();
  const key = $(ADD_NWC_KEY_ID).val().trim();
  if (name !== '' && key !== '') enableSaveBtn();
  else disableSaveBtn();
};

const addNwcApi = () => {
  const nameElement = $(ADD_NWC_NAME_ID);
  const keyElement = $(ADD_NWC_KEY_ID);
  addNWCApi(nameElement.val(), keyElement.val());
  appendBadge(nameElement.val());

  // Add remove button listener
  $(`.${RM_BTN_CLASS}`).on('click', removeNWCKey);

  // Clear name and key input
  nameElement.val('');
  keyElement.val('');

  toggleAddModal();
};

export const confirmRm = ({ target }) => {
  const key = $(target).attr('data-key');
  $(`#nwc_${key}`).detach();
  toggleRemoveAlert();
  removeNWCApi(key);
};

export const initialNWC = () => {
  const nwcKeys = fetchNWCApis();
  initialNWCApiView(nwcKeys);
  // Add listeners
  $(`.${RM_BTN_CLASS}`).on('click', removeNWCKey);
  $(ADD_NWC_BTN_ID).on('click', toggleAddModal);
  $(ADD_NWC_NAME_ID).on('input', checkInput);
  $(ADD_NWC_KEY_ID).on('input', checkInput);
  $(ADD_NWC_CONFIRM_BTN_ID).on('click', addNwcApi);
  $(DELETE_CONFIRM_BTN_ID).on('click', confirmRm);
};

export const addNWCKey = () => {};
