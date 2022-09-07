import PangeaConfig from "../../src/config";
import {
  FileIntelService,
  URLIntelService,
  IPIntelService,
  DomainIntelService,
} from "../../src/services/intel";

const token = process.env.PANGEA_TEST_INTEGRATION_TOKEN || "";
const testHost = process.env.PANGEA_TEST_INTEGRATION_ENDPOINT || "";
const config = new PangeaConfig({ domain: testHost });
const fileIntel = new FileIntelService(token, config);
const urlIntel = new URLIntelService(token, config);
const ipIntel = new IPIntelService(token, config);
const domainIntel = new DomainIntelService(token, config);

it("file lookup should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.lookup(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.lookup("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("URL lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.lookup("http://113.235.101.11:54384", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("Domain lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await domainIntel.lookup("teoghehofuuxo.su", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});
