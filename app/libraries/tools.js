var fs = require('fs');

function readConf(configFile)
{
var data = fs.readFileSync(configFile,  'utf-8');
var myObj = null;

  try {
    myObj = JSON.parse(data);
  }
  catch (err) {
    //console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
  return myObj;
};

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
};


