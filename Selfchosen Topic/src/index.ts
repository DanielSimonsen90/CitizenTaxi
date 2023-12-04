import { Data, SimulatedResponse, StatusCode } from './types';

async function getData() {
  const response = await simulateApiRequest<Data>();
  console.log('response', response);

  const getResponseAgain = await simulateApiRequest();
  console.log('getResponseAgain', getResponseAgain);

  return response;
}

function simulateApiRequest<T>(forceFail = false): Promise<SimulatedResponse<T>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceFail) {
        return reject({
          statusCode: StatusCode.NOT_FOUND,
          data: null,
        });
      }

      resolve({
        statusCode: StatusCode.OK,
        data: {
          name: 'John',
          age: 30,
        } as T,
      });
    }, 3000);
  });
}

getData();