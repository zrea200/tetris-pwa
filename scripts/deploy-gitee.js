const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");

const git = simpleGit();
const distPath = path.join(__dirname, "../dist");

async function deploy() {
  try {
    // 确保dist目录存在
    if (!fs.existsSync(distPath)) {
      console.error("dist directory does not exist. Run build first.");
      process.exit(1);
    }

    // 初始化git
    await git.cwd(distPath);
    await git.init();

    // 添加Gitee远程仓库（需要替换为你的Gitee仓库地址）
    await git.addRemote("gitee", "https://gitee.com/你的用户名/tetris-pwa.git");

    // 添加所有文件并提交
    await git.add(".");
    await git.commit("Deploy to Gitee Pages");

    // 推送到Gitee
    await git.push("gitee", "master:master", ["--force"]);

    console.log("Successfully deployed to Gitee!");
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

deploy();
