import {
  OFFICE_ID, RM_ALERT_ID, RM_OFFICE_BTN_CLASS, ADD_OFFICE_API_ID, ADD_OFFICE_CONFIRM_BTN_ID,
} from '../config';
import styles from '../../css/ApiView.module.css';

const getBadgeHtml = key => `<span class="${styles.badge}" id="office_${key}">
                              ${key}<span data-key=${key} class="btn ml-2 ${styles.removeBtn} ${RM_OFFICE_BTN_CLASS}">X</span>
                            </span>`;

export const initialOfficeApiView = (apiKeys) => {
  const viewArr = Object.keys(apiKeys).map(getBadgeHtml);
  $(OFFICE_ID).html(viewArr.join(''));
};

export const appendBadge = key => $(OFFICE_ID).append(getBadgeHtml(key));

export const toggleRemoveAlert = () => $(RM_ALERT_ID).modal('toggle');

export const toggleAddModal = () => $(ADD_OFFICE_API_ID).modal('toggle');

export const disableSaveBtn = () => $(ADD_OFFICE_CONFIRM_BTN_ID).prop('disabled', true);

export const enableSaveBtn = () => $(ADD_OFFICE_CONFIRM_BTN_ID).prop('disabled', false);
