import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { NWC_URL_API_KEY, NWC_LIST_WORKFLOWS_API, BEARER_HEADER } from '../../app/javascript/config';
import { listWorkflowFirstResponse, listWorkflowSecondResponse, listWorkflowExpectResult } from './TestData';

import {
  fetchNWCApis, addNWCApi, removeNWCApi, fetchWorkflows,
} from '../../app/javascript/models/NWC';

const mockAxios = new MockAdapter(axios);

describe('NWC', () => {
  beforeEach(() => {
    localStorage.setItem(NWC_URL_API_KEY, '{"ntxte08":"key1","ntxte09":"key2"}');
    jest.clearAllMocks();
  });

  test('fetchNWCApis', () => {
    const result = fetchNWCApis();

    expect(result).toEqual({ ntxte08: 'key1', ntxte09: 'key2' });
  });

  test('addNWCApi without a localStorage key', () => {
    localStorage.removeItem(NWC_URL_API_KEY);
    addNWCApi('tenantA', 'keyA');

    expect(localStorage.getItem(NWC_URL_API_KEY)).toBe('{"tenantA":"keyA"}');
  });

  test('addNWCApi with a localStorage key', () => {
    addNWCApi('tenantA', 'keyA');

    expect(localStorage.getItem(NWC_URL_API_KEY)).toBe('{"ntxte08":"key1","ntxte09":"key2","tenantA":"keyA"}');
  });

  test('removeNWCApi', () => {
    removeNWCApi('ntxte08');

    expect(localStorage.getItem(NWC_URL_API_KEY)).toBe('{"ntxte09":"key2"}');
  });

  test('fetchWorkflows', async () => {
    mockAxios.onGet(
      NWC_LIST_WORKFLOWS_API,
      {
        headers: { authorization: `${BEARER_HEADER} key1` },
        params: {
          limit: '1000', sortBy: 'lastModified', sortOrder: 'desc', tenant: 'ntxte08',
        },
      },
    ).reply(200, listWorkflowFirstResponse);
    mockAxios.onGet(
      NWC_LIST_WORKFLOWS_API,
      {
        headers: { authorization: `${BEARER_HEADER} key2` },
        params: {
          limit: '1000', sortBy: 'lastModified', sortOrder: 'desc', tenant: 'ntxte09',
        },
      },
    ).reply(200, listWorkflowSecondResponse);
    const result = await fetchWorkflows();

    expect(result).toEqual(listWorkflowExpectResult);
  });
});
