const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
let db = {};

//getting all files
fs.readdirSync(__dirname).filter(file=>{
    return(file.indexOf("." !==0 && file !== basename && file.slice(-3) === ".js"));
}).forEach(file => {
    if(file != "index.js") {
        const model = require(path.join(__dirname, file))
        const filename = file.replace(".js","")
        db[filename] = model
    }
})

module.exports = db;