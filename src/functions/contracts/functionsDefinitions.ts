import { pathHandler } from '@functions/utils/pathHandler';

export const createContract = {
  handler: `${pathHandler(__dirname)}/contracts.createContract`,
  events: [
    {
      http: {
        method: 'post',
        path: '/createContract',
      },
    },
  ],
};

export const getContractsIDs = {
  handler: `${pathHandler(__dirname)}/contracts.getContracts`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getContractIDs',
      },
    },
  ],
};

export const getContract = {
  handler: `${pathHandler(__dirname)}/contracts.getContract`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getContract',
        request: {
          parameters: {
            querystrings: {
              id: true,
            },
          },
        },
      },
    },
  ],
};
