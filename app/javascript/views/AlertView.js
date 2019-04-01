import { ALERT_ELEMENT_ID } from '../config';

export const toggleAlert = (text) => {
  let timeout;
  const alertElement = $(ALERT_ELEMENT_ID);
  alertElement.text(text);
  alertElement.slideToggle('fast', 'linear', () => {
    if (timeout) timeout.clearTimeout();
    timeout = setTimeout(() => alertElement.slideToggle(), 3000);
  });
};

export default toggleAlert;
