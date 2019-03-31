import { NWC_URL_API_KEY } from '../config';

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
  const nwc = fetchNWCApis();
  nwc[tenant] = key;
  localStorage.setItem(NWC_URL_API_KEY, nwc);
};

/**
 * Retrieve the whole nwc url api key and remove one from it.
 * It is not efficient due to read and write the entire localStorage over and over again
 * @param {string} tenant is the tenant name
 */
export const removeNWCApi = (tenant) => {
  const nwc = fetchNWCApis();
  delete nwc[tenant];
  localStorage.setItem(NWC_URL_API_KEY, nwc);
};

const parseDataToArray = data => JSON.parse(data).workflows.map((item) => {
  const isPublished = Object.keys(item.published).length !== 0;
  return {
    id: item.id,
    name: item.name,
    eventType: isPublished ? item.published.eventType.name : item.draft.eventType.name,
    type: isPublished ? item.published.publishedType : '',
    status: isPublished ? 'Published' : 'Draft',
    lastEdited: isPublished ? item.published.lastPublished : item.draft.lastModified,
    editedBy: isPublished ? item.published.author.name : item.draft.author.name,
    description: isPublished ? item.published.description : item.draft.description,
  };
});

export const fetchWorkflows = () => {
  const rawData = '{"workflows":[{"id":"6092ecd0-e776-436c-9746-5626ff2c6f69","name":"FracShack - Indeed Test","published":{"isActive":true,"created":"2019-03-29T16:19:44Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"id":""},{"name":"formOptions","value":["webForm"]}],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"","id":"b77480f6-b243-4ab4-9578-b0e7f1f0b6be","lastPublished":"2019-03-29T16:32:33Z","publishedType":"Production"},"draft":{}},{"id":"9fdb6858-be5d-4f79-85b1-050c31f76c6c","name":"Connect Request Form","published":{"isActive":true,"created":"2019-02-08T18:41:01Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"This form is used to capture comments from the community for specific reasons like broken links.","id":"6031359c-150c-48e7-926b-d8b27e8c8833","lastPublished":"2019-03-04T19:37:07Z","publishedType":"Production"},"draft":{}},{"id":"130a8315-e3e5-4173-860c-d723f2ece67b","name":"summary of forecast","published":{"isActive":true,"created":"2018-08-03T22:46:35+00:00","eventType":{"id":"nintex:scheduledstart","name":"Scheduled start"},"eventConfiguration":[],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"","id":"c777363e-f97d-4414-ab12-0e55a343c5f0","lastPublished":"2019-02-22T22:39:14Z","publishedType":"Production"},"draft":{}},{"id":"707720b1-f810-4722-997b-6f4bdfd92e7e","name":"Connect Migration Form","published":{"isActive":true,"created":"2019-01-31T20:01:51Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"","id":"5daf7b1e-5514-4c09-bf10-34678fa15a9c","lastPublished":"2019-02-04T20:22:44Z","publishedType":"Production"},"draft":{}},{"id":"9f980110-3b5c-40c6-b469-908f9dc6e95f","name":"Xchange 2","published":{},"draft":{"created":"2019-01-24T20:24:33Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"lastModified":"2019-01-24T20:24:33Z","author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":null},"description":""}},{"id":"803aa9a5-7a87-4c2f-827d-cbe41d128b93","name":"Xcahnge Form test","published":{},"draft":{"created":"2019-01-24T20:22:54Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"lastModified":"2019-01-24T20:22:54Z","author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":null},"description":""}},{"id":"10889acb-0852-48b9-b4f5-296be08691b7","name":"Forecast Workflow","published":{"isActive":true,"created":"2018-07-16T20:52:20+00:00","eventType":{"id":"nintex:scheduledstart","name":"Scheduled start"},"eventConfiguration":[],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"","id":"64134355-82d0-439b-89df-2409a1d82783","lastPublished":"2019-01-15T23:14:56Z","publishedType":"Production"},"draft":{}},{"id":"8d9265f7-3818-4756-a511-2285cc3b58b3","name":"Assign Forecast Task","published":{"isActive":true,"created":"2018-07-16T21:44:11+00:00","eventType":{"id":"nintex:externalstart","name":"Component workflow"},"eventConfiguration":[],"author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":"","id":"4a4e4bd8-7c22-4a51-b605-f5b4273ef3cc","lastPublished":"2019-01-15T23:14:13Z","publishedType":"Production"},"draft":{}},{"id":"00e051d5-071b-4dae-b1af-0df9f5f2814c","name":"CSM Activity Form","published":{"isActive":true,"created":"2018-10-05T00:15:00+00:00","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"author":{"name":"Jane Doe","id":"auth0|599e5d0a74f0c27844fac833","email":"janed@ntxte08.com"},"description":"","id":"4f9e50da-2fae-4132-b834-8a02905a20ba","lastPublished":"2018-12-18T13:18:48Z","publishedType":"Production"},"draft":{}},{"id":"83d3a062-562e-463d-9af8-0cfa075b8fef","name":"Partner Health","published":{},"draft":{"created":"2018-12-14T23:51:04Z","eventType":{"id":"nintex:form","name":"Form"},"eventConfiguration":[{"name":"formOptions","value":["webForm"]}],"lastModified":"2018-12-14T23:51:04Z","author":{"name":"Richard Roe","id":"auth0|599e5d09b80f805a065734f8","email":"richardr@ntxte08.com"},"description":""}}]}';
  return parseDataToArray(rawData);
};
