
// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// ng.seed loads an ng app based on the directory structure

process.on('uncaughtException', function(err)
{
	console.log('UNCAUGHT BY SEED', err.stack)
})

var types    = {transform:[],interceptor:[],config:[],run:[],node_modules:[],view:[],animate:[],constant:[],controller:[],directive:[],factory:[],filter:[],provider:[],service:[],value:[]}
var fs       = require('fs')
var log      = require('ng/logger')
var env      = process.argv[2] || 'local'
var depth    = 1
var pkg      = require('../../package.json')
var requires = Object.keys(pkg.requires)
var modules  = {}

//2300
//Resursive
!function load(dir)
{
	fs.readdir(dir, function(err, files)
	{
		depth--

		var split  = dir.split('/')
		var parent = split.pop()
		var module = split.pop()

		//Keep track of our new module and its requires
		if ('node_modules' == module)
		{
			modules[parent] = []
		}

		for (var i in files)
		{
			//Stop if ng.seed or some system file
			if ('ng.seed' == files[i] || '.' == files[i][0])
			{
				continue
			}

			//If directory is a dependent, add it to the requires of its parent
			if ('node_modules' == parent)
			{
				depth++; load(dir+'/'+files[i]);

				modules[module].push(files[i])

				continue
			}

			//Recurse if directory is a special folder
			if (types[files[i]])
			{
				depth++; load(dir+'/'+files[i]);

				continue
			}

			//require() js files
			if ( '.js' == files[i].slice(-3))
			{
				name = files[i].slice(0, -3)

				data = require(dir+'/'+files[i])

				types[parent].unshift({module:module, name:name, data:data})
			}

			//readFileSync html files
			if ('.html' == files[i].slice(-5))
			{
				name = files[i].slice(0, -5).replace(/:/g, '/').replace(/\$/g, ':')

				data = fs.readFileSync(dir+'/'+files[i], 'utf8')  //Is there a way to make this async

				types[parent].push({module:module, name:name, data:JSON.stringify(data)})
			}
		}

		! depth && register()
	})
}(__dirname.slice(0, -21))

//Now that recursive, asyncronous load is done, let's register the modules in ng
function register()
{
	require('ng')(pkg.modules, function(ng)
	{
		//ng is now accessible everywhere!
		global.ng = ng

		//Register our modules
		for (var i in modules)
		{
			var module = ng.module(i, requires.concat(modules[i]))
		}

		for (var i in types)
		{
			//views are a concept unique to ng.seed and we have to handle them separately because
			//the order of the routes matters for which ones take precedence.  We explicily define
			//the behavior in the specificity function and make sure dependent modules, which are
			//loaded first don't get precedence in case of conflict
			if ('view' == i)
			{
				var when = ''

				types.view = types.view.sort(specificity).map(function(view)
				{
					when += "\n\n.when('/"+view.name+"',{template:"+view.data+"})"
				})

				module.config(Function('$routeProvider',  "$routeProvider"+when))

				continue
			}

			var singleArg = Object.keys(types).slice(0, 4)

			for (var j in types[i])
			{
				var file = types[i][j]

				var args = ~ singleArg.indexOf(i) ? [] : [file.name]

				var type = ng.module(file.module)[i]

				if ('function' == typeof file.data)
				{
					type.apply(null, args.concat(file.data))
				}

				if (file.data.client)
				{
					type.client.apply(null, args.concat(file.data.client))
				}

				if (file.data.server)
				{
					type.server.apply(null, args.concat(file.data.server))
				}
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

//Load the routes of all the modules into the last (most senior) module of the recursion
//otherwise dependent routes will get predenece over their parents when there is conflict
//I believe the preferred behavior here is to make the parent get precedence no matter
//what and only send to the dependent if there is no other option.  Let me know if I'm wrong.
//For routes in the same module the most specific ones are loaded first '/arg/:arg?' > '/arg' > '/:arg' > '/:arg?'
function specificity(a, b)
{
	function module(type)
	{
		return Object.keys(modules).indexOf(type.module)
	}

	function length(type, split)
	{
		return type.name.split(split).length
	}

	return module(a)     - module(b)
		 || length(b,'/') - length(a,'/')
		 || length(a,':') - length(b,':')
		 || length(a,'?') - length(b,'?')
}

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