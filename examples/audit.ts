/* eslint-disable no-console */

import PangeaConfig from "../src/config";
import AuditService from "../src/services/audit";

const token = process.env.PANGEA_TOKEN;
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    actor: "pangea",
    action: "update",
    status: "success",
    message: "node-sdk test message",
  };

  console.log("Logging audit data...");
  const logResponse = await audit.log(data);

  if (logResponse.success) {
    console.log("Success:", logResponse.result);
  } else {
    console.log("Error", logResponse.code, logResponse.result);
  }

  console.log("Searching audit data...");
  const searchResponse = await audit.search("message:test", {
    restriction: { source: ["monitor"] },
    limit: 10,
    verify: true,
  });

  if (searchResponse.success) {
    console.log("Status", searchResponse.code);

    searchResponse.result.events.forEach((row) => {
      console.log(
        row.event.received_at,
        row.event.message,
        row.event.source,
        row.event.actor,
        row.event.membership_proof,
        row.event.consistency_proof
      );
    });
  } else {
    console.log("Error", searchResponse.code, searchResponse.result);
  }
})();
