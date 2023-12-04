"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
async function getData() {
    const response = await simulateApiRequest();
    console.log(response);
    const getResponseAgain = await simulateApiRequest();
    console.log(getResponseAgain);
    return response;
}
function simulateApiRequest(forceFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (forceFail) {
                return reject({
                    statusCode: types_1.StatusCode.NOT_FOUND,
                    data: null,
                });
            }
            resolve({
                statusCode: types_1.StatusCode.OK,
                data: {
                    name: 'John',
                    age: 30,
                },
            });
        }, 3000);
    });
}
getData();
//# sourceMappingURL=index.js.map