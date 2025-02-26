const { exec } = require("child_process");
const path = require("path");

const commands = [
  {
    path: path.join(__dirname, "client"),
    command: "npm run dev",
  },
  {
    path: path.join(__dirname, "server", "caption_service"),
    command: "uvicorn main:app --host 0.0.0.0 --port 3002",
  },
  {
    path: path.join(__dirname, "server", "upload_service"),
    command: "npm start",
  },
];

commands.forEach(({ path, command }) => {
  exec(`start cmd /K "cd ${path} && ${command}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
