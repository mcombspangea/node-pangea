import PangeaConfig from "../../src/config";
import EmbargoService from "../../src/services/embargo";

const token = process.env.PANGEA_TOKEN || '';
const configId = process.env.EMBARGO_CONFIG_ID || '';
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId });
const embargo = new EmbargoService(token, config);

it("check IP in Russia", async () => {
  const expected = {
    list_name: 'ITAR',
    embargoed_country_name: 'Russia',
    embargoed_country_iso_code: 'RU',
    issuing_country: 'US',
    annotations: expect.any(Object)
  };
  const response = await embargo.ipCheck("213.24.238.26");
  expect(response.code).toBe(200);

  const sanction = response.result.sanctions[0];
  expect(sanction).toBeDefined();
  expect(sanction).toEqual(expect.objectContaining(expected));
})

it("check ISO for Cuba", async () => {
  const expected = {
    list_name: 'ITAR',
    embargoed_country_name: 'Cuba',
    embargoed_country_iso_code: 'CU',
    issuing_country: 'US',
    annotations: expect.any(Object)
  };
  const response = await embargo.isoCheck("CU");
  expect(response.code).toBe(200);

  const sanction = response.result.sanctions[0];
  expect(sanction).toBeDefined();
  expect(sanction).toEqual(expect.objectContaining(expected));
})