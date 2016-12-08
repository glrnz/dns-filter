    'use strict';
var fs = require('fs');
var check = require('syntax-error');
var exec = require('child_process').exec;

var file = 'dns-server.js';
var src = fs.readFileSync(file);

var err = check(src, file);
if (err) {
    console.error('ERROR DETECTED!!');
    console.error(err);
    console.error(Array(76).join('-'));
}
else{
exec('forever start dns-server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

}