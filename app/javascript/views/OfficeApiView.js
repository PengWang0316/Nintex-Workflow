import {
  OFFICE_ID, RM_ALERT_ID, RM_OFFICE_BTN_CLASS, ADD_OFFICE_API_ID, ADD_OFFICE_CONFIRM_BTN_ID,
  AVATAR_IMG_PREFIX,
} from '../config';
import styles from '../../css/ApiView.module.css';

const getBadgeHtml = ({ key, avatar }) => `<span class="${styles.badge}" id="office_${key}">
                              <img src="${AVATAR_IMG_PREFIX}${avatar}" class="${styles.badgeAvatar}" />${key}<span data-key=${key} class="btn ml-2 ${styles.removeBtn} ${RM_OFFICE_BTN_CLASS}">X</span>
                            </span>`;

export const initialOfficeApiView = (apiKeys, avatars) => {
  const viewArr = Object.keys(apiKeys)
    .map(key => ({ key, avatar: avatars[key] }))
    .map(getBadgeHtml);
  $(OFFICE_ID).html(viewArr.join(''));
};

export const appendBadge = (key, avatar) => $(OFFICE_ID).append(getBadgeHtml(({ key, avatar })));

export const toggleRemoveAlert = () => $(RM_ALERT_ID).modal('toggle');

export const toggleAddModal = () => $(ADD_OFFICE_API_ID).modal('toggle');

export const disableSaveBtn = () => $(ADD_OFFICE_CONFIRM_BTN_ID).prop('disabled', true);

export const enableSaveBtn = () => $(ADD_OFFICE_CONFIRM_BTN_ID).prop('disabled', false);
