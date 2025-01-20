const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");
const { updatePaths } = require("./build.js");

const git = simpleGit();
const distPath = path.join(__dirname, "../dist");

const config = {
  github: {
    remote: "https://github.com/zrea200/tetris-pwa.git",
    branch: "gh-pages",
    name: "GitHub",
  },
  gitee: {
    remote: "https://gitee.com/e-zrea/tetris-pwa.git",
    branch: "master",
    name: "Gitee",
  },
};

async function deploy() {
  const platform = process.argv[2];
  if (!platform || !config[platform]) {
    console.error("Please specify platform: github or gitee");
    process.exit(1);
  }

  const { remote, branch, name } = config[platform];

  try {
    // 确保dist目录存在
    if (!fs.existsSync(distPath)) {
      console.error("dist directory does not exist. Run build first.");
      process.exit(1);
    }

    // 初始化git
    await git.cwd(distPath);
    await git.init();

    // 添加远程仓库
    try {
      await git.addRemote(platform, remote);
    } catch (e) {
      // 如果远程仓库已存在，忽略错误
      console.log("Remote already exists, continuing...");
    }

    // 添加所有文件并提交
    await git.add(".");
    await git.commit(`Deploy to ${name} Pages`);

    // 在推送之前更新路径
    updatePaths(platform);

    // 推送到远程仓库
    await git.push(platform, `master:${branch}`, ["--force"]);

    console.log(`Successfully deployed to ${name}!`);

    if (platform === "gitee") {
      console.log("\n注意：");
      console.log("1. 请访问 Gitee 仓库的 Pages 服务");
      console.log("2. 点击'更新'按钮来部署最新代码");
    }
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

deploy();
