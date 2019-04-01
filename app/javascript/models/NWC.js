import axios from 'axios';

import { NWC_URL_API_KEY, NWC_LIST_WORKFLOWS_API, BEARER_HEADER } from '../config';

/**
 * The url and api key pair will be retrieved from the LocalStorage
 * A LocalStorage version (In most modern browser, the LocalStorage can support up to 10MB)
 * @return {Object} return an object that includes all NWC's url and key pair
 * The format will be:
 * { tenantA: 'keyA', tenantB: 'keyB' }
 */
export const fetchNWCApis = () => JSON.parse(localStorage.getItem(NWC_URL_API_KEY));

/**
 * Retrieve the whole nwc url api key and add one more in.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 * @param {string} key is the api key value for this tenant url
 */
export const addNWCApi = (tenant, key) => {
  let nwc = fetchNWCApis();
  if (!nwc) nwc = {};
  nwc[tenant] = key;
  localStorage.setItem(NWC_URL_API_KEY, JSON.stringify(nwc));
};

/**
 * Retrieve the whole nwc url api key and remove one from it.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 */
export const removeNWCApi = (tenant) => {
  const nwc = fetchNWCApis();
  delete nwc[tenant];
  localStorage.setItem(NWC_URL_API_KEY, JSON.stringify(nwc));
};

const parseDataToArray = data => data.map((item) => {
  const isPublished = Object.keys(item.published).length !== 0;
  return {
    id: item.id,
    name: item.name,
    eventType: isPublished ? item.published.eventType.name : item.draft.eventType.name,
    type: isPublished ? item.published.publishedType : '',
    status: isPublished ? 'Published' : 'Draft',
    lastEdited: isPublished
      ? new Date(item.published.lastPublished)
      : new Date(item.draft.lastModified),
    editedBy: isPublished ? item.published.author.name : item.draft.author.name,
    description: isPublished ? item.published.description : item.draft.description,
  };
});

export const fetchWorkflows = () => {
  const urlKeys = fetchNWCApis();
  const axiosArr = Object.keys(urlKeys).map(key => axios.get(
    NWC_LIST_WORKFLOWS_API,
    {
      headers: { authorization: `${BEARER_HEADER} ${urlKeys[key]}` },
      params: { limit: '1000', sortBy: 'lastModified', sortOrder: 'desc' },
    },
  ));
  return axios.all(axiosArr).then((result) => {
    const data = [];
    result.forEach((item) => { data.push(...item.data.workflows); });
    return parseDataToArray(data);
  });
};
