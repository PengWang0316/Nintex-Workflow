export const listWorkflowFirstResponse = {
  workflows: [
    {
      id: '4d13e28b-b1a8-430a-85ec-fbb046dd9cb3',
      name: 'Test NWC Form with Email',
      published: {
        isActive: true,
        created: '2013-04-02T17:50:39Z',
        eventType: {
          id: 'nintex:form',
          name: 'Form',
        },
        eventConfiguration: [
          {
            id: '',
          },
          {
            name: 'formOptions',
            value: [
              'webForm',
            ],
          },
        ],
        author: {
          name: 'Richard Roe',
          id: 'auth0|599e5d09b80f805a065734f8',
          email: 'richardr@ntxte08.com',
        },
        description: '',
        id: '209d78d0-338e-43d5-9f6a-16fddd356efc',
        lastPublished: '2013-04-02T17:54:34Z',
        publishedType: 'Production',
      },
      draft: {},
    },
    {
      id: '9f980110-3b5c-40c6-b469-908f9dc6e95f',
      name: 'Xchange 2',
      published: {},
      draft: {
        created: '2019-01-24T20:24:33Z',
        eventType: {
          id: 'nintex:form',
          name: 'Form',
        },
        eventConfiguration: [
          {
            name: 'formOptions',
            value: [
              'webForm',
            ],
          },
        ],
        lastModified: '2019-01-24T20:24:33Z',
        author: {
          name: 'Richard Roe',
          id: 'auth0|599e5d09b80f805a065734f8',
          email: null,
        },
        description: '',
      },
    },
  ],
};

export const listWorkflowSecondResponse = {
  workflows: [
    {
      id: '855aa77c-f03c-4e09-ac55-9895b77dc6ec',
      name: 'GetAuthorizationLimits',
      published: {
        isActive: true,
        created: '2019-04-01T22:15:37Z',
        eventType: {
          id: 'nintex:externalstart',
          name: 'Component workflow',
        },
        eventConfiguration: [],
        author: {
          name: 'Richard Roe',
          id: 'auth0|599e5d09b80f805a065734f8',
          email: 'richardr@ntxte08.com',
        },
        description: '',
        id: '1dfb4937-317e-4571-9990-d8f9f59046dd',
        lastPublished: '2019-04-01T23:59:07Z',
        publishedType: 'Production',
      },
      draft: {},
    },
    {
      id: '803aa9a5-7a87-4c2f-827d-cbe41d128b93',
      name: 'Xcahnge Form test',
      published: {},
      draft: {
        created: '2019-01-24T20:22:54Z',
        eventType: {
          id: 'nintex:form',
          name: 'Form',
        },
        eventConfiguration: [
          {
            name: 'formOptions',
            value: [
              'webForm',
            ],
          },
        ],
        lastModified: '2019-01-24T20:22:54Z',
        author: {
          name: 'Richard Roe',
          id: 'auth0|599e5d09b80f805a065734f8',
          email: null,
        },
        description: '',
      },
    },
  ],
};

export const listWorkflowExpectResult = [{
  id: 2,
  workflowId: '855aa77c-f03c-4e09-ac55-9895b77dc6ec',
  tenant: 'ntxte09',
  name: 'GetAuthorizationLimits',
  eventType: 'Component workflow',
  type: 'Production',
  status: 'Published',
  active: true,
  lastEdited: new Date('2019-04-01T23:59:07.000Z'),
  editedBy: 'Richard Roe',
  description: '',
},
{
  id: 1,
  workflowId: '9f980110-3b5c-40c6-b469-908f9dc6e95f',
  tenant: 'ntxte08',
  name: 'Xchange 2',
  eventType: 'Form',
  type: '',
  status: 'Draft',
  active: '',
  lastEdited: new Date('2019-01-24T20:24:33.000Z'),
  editedBy: 'Richard Roe',
  description: '',
},
{
  id: 3,
  workflowId: '803aa9a5-7a87-4c2f-827d-cbe41d128b93',
  tenant: 'ntxte09',
  name: 'Xcahnge Form test',
  eventType: 'Form',
  type: '',
  status: 'Draft',
  active: '',
  lastEdited: new Date('2019-01-24T20:22:54.000Z'),
  editedBy: 'Richard Roe',
  description: '',
},
{
  id: 0,
  workflowId: '4d13e28b-b1a8-430a-85ec-fbb046dd9cb3',
  tenant: 'ntxte08',
  name: 'Test NWC Form with Email',
  eventType: 'Form',
  type: 'Production',
  status: 'Published',
  active: true,
  lastEdited: new Date('2013-04-02T17:54:34.000Z'),
  editedBy: 'Richard Roe',
  description: '',
}];
