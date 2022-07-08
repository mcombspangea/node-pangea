const { exec } = require("child_process");

const DIRECTORY_TO_PULL_DOC_STRINGS = "src";

/**
 * Run jsdoc recursively through our files in the src/ directory
 * Output to a flat JSON that we can pass to docs
 */
exec(
  `./node_modules/.bin/jsdoc -X -r ${DIRECTORY_TO_PULL_DOC_STRINGS}`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    // Filter out anything that does not have a jsdoc comment defined
    const filtered = JSON.parse(stdout).filter(({ comment }) => comment !== "");

    // Output the filtered result to the console
    console.log(JSON.stringify(filtered));
  }
);
