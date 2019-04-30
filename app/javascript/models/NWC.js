import axios from 'axios';

import {
  NWC_URL_API_KEY, NWC_LIST_WORKFLOWS_API, BEARER_HEADER, NWC_PLATFORM,
  FETCH_NWC_HEALTH_SCORE_API, ADD_NWC_WF_API, NWC_AVATAR_KEY,
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

export const fetchNWCAvatars = () => JSON.parse(localStorage.getItem(NWC_AVATAR_KEY));

/**
 * Retrieve the whole nwc url api key and add one more in.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 * @param {string} key is the api key value for this tenant url
 */
export const addNWCApi = (tenant, key, avaltar) => {
  const nwc = fetchNWCApis() || {};
  const nwcAvatar = fetchNWCAvatars() || {};

  nwc[tenant] = key;
  nwcAvatar[tenant] = avaltar;
  localStorage.setItem(NWC_URL_API_KEY, JSON.stringify(nwc));
  localStorage.setItem(NWC_AVATAR_KEY, JSON.stringify(nwcAvatar));
};

/**
 * Retrieve the whole nwc url api key and remove one from it.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 */
export const removeNWCApi = (tenant) => {
  const nwc = fetchNWCApis();
  const avatar = fetchNWCAvatars();
  delete nwc[tenant];
  delete avatar[tenant];
  localStorage.setItem(NWC_URL_API_KEY, JSON.stringify(nwc));
  localStorage.setItem(NWC_AVATAR_KEY, JSON.stringify(avatar));
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
    const eventTypeName = isPublished ? item.published.eventType.name : item.draft.eventType.name;
    const type = isPublished ? item.published.publishedType : '';
    const description = isPublished ? item.published.description : item.draft.description;
    const authorId = isPublished ? item.published.author.id : item.draft.author.id;
    const authorEmail = isPublished ? item.published.author.email : item.draft.author.email;
    const authorName = isPublished ? item.published.author.name : item.draft.author.name;
    const publishedType = isPublished ? item.published.publishedType : null;
    const publishedId = isPublished ? item.published.id : null;
    const eventType = isPublished ? item.published.eventType : item.draft.eventType;
    const eventConfiguration = isPublished ? item.published.eventConfiguration : item.draft.eventConfiguration;
    const lastPublished = isPublished ? item.published.lastPublished : null;

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
        eventType: eventTypeName, type, description, tenant: item.tenant,
      }),
      authorId,
      authorName,
      authorEmail,
      publishedId,
      publishedType,
      eventType,
      eventConfiguration,
      lastPublished,
      description,
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

export const fetchHealthScore = ids => axios.post(
  FETCH_NWC_HEALTH_SCORE_API, { ids },
);

export const insertNWCWorkflows = (allWorkflow, existedWorkflow) => {
  const insertWorkflows = [];
  const keys = {};
  allWorkflow.forEach((workflow) => {
    if (!existedWorkflow[workflow.workflowId]) {
      insertWorkflows.push([
        workflow.workflowId,
        workflow.status === 'Published' ? 1 : 0,
        workflow.name,
        workflow.authorName,
        workflow.authorId,
        workflow.authorEmail,
        workflow.created,
        JSON.stringify(workflow.eventConfiguration),
        JSON.stringify(workflow.eventType),
        workflow.active === '' ? 0 : 1,
        workflow.lastPublished,
        workflow.publishedType,
        workflow.publishedId,
        workflow.tenant,
        workflow.description,
      ]);
      // Put the tenant api keys to an object in order to pass it to back end
      if (!keys[workflow.tenant]) keys[workflow.tenant] = fetchNWCApis()[workflow.tenant];
    }
  });
  if (insertWorkflows.length !== 0) axios.post(ADD_NWC_WF_API, { workflows: insertWorkflows, keys });
};
