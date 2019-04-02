import { ALERT_ELEMENT_ID } from '../config';

let timeout;

export const toggleAlert = (text) => {
  const alertElement = $(ALERT_ELEMENT_ID);
  alertElement.text(text);
  alertElement.slideToggle('fast', 'linear', () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => alertElement.slideToggle(), 3000);
  });
};

export default toggleAlert;
