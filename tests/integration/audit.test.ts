import PangeaConfig from "../../src/config";
import AuditService from "../../src/services/audit";
import { Audit } from "../../src/types";

const token = process.env.PANGEA_TEST_INTEGRATION_TOKEN || "";
const configId = process.env.AUDIT_INTEGRATION_CONFIG_TOKEN || "";
const testHost = process.env.PANGEA_TEST_INTEGRATION_ENDPOINT || "";
const config = new PangeaConfig({ domain: testHost, configId });
const audit = new AuditService(token, config);

it("log an audit event", async () => {
  const event: Audit.Event = {
    actor: "node-sdk-tester",
    message: "this is a test",
  };

  const response = await audit.log(event);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
});

it("search audit log", async () => {
  const query = "message:test";
  const options: Audit.SearchOptions = {
    limit: 10,
  };

  const response = await audit.search(query, options);
  expect(response.status).toBe("Success");
});

it("get audit root", async () => {
  const response = await audit.root();

  expect(response.status).toBe("Success");
  expect(response.result.data).toEqual(
    expect.objectContaining({
      consistency_proof: expect.any(Object),
      root_hash: expect.any(String),
      size: expect.any(Number),
      url: expect.any(String),
    })
  );
});

it("search audit log with verify flag", async () => {
  const query = "message:test";
  const options = {
    verify: true,
  };

  const response = await audit.search(query, options);

  expect(response.status).toBe("Success");
});
