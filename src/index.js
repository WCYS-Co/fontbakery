const core = require("@actions/core");
const glob = require("@actions/glob");
const exec = require("@actions/exec");

async function run() {
  const buildPath = core.getInput("path");
  const fbSubCmd = core.getInput("subcmd");
  const fbArgs = core.getInput("args");
  const fbVersion = core.getInput("version");

  // const options = {};
  // options.listeners = {
  //   stdout: (data) => {
  //     myOutput += data.toString();
  //   },
  //   stderr: (data) => {
  //     myError += data.toString();
  //   },
  // };

  // ==================
  // Install fontbakery
  // ==================
  try {
    await exec.exec("python -m pip install fontbakery==0.7.31");
    // Show the installed version
    console.log("");
    console.log("Dependency versions after fontbakery installation:");
    await exec.exec("python -m pip list");
    await exec.exec("python -m pip show fontbakery");
  } catch (error) {
    core.setFailed(
      `font-bakery Action failed during fontbakery installation attempt with error: ${error.message}`
    );
  }
  // ==========================
  // Display files to be tested
  // ==========================
  try {
    const globber = await glob.create(`${buildPath}`);
    console.log("");
    console.log("Beginning fontbakery tests on the following files:");
    for await (const file of globber.globGenerator()) {
      console.log(file);
    }
    console.log("");
  } catch (error) {
    core.setFailed(
      `font-bakery Action failed during fontbakery file path display attempt with error: ${error.message}`
    );
  }
  // ========================
  // Execute fontbakery tests
  // ========================
  try {
    if (fbArgs !== "none") {
      await exec.exec(`fontbakery ${fbSubCmd} ${fbArgs} ${buildPath}`);
    } else {
      await exec.exec(`fontbakery ${fbSubCmd} ${buildPath}`);
    }
  } catch (error) {
    core.setFailed(
      `font-bakery Action failed during fontbakery execution attempt with error: ${error.message}`
    );
  }
}

run();
