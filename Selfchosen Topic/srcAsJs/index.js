import { add } from 'customlib';
import { Data, ReturnTypes, SimulatedResponse, StatusCode } from './types';

const sum = add(1, 2);
const data = getData();
const mappedFormData = getReturnType('1', false); 

async function getData() {
  const response = await simulateApiRequest();
  console.log('response', response);

  const getResponseAgain = await simulateApiRequest();
  console.log('getResponseAgain', getResponseAgain);

  return response;
}

/**
 * @param {boolean} forceFail 
 * @returns {Promise<SimulatedResponse<T>>}
 */
function simulateApiRequest(forceFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceFail) {
        return reject({
          statusCode: StatusCode.NOT_FOUND,
          data: null
        });
      }

      resolve({
        statusCode: StatusCode.OK,
        data: {
          name: 'John',
          age: 30
        }
      });
    }, 3000);
  });
}

/**
 * @template {ReturnString extends boolean} ReturnString 
 * @param {string} value 
 * @param {ReturnString} returnString
 * @returns {ReturnTypes<ReturnString>}
 */
function getReturnType(value, returnString) {
  return returnString ? value : Number(value);
}