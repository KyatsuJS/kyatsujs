const fs = require("fs");

// All the folders of the "./lib" folder.
const folders = fs.readdirSync("./lib");

// Remove all the folders.
folders.forEach((folder) => {
    // Pass if the folder is not a directory.
    if (!fs.lstatSync(`./lib/${folder}`).isDirectory()) return;
    // Remove the folder.
    fs.rm(`./lib/${folder}`, () => {});
});