process.chdir(__dirname);

var param = require('../index');
var port = param('app.port');

console.log('port is '+port);
console.log('rest of the config', param());
