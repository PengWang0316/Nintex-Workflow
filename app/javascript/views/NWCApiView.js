import { NWC_ID, RM_ALERT_ID, RM_BTN_CLASS } from '../config';
import styles from '../../css/ApiView.module.css';

export const initialNWCApiView = (apiKeys) => {
  const viewArr = Object.keys(apiKeys).map(key => `<span class="${styles.badge}" id="nwc_${key}">
                                                    ${key}<span data-key=${key} class="btn ml-2 ${styles.removeBtn} ${RM_BTN_CLASS}">X</span>
                                                  </span>`);
  $(NWC_ID).html(viewArr.join(''));
};

export const toggleRemoveAlert = () => {
  $(RM_ALERT_ID).modal('toggle');
};
