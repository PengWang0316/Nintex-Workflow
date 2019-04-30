import axios from 'axios';

import {
  OFFICE_URL_API_KEY, OFFICE_LIST_WORKFLOWS_API,
  OFFICE_PLATFORM, CORS_PROXY, ADD_OFFICE_WF_API, OFFICE_AVATAR_KEY,
} from '../config';

// const TENANT_REGEXP = /&tenant=(.+)/;

/**
 * The url and api key pair will be retrieved from the LocalStorage
 * A LocalStorage version (In most modern browser, the LocalStorage can support up to 10MB)
 * @return {Object} return an object that includes all Office 365's url and key pair
 * The format will be:
 * { tenantA: ['keyA', 'cookieA'], tenantB: ['keyB', 'cookieB'] }
 */
export const fetchOfficeApis = () => JSON.parse(localStorage.getItem(OFFICE_URL_API_KEY));

export const fetchOfficeAvatars = () => JSON.parse(localStorage.getItem(OFFICE_AVATAR_KEY));

/**
 * Retrieve the whole Office 365 url api key and add one more in.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 * @param {string} key is the api key value for this tenant url
 * @param {string} cookie is the authentication cookie value for this tenant url
 */
export const addOfficeApi = (tenant, key, cookie, avatar) => {
  const office = fetchOfficeApis() || {};
  const avatars = fetchOfficeAvatars() || {};
  office[tenant] = [key, cookie];
  avatars[tenant] = avatar;
  localStorage.setItem(OFFICE_URL_API_KEY, JSON.stringify(office));
  localStorage.setItem(OFFICE_AVATAR_KEY, JSON.stringify(avatars));
};

/**
 * Retrieve the whole nwc url api key and remove one from it.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 */
export const removeOfficeApi = (tenant) => {
  const office = fetchOfficeApis();
  const avatar = fetchOfficeAvatars();
  delete office[tenant];
  delete avatar[tenant];
  localStorage.setItem(OFFICE_URL_API_KEY, JSON.stringify(office));
  localStorage.setItem(OFFICE_AVATAR_KEY, JSON.stringify(avatar));
};

// const departments = ['Accounting', 'Marketing', 'HR', 'Research', 'IT'];
// const getRandomFakeDepartment = () => departments[Math.floor(Math.random() * departments.length)];

const parseDataToArray = (data) => {
  const arr = data.map((item, index) => {
    const isPublished = item.isPublished === true;
    const eventType = '';
    const type = '';
    const { description } = item;

    return {
      id: index,
      platform: OFFICE_PLATFORM,
      tenant: item.tenant,
      workflowId: item.id,
      department: '',
      name: item.name,
      status: isPublished ? 'Published' : 'Draft',
      active: '',
      created: '',
      editedBy: '',
      secondaryInfo: JSON.stringify({
        eventType, type, description, tenant: item.tenant,
      }),
      description,
      listId: item.listId,
      region: item.region,
      workflowType: item.workflowType,
      assignedUse: item.assignedUse,
    };
  });
  return arr;
};

export const fetchWorkflows = () => {
  const urlKeys = fetchOfficeApis() || {};
  const axiosArr = Object.keys(urlKeys).map(key => axios.get(
    `${CORS_PROXY}https://${key}${OFFICE_LIST_WORKFLOWS_API}`,
    {
      headers: {
        Authorization: urlKeys[key][1],
        'API-Key': urlKeys[key][0],
      },
      crossdomain: true,
      params: {
        limit: '1000', sortBy: 'created', sortOrder: 'desc', tenant: key,
      },
    },
  ));

  return axios.all(axiosArr).then((result) => {
    const data = [];
    result.forEach((item) => {
      const { tenant } = item.config.params;
      item.data.data.forEach((row) => {
        row.tenant = tenant;
        data.push(row);
      });
    });
    return parseDataToArray(data);
  });
};

export const insertOfficeWorkflows = (workflows) => {
  const insertWorkflows = {};
  workflows.forEach((workflow) => {
    insertWorkflows[workflow.workflowId] = [
      workflow.workflowId, workflow.status, workflow.name,
      workflow.description, workflow.listId, workflow.region,
      workflow.workflowType, workflow.assignedUse, workflow.tenant,
    ];
  });
  if (Object.keys(insertWorkflows).length !== 0) axios.post(ADD_OFFICE_WF_API, { workflows: insertWorkflows });
};
