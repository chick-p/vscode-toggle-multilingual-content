import * as path from "path";
import Mocha from "mocha";
import glob from "glob";

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  try {
    // Glob test files
    const jsFiles = await glob("**/**.test.js", { cwd: testsRoot });
    jsFiles.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

    mocha.run((failures: any) => {
      if (failures > 0) {
        throw new Error(`${failures} tests failed.`);
      }
      return;
    });
  } catch (err) {
    console.error(err);
  }
}
