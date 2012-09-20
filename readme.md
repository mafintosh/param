# param

a tiny module to read config parameters for your node application.  
it's avaiable through npm:

	npm install param

param exposes a function that finds a config parameter

	// example.js
	var param = require('param');
	var port = param('app.port');

	console.log(port);

the above example tells param to find the parameter `app.port`.
it does so by first looking at the command line arguments

	node example.js --app.port 8080 # prints 8080

if present param will simply return that value.  
otherwise param will look for a configuration file based on `--config [filename]` or your `NODE_ENV` env var.

if `NODE_ENV=development` it will look for a config file called `development.json` or `development.js` and so on.

it will start looking for the config file in `.` and `./config`. if it doesn't exist it will try in `..` and `../config` until it reaches `/`.

	// development.json
	{
		app: {
			port: 8888
		}
	} 


	node example.js # prints 8888

happy configuring! (license is mit)