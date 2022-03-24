const LocateService = require('../src/services/locate');

const locate = new LocateService('USERTOKEN');

(async () => {
  response = await locate.geolocate('98.35.229.30');

  console.log('CODE', response.code);
  console.log('DATA', response.result);
})();