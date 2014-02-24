'use strict'

// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// ng.seed loads an ng app based on the directory structure
process.on('uncaughtException', function(err)
{
	console.log('UNCAUGHT BY SEED', err.stack)
})

var fs  = require('fs')
  , log = require('ng/logger')
  , pkg = require('../../package.json')
  , env = process.argv[2] || 'local'
  , finish  = 0
  , length  = __dirname.split('/').length + 1
  , types   =
   [
		'animate',
		'config',
		'constant',
		'controller',
		'directive',
		'factory',
		'filter',
		'provider',
		'run',
		'service',
		'value',
		'interceptor',
		'parse',
		'view'
   ]
  , mods = {}

process.chdir(__dirname.slice(0, -8))
//Catch errors that slip through and would cause node to crash

//Resursive
function load(dir)
{
	var path    = dir.split('/').slice(length)
	  , module  = path.shift()
	  , method  = path.shift()

	function filter(file)
	{
		//exclude hidden files and ng folder
		if ('.' == file[0] || 'ng.seed' == file)
		{
			return false
		}

		//already within an angular folder
		if (method)
		{
			return true
		}

		//continue recursion only if folder is angular or ng
		if (module)
		{
			return ~ types.indexOf(file)
		}

		return mods[file] = {}
	}

	fs.stat(dir, function(err, stat)
	{
		if (stat.isFile())
		{
			mods[module][method] = mods[module][method] || []

			var body = dir.slice(-3) == '.js' ? require(dir) : fs.readFileSync(dir)

			mods[module][method].push({path:path, body:body})

			if ( ! finish--)
			{
				require('ng')(pkg.modules, function(ng)
				{
					global.ng = global.angular = ng

					for (var mod in mods)
					{
						module = ng.module(mod, Object.keys(mods).concat(Object.keys(pkg.modules)))

						for (var type in mods[mod])
						{
							for (var i in mods[mod][type])
							{
								var fn = mods[mod][type][i]

								if ('view' == type)
								{
									fn.path = fn.path.join('/').slice(0, -5)

									//Mac filenames convert / to : and don't allow : so use $ instead
									if ('darwin' == process.platform)
									{
										fn.path = fn.path.replace(/:/g, '/').replace(/\$/g, ':')
									}

									fn.body = JSON.stringify(fn.body.toString())

									mods[mod][type][i] = ".when('/"+fn.path+"',{template:"+fn.body+"})"
								}
								else
								{
									var args = []

									if ('run' != type && 'config' != type && 'interceptor' != type && 'parse' != type)
									{
										args = [fn.path.join('').slice(0, -3)]
									}

									if ('function' == typeof fn.body)
									{
										module[type].apply(null, args.concat(fn.body))
									}

									if (fn.body.client)
									{
										module[type].client.apply(null, args.concat(fn.body.client))
									}

									if (fn.body.server)
									{
										module[type].server.apply(null, args.concat(fn.body.server))
									}
								}
							}
						}

						if (mods[mod].view)
						{ //Reverse() is a little trick/hack to get more specific routes like donate/:id? to appear before :email?
							module.config(Function('$routeProvider',  '$routeProvider\n'+mods[mod].view.reverse().join('\n')))
						}
					}

					module.config.server(function()
					{
						log.gray.bold(' in '+env+' environment')

						for (var i in pkg.ports)
						{
							require(pkg.ports[i]).createServer(ng).listen(i)
							log('listening for '+pkg.ports[i]+' on port '+i)
						}

						log('')
					})
				})
			}

			return
		}

		fs.readdir(dir, function(err, files)
		{
			finish--

			files.filter(filter).forEach(function(file)
			{
				finish++

				load(dir+'/'+file)
			})
		})

		//fs.watch(dir, {persistent:false}, function(event, file)
		//{
		//	//.DS_Store is inadvertantly triggering
		//	if ('.' == file[0]) return
		//
		//	//When reloading, we want the new file not the cached one
		//	delete require.cache[dir]
		//
		//	// to prevent CPU-splsions if saving too fast
		//	clearTimeout(time)
		//
		//	//time = setTimeout(function() { load(dir) }, 500)
		//})
	})
}

//Start loading process
load(__dirname+'/..')