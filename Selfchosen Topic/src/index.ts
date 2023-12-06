import { add } from 'customlib';
import { Data, ReturnTypes, SimulatedResponse, StatusCode } from './types';

const sum = add(1, 2);
const data = getData();
const mappedFormData = getReturnType('1', false);

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

function getReturnType<
  ReturnString extends boolean
>(
  value: string, 
  returnString: ReturnString
): ReturnTypes<ReturnString> {
  return (returnString ? value : Number(value)) as ReturnTypes<ReturnString>;
}