# param

A tiny module to read config parameters for your node application.
It's avaiable through npm:

	npm install param

## what?

Param exposes a single function that finds a config parameter

``` js
// example.js
var param = require('param');
var port = param('app.port');

console.log(port);
```

The above example tells param to find the parameter `app.port`.
It does so by first looking at the command line arguments

	node example.js --app.port 8080 # prints 8080

If present param will simply return that value.
Otherwise param will look for a configuration file specified by `--config [filename]` or your `NODE_ENV` env var.
If `NODE_ENV=development` it will look for a config file called `config/development.json` or `config/development.js`.
It will start looking for the config file in `.` If it doesn't exist it will try in `..` until it reaches `/`.

``` js
{
	"app": {
		"port": 8888
	},
	"certificate": "{./certificate.file}",
	"apikey": "{$API_KEY}"
}
```

`{$API_KEY}` reads `API_KEY` from the environment. Equivalent to `process.env.API_KEY`.

`{./certificate.file}` reads the file called `certificate.file`.

Running the example again with the above file saved as `config/development.json`

	node example.js # prints 8888

Happy configuring!

## License

MIT
