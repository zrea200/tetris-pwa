const fs = require("fs");
const path = require("path");

function updatePaths(platform) {
  const basePath = platform === "gitee" ? "/tetris-pwa" : "/tetris-pwa/";

  // 更新 manifest.json
  const manifestPath = path.join(__dirname, "../dist/manifest.json");
  const manifest = require(manifestPath);
  manifest.start_url = basePath;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // 更新 service-worker.js
  const swPath = path.join(__dirname, "../dist/service-worker.js");
  let swContent = fs.readFileSync(swPath, "utf8");
  swContent = swContent.replace(/\/tetris-pwa\/?/g, basePath);
  fs.writeFileSync(swPath, swContent);
}

module.exports = { updatePaths };
