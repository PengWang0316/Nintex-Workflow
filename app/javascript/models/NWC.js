import axios from 'axios';

import {
  NWC_URL_API_KEY, NWC_LIST_WORKFLOWS_API, BEARER_HEADER, NWC_PLATFORM,
} from '../config';

// Use this to keep the last created dates for all tenant
const lastCreatedDates = {};

// const TENANT_REGEXP = /&tenant=(.+)/;

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

// export const fetchLastDate = () => JSON.parse(localStorage.getItem(LAST_CREATED_DATE_KEY));

// const setLastDate = (tenant, date) => {
//   let lastDates = 1
// };

const departments = ['Accounting', 'Marketing', 'HR', 'Research', 'IT'];
const getRandomFakeDepartment = () => departments[Math.floor(Math.random() * departments.length)];

const parseDataToArray = (data) => {
  const arr = data.map((item, index) => {
    const isPublished = Object.keys(item.published).length !== 0;
    const eventType = isPublished ? item.published.eventType.name : item.draft.eventType.name;
    const type = isPublished ? item.published.publishedType : '';
    const description = isPublished ? item.published.description : item.draft.description;

    return {
      id: index,
      platform: NWC_PLATFORM,
      tenant: item.tenant,
      workflowId: item.id,
      department: getRandomFakeDepartment(),
      name: item.name,
      status: isPublished ? 'Published' : 'Draft',
      active: isPublished ? item.published.isActive : '',
      created: isPublished
        ? new Date(item.published.created)
        : new Date(item.draft.created),
      editedBy: isPublished ? item.published.author.name : item.draft.author.name,
      secondaryInfo: JSON.stringify({
        eventType, type, description, tenant: item.tenant,
      }),
    };
  });
  // Sort by created data
  return arr.sort((prev, next) => next.created - prev.created);
};

export const fetchWorkflows = () => {
  const urlKeys = fetchNWCApis();
  const axiosArr = Object.keys(urlKeys).map(key => axios.get(
    NWC_LIST_WORKFLOWS_API,
    {
      headers: { authorization: `${BEARER_HEADER} ${urlKeys[key]}` },
      params: {
        limit: '1000', sortBy: 'created', sortOrder: 'desc', tenant: key,
      },
    },
  ));

  return axios.all(axiosArr).then((result) => {
    const data = [];
    result.forEach((item) => {
      const { tenant } = item.config.params;
      const lastDate = item.data.workflows[0].published.created || item.data.workflows[0].draft.created;
      lastCreatedDates[tenant] = new Date(lastDate);
      item.data.workflows.forEach((row) => {
        row.tenant = tenant;
        data.push(row);
      });
    });
    return parseDataToArray(data);
  });
};

export const fetchNewWorkflows = () => {
  const urlKeys = fetchNWCApis();
  const axiosArr = Object.keys(urlKeys).map(key => axios.get(
    NWC_LIST_WORKFLOWS_API,
    {
      headers: { authorization: `${BEARER_HEADER} ${urlKeys[key]}` },
      params: {
        limit: '1000', sortBy: 'created', sortOrder: 'desc', tenant: key,
      },
    },
  ));
  // Return an array just includes new workflow and update the last create dates
  return axios.all(axiosArr).then((result) => {
    const data = [];
    result.forEach((item) => {
      const { tenant } = item.config.params;
      const { workflows } = item.data;
      for (let i = 0; i < workflows.length; i++) {
        if ((workflows[i].published.created && new Date(workflows[i].published.created) <= lastCreatedDates[tenant])
          || (workflows[i].draft.created && new Date(workflows[i].draft.created) <= lastCreatedDates[tenant])) break;
        workflows[i].tenant = tenant;
        data.push(workflows[i]);
      }
      // Update the last create date
      const lastDate = workflows[0].published.created || workflows[0].draft.created;
      lastCreatedDates[tenant] = new Date(lastDate);
    });
    return parseDataToArray(data);
  });
};

export const activateAct = (workflowId, tenant) => axios.post(
  `${NWC_LIST_WORKFLOWS_API}/${workflowId}/activate`,
  {},
  {
    headers: { authorization: `${BEARER_HEADER} ${fetchNWCApis()[tenant]}` },
  },
);

export const deactivateAct = (workflowId, tenant) => axios.post(
  `${NWC_LIST_WORKFLOWS_API}/${workflowId}/deactivate`,
  {},
  {
    headers: { authorization: `${BEARER_HEADER} ${fetchNWCApis()[tenant]}` },
  },
);

export const exportDraftAct = (workflowId, tenant) => axios.post(
  `${NWC_LIST_WORKFLOWS_API}/${workflowId}/draft/export`,
  {},
  {
    headers: { authorization: `${BEARER_HEADER} ${fetchNWCApis()[tenant]}` },
  },
);

export const exportPublishedAct = (workflowId, tenant) => axios.post(
  `${NWC_LIST_WORKFLOWS_API}/${workflowId}/published/export`,
  {},
  {
    headers: { authorization: `${BEARER_HEADER} ${fetchNWCApis()[tenant]}` },
  },
);

export const deleteWorkflowAct = (workflowId, tenant) => axios.delete(
  `${NWC_LIST_WORKFLOWS_API}/${workflowId}`,
  {
    headers: { authorization: `${BEARER_HEADER} ${fetchNWCApis()[tenant]}` },
  },
);

/**
 * Count how many Completed and Failed number
 * @param {array} data is an instance array
 * @return {array} return a completed and failed pair as [completed, failed]
 */
const countStatus = (data) => {
  const result = [0, 0];
  data.forEach((item) => {
    if (item.status === 'Completed') result[0]++;
    else if (item.status === 'Failed') result[1]++;
  });
  return result;
};

export const fetchHealthScores = (workflowId, tenant) => new Promise(async (resolve, reject) => {
  const authorization = `${BEARER_HEADER} ${fetchNWCApis()[tenant]}`;
  const counts = { completed: 0, failed: 0 };
  // The first fetching
  let result = await axios.get(
    `${NWC_LIST_WORKFLOWS_API}/${workflowId}/instances`,
    {
      headers: { authorization, 'cache-control': 'no-cache' },
    },
  );
  let newCount = countStatus(result.data.instances);
  counts.completed += newCount[0];
  counts.failed += newCount[1];

  while (result.data.instances.length !== 0) {
    result = await axios.get(
      result.data.next,
      {
        headers: { authorization, 'cache-control': 'no-cache' },
      },
    );
    newCount = countStatus(result.data.instances);
    counts.completed += newCount[0];
    counts.failed += newCount[1];
  }
  resolve(counts);
});
