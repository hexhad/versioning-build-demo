const fs = require('fs');
const shelljs = require('shelljs');

let filePath = "android/app/build.gradle";

let versionCodeRegX = /(?<=versionCode\s)(\d+)/g;
let versionNameRegX = /(?<=versionName ")(\d+).(\d+)/g;

fs.readFile(filePath, "utf8", async (err, doc) => {
  if (err) {
    console.log(err);
  }

  let versionCode = doc.match(versionCodeRegX);
  let versionName = doc.match(versionNameRegX);

  let currentCode = Number.parseInt(versionCode[0]);

  let splitVersionName = versionName[0].split(".");

  let newVersionCode = currentCode + 1;
  let newVersionName = `${splitVersionName[0]}.${
    Number.parseInt(splitVersionName[1]) + 1
  }`;

  var res = await doc
    .replace(versionCodeRegX, newVersionCode)
    .replace(versionNameRegX, newVersionName);

  await updateDoc(res, newVersionCode, newVersionName);
});

async function updateDoc(content, newVersionCode, newVersionName) {
  await fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("versionCode ",newVersionCode);
    console.log("versionName ",newVersionName);
    console.log("Updated !!");


    shelljs.exec("cd android && gradlew clean assembleRelease");

    let outputPath = 'android/app/build/outputs/apk/release/';
    let date = new Intl.DateTimeFormat('en-UK').format(new Date()).replaceAll('/','-');


    shelljs.exec(`mv ${outputPath}app-release.apk ${outputPath}H-${date}-${newVersionName}.apk`);
  });
}