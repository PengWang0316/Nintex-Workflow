import { OFFICE_URL_API_KEY, BEARER_HEADER } from '../config';

// const TENANT_REGEXP = /&tenant=(.+)/;

/**
 * The url and api key pair will be retrieved from the LocalStorage
 * A LocalStorage version (In most modern browser, the LocalStorage can support up to 10MB)
 * @return {Object} return an object that includes all Office 365's url and key pair
 * The format will be:
 * { tenantA: ['keyA', 'cookieA'], tenantB: ['keyB', 'cookieB'] }
 */
export const fetchOfficeApis = () => JSON.parse(localStorage.getItem(OFFICE_URL_API_KEY));

/**
 * Retrieve the whole Office 365 url api key and add one more in.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 * @param {string} key is the api key value for this tenant url
 * @param {string} cookie is the authentication cookie value for this tenant url
 */
export const addOfficeApi = (tenant, key, cookie) => {
  let office = fetchOfficeApis();
  if (!office) office = {};
  office[tenant] = [key, cookie];
  localStorage.setItem(OFFICE_URL_API_KEY, JSON.stringify(office));
};

/**
 * Retrieve the whole nwc url api key and remove one from it.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 */
export const removeOfficeApi = (tenant) => {
  const office = fetchOfficeApis();
  delete office[tenant];
  localStorage.setItem(OFFICE_URL_API_KEY, JSON.stringify(office));
};
