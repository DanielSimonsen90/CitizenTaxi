// Define API_ENDPOINT_SECURE by environment, if development then use localhost, else use azurewebsites

if (process.env.NODE_ENV === 'development') {
  var API_ENDPOINT_SECURE = "https://localhost:5000/api";
} else {
  API_ENDPOINT_SECURE = "https://citizentaxiapi-2.azurewebsites.net/api";
}
// const API_ENDPOINT_SECURE = "https://citizentaxiapi-2.azurewebsites.net/api";
export { API_ENDPOINT_SECURE };