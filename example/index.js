var param = require('../index');
var port = param('app.port');

process.cwd(__dirname);
console.log(port);
