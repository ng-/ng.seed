'use strict'

var child = require('child_process')
  , name  = require('path').basename(process.argv[1])
  , type  = process.argv[2]

child.exec("pgrep -fl 'node "+__dirname+"/daemon'", function(err, old)
{
	//Remove \n at end of old environment
	old = old && old.slice(0, -1).split(' ')

	if ('stop' == type || 'restart' == type)
	{
		if (old)
		{
			var pid = old.shift()

			child.exec("kill "+pid)

			console.log("stopped %s on pid %s", name, pid)
		}
		else
		{
			console.log("%s is not running", name)
		}

		if ('restart' == type)
		{
			type = old[2]
		}
	}

	if ( ! type)
	{
		return console.log('%s needs <env> set', name)
	}

	if ('stop' != type)
	{
		if (old.length != 4)
		{
			//Spawn lets stdin - but not stdout or stderr - work with detached
			var daemon = child.spawn("node", [__dirname+"/daemon", type],
			{
				detached:true, stdio:[0, 'ignore', 'ignore', 'ipc']
			})

			//We use ipc channel to replace stdout and stderr since values
			//'pipe' or 'inherit' will cause child to hang up with daemon
			daemon.on('message', function(data)
			{
				process[data.type].write(data.write)
			})

			//We can close this process and leave the daemon running
			//give user instructions on how to stop the daemon
			process.on('SIGINT', function()
			{
				console.log("\n\n%s running on pid %s", name, daemon.pid)
				console.log("'node %s stop' to quit\n\n", name)

				process.exit()
			})
		}
		else
		{
			console.log('%s is already running', name)
		}
	}
})