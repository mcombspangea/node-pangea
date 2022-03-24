const TestService = require('../src/services/tester');

const tester = new TestService('USERTOKEN');

(async () => {
  const response = await tester.async_call({'echo': 'hello world', 'delay': 5})

  console.log('CODE', response.code);
  console.log('DATA', response.result);
})();
