import PangeaConfig from "../../src/config";
import RedactService from "../../src/services/redact";

const token = process.env.PANGEA_TEST_INTEGRATION_TOKEN || "";
const configId = process.env.REDACT_INTEGRATION_CONFIG_TOKEN || "";
const testHost = process.env.PANGEA_TEST_INTEGRATION_ENDPOINT || "";
const config = new PangeaConfig({ domain: testHost, configId });
const redact = new RedactService(token, config);

it("redact a data string", async () => {
  const data = "Jenny Jenny... 415-867-5309";
  const expected = { redacted_text: "<PERSON>... <PHONE_NUMBER>" };

  const response = await redact.redact(data);
  expect(response.code).toBe(200);
  expect(response.result).toMatchObject(expected);
});

it("redact a data object", async () => {
  const data = { phone: "415-867-5309" };
  const expected = { redacted_data: { phone: "<PHONE_NUMBER>" } };

  const response = await redact.redactStructured(data);
  expect(response.code).toBe(200);
  expect(response.result).toMatchObject(expected);
});

it("plain redact with object should fail", async () => {
  const data = { phone: "415-867-5309" };
  // @ts-expect-error
  const response = await redact.redact(data);
  expect(response.code).toBe(400);
});
