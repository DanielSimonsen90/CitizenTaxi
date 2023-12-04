async function getData() {
  const response = await simulateApiRequest();
  console.log(response);


  const getResponseAgain = await simulateApiRequest();
  console.log(getResponseAgain);

  return response;
}

/**
 * @template T
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