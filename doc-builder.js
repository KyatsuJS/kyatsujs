const fs = require('fs');
const divide = (path = "./docs") => {
  const files = fs.readdirSync(path);
  if (path === "./docs") {
    files.forEach(file => {
        if (fs.statSync(`${path}/${file}`).isDirectory()) {
          divide(`${path}/${file}`);
        }
    });
  }
  else {
    files.forEach(file => {
      if (fs.statSync(`${path}/${file}`).isDirectory()) {
        divide(`${path}/${file}`);
      }
      else {
        fs.mkdirSync(`${path}/${file.split(".")[0]}`, { recursive: true });
        fs.renameSync(`${path}/${file}`, `${path}/${file.split(".")[0]}/index.md`);
      }
    });
  }
};
divide();