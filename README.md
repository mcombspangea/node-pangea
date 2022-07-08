# Pangea Node SDK

# Usage

TODO

# Contributing

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
