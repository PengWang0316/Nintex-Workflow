import axios from 'axios';

import { NWC_URL_API_KEY, NWC_LIST_WORKFLOWS_API, BEARER_HEADER } from '../../app/javascript/config';
import { listWorkflowFirstResponse, listWorkflowSecondResponse, listWorkflowExpectResult } from './TestData';

import {
  activateAct, deactivateAct, exportDraftAct, exportPublishedAct, deleteWorkflowAct,
} from '../../app/javascript/models/NWC';


jest.mock('axios', () => ({
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('NWC', () => {
  beforeEach(() => {
    localStorage.setItem(NWC_URL_API_KEY, '{"ntxte08":"key1","ntxte09":"key2"}');
    jest.clearAllMocks();
  });

  test('activateAct', () => {
    activateAct('workflowId', 'ntxte08');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(
      `${NWC_LIST_WORKFLOWS_API}/workflowId/activate`,
      {},
      {
        headers: { authorization: `${BEARER_HEADER} key1` },
      },
    );
  });

  test('deactivateAct', () => {
    deactivateAct('workflowId', 'ntxte09');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(
      `${NWC_LIST_WORKFLOWS_API}/workflowId/deactivate`,
      {},
      {
        headers: { authorization: `${BEARER_HEADER} key2` },
      },
    );
  });

  test('exportDraftAct', () => {
    exportDraftAct('workflowId', 'ntxte08');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(
      `${NWC_LIST_WORKFLOWS_API}/workflowId/draft/export`,
      {},
      {
        headers: { authorization: `${BEARER_HEADER} key1` },
      },
    );
  });

  test('exportPublishedAct', () => {
    exportPublishedAct('workflowId', 'ntxte09');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(
      `${NWC_LIST_WORKFLOWS_API}/workflowId/published/export`,
      {},
      {
        headers: { authorization: `${BEARER_HEADER} key2` },
      },
    );
  });

  test('deleteWorkflowAct', () => {
    deleteWorkflowAct('workflowId', 'ntxte09');

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenLastCalledWith(
      `${NWC_LIST_WORKFLOWS_API}/workflowId`,
      {},
      {
        headers: { authorization: `${BEARER_HEADER} key2` },
      },
    );
  });
});
