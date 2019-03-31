import { NWC_ID } from '../config';
import styles from '../../css/ApiView.module.css';

export const initialNWCApiView = (apiKeys) => {
  const viewArr = Object.keys(apiKeys).map(key => `<span class="${styles.badge}">
                                                    ${key}<span class="btn ml-2 ${styles.removeBtn}">X</span>
                                                  </span>`);
  $(NWC_ID).html(viewArr.join(''));
};

export const other = () => {};
