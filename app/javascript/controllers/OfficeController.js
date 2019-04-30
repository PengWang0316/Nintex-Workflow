import {
  fetchOfficeApis, removeOfficeApi, addOfficeApi, fetchOfficeAvatars,
} from '../models/Office';
import {
  initialOfficeApiView, toggleRemoveAlert, toggleAddModal, disableSaveBtn, enableSaveBtn, appendBadge,
} from '../views/OfficeApiView';
import {
  DELETE_CONFIRM_BTN_ID, ADD_OFFICE_BTN_ID, ADD_OFFICE_NAME_ID, OFFICE_AVATAR_SELECT_ID,
  ADD_OFFICE_KEY_ID, ADD_OFFICE_CONFIRM_BTN_ID, RM_OFFICE_BTN_CLASS, ADD_OFFICE_COOKIE_ID,
} from '../config';

export const removeOfficeKey = ({ target }) => {
  // Bind the delete confirm button with the right key
  $(DELETE_CONFIRM_BTN_ID).attr('data-key', $(target).attr('data-key'));
  toggleRemoveAlert();
};

/**
 * Check the name and key input to disable the confirm button when they are empty
 */
export const checkInputListener = () => {
  const name = $(ADD_OFFICE_NAME_ID).val().trim();
  const key = $(ADD_OFFICE_KEY_ID).val().trim();
  const cookie = $(ADD_OFFICE_COOKIE_ID).val().trim();
  if (name !== '' && key !== '' && cookie !== '') enableSaveBtn();
  else disableSaveBtn();
};

export const addNwcApiListener = () => {
  const nameElement = $(ADD_OFFICE_NAME_ID);
  const keyElement = $(ADD_OFFICE_KEY_ID);
  const cookieElement = $(ADD_OFFICE_COOKIE_ID);
  const avatarElement = $(OFFICE_AVATAR_SELECT_ID);
  addOfficeApi(nameElement.val(), keyElement.val(), cookieElement.val(), avatarElement.val());
  appendBadge(nameElement.val(), avatarElement.val());

  // Add remove button listener
  $(`.${RM_OFFICE_BTN_CLASS}`).on('click', removeOfficeKey);

  // Clear name and key input
  nameElement.val('');
  keyElement.val('');
  cookieElement.val('');
  toggleAddModal();
};

export const confirmRm = ({ target }) => {
  const key = $(target).attr('data-key');
  $(`#office_${key.replace(/\./g, '\\.')}`).detach();
  toggleRemoveAlert();
  removeOfficeApi(key);
};

export const initialOffice = () => {
  const officeKeys = fetchOfficeApis() || {};
  const avatars = fetchOfficeAvatars() || {};
  if (officeKeys && Object.keys(officeKeys).length !== 0) initialOfficeApiView(officeKeys, avatars);
  // Add listeners
  $(`.${RM_OFFICE_BTN_CLASS}`).on('click', removeOfficeKey);
  $(ADD_OFFICE_BTN_ID).on('click', toggleAddModal);
  $(ADD_OFFICE_NAME_ID).on('input', checkInputListener);
  $(ADD_OFFICE_KEY_ID).on('input', checkInputListener);
  $(ADD_OFFICE_COOKIE_ID).on('input', checkInputListener);
  $(ADD_OFFICE_CONFIRM_BTN_ID).on('click', addNwcApiListener);
  $(DELETE_CONFIRM_BTN_ID).on('click', confirmRm);
};
