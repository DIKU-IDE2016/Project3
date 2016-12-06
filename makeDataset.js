// inspiration: http://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js/11194896
// Used with node v0.12.7
// Usage: node makeDataset.js /path/to/your/desired/dir

var fs = require('fs'),
    path = require('path')

function dirTree(filename) {
    
    var stats = fs.lstatSync(filename),
        info = {
            // path: filename,
            "name": path.basename(filename)
        };

    if (stats.isDirectory()) {
        // info.type = "folder";
        info["children"] = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    }

    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    console.log(JSON.stringify(dirTree(process.argv[2]), null, 2));
}
