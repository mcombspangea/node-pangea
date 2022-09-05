/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.
 
 % ts-node-esm audit.ts
*/

import PangeaConfig from "../src/config.js";
import AuditService from "../src/services/audit.js";
import PangeaResponse from "../src/response.js";
import { Audit } from "../src/types.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN || "";
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({ domain, configId });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    actor: "pangea",
    action: "update",
    status: "success",
    source: "monitor",
    message: "node-sdk test message",
  };

  console.log("Logging audit data...");
  const logResponse = await audit.log(data, { verbose: true });

  if (logResponse.success) {
    console.log("Success:", logResponse.result);
  } else {
    console.log("Error", logResponse.code, logResponse.status, logResponse.result);
  }

  console.log("Searching audit data...");
  const searchResponse: PangeaResponse<Audit.SearchResponse> = await audit.search("message:test", {
    restriction: { source: ["monitor"] },
    limit: 10,
    verify: true,
  });

  if (searchResponse.success) {
    console.log("Status", searchResponse.code);

    searchResponse.result.events.forEach((row: Audit.AuditRecord) => {
      console.log(
        row.envelope.received_at,
        row.envelope.event.message,
        row.envelope.event.source,
        row.envelope.event.actor,
        row.envelope.membership_verification,
        row.envelope.consistency_verification
      );
    });
  } else {
    console.log("Error", searchResponse.code, searchResponse.status, searchResponse.result);
  }
})();
