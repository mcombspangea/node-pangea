<p align="center">
  <a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
    <img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.png" alt="Pangea Logo" height="24">
  </a>
  <br />
</p>

# Pangea Node SDK

## Overview

A javascript SDK for using Pangea APIs in a Node application.

## Installation

```sh
yarn add node-pangea
# or
npm install node-pangea
```

## Usage

```js
import PangeaConfig from "node-pangea/config";
import AuditService from "node-pangea/services/audit";

const token = process.env.PANGEA_TOKEN;
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({  configId });
const audit = new AuditService(token, config);

// log an audit event
const data = {
  actor: "user@mail.com",
  action: "update",
  status: "success",
  message: "delete record",
};
const logResponse = await audit.log(data);

// search an audit log
const searchResponse = await audit.search("message:delete", {
  limit: 10,
  verify: true,
});

searchResponse.result.events.forEach((row) => {
  console.log(
    row.event.received_at,
    row.event.actor,
    row.event.action,
    row.event.status,
    row.event.message,
    row.event.membership_proof,
    row.event.consistency_proof
  );
});
```

## Contributing

Currently, the setup scripts only have support for Mac/ZSH environments.
Future support is incoming.

To install our linters, simply run `./dev/setup_repo.sh`
These linters will run on every `git commit` operation.

## Generate SDK Documentation

### Overview

Throughout the SDK, there are jsdoc strings that serve as the source of our SDK docs.

The documentation pipeline here looks like:

1. Write jsdoc strings throughout your code. Please refer to existing jsdoc strings as an example of what and how to document.
1. Make your pull request.
1. After the pull request is merged, go ahead and run `yarn run --silent print:docs:json` to generate the JSON docs uses for rendering.
1. Copy the output from `yarn run --silent print:docs:json` and overwrite the existing `js_sdk.json` file in the docs repo. File is located in `platform/docs/openapi/js_sdk.json` in the Pangea monorepo. Save this and make a merge request to update the Python SDK docs in the Pangea monorepo.

### Running the autogen sdk doc script

Make sure you have all the dependencies installed. From the root of the `node-pangea` repo run:

```shell
yarn install
```

Now run the script

```shell
yarn run --silent print:docs:json
```

That will output the script in the terminal. If you're on a mac, you can run the script and copy the output to your clipboard with

```shell
yarn run --silent print:docs:json | pbcopy
```
