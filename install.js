'use strict'

// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// ng.seed loads an ng app based on the directory structure

var fs  = require('fs')
  , log = require('ng/logger')
  , rl  = require('readline').createInterface(process.stdin, process.stdout)
  , pkg = fs.existsSync('../../package.json') && require('../../package.json')

//Only run install script on fresh install, not when a dependency
//is there a better way to check this (an npm flag within process?)
if (pkg.dependencies && pkg.dependencies['ng.seed'])
{
	process.exit()
}

!function install()
{
	log.bold.gray("Welcome to ng.seed!")

	rl.question("What would you like to name your application? ", function(name)
	{
		fs.mkdir('../'+name, {flag:'wx'}, function(err)
		{
			if (err)
			{
				log.yellow(name+' already exists. Please choose another name\n')

				return install()
			}

			fs.mkdir('../'+name+'/node_modules', function(err)
			{
				var pkg = JSON.stringify
				({
					name: name,
					description: 'a modular ng application',
					version: '0.0.0',
					main:'node_modules/ng.seed',
					dependencies:
					{
						'ng.seed':'ng-/ng.seed'
					},
					requires:
					{
						ng:'http://code.angularjs.org/snapshot/angular.js',
						ngRoute:'http://code.angularjs.org/snapshot/angular-route.js'
					},
					logs:
					{
						// Avoid publishing your log file by making default
						// path be in node_modules which is ignored by npm
						stderr:{file:'node_modules/log.txt', prefix:'Error -'},
						stdout:{file:'node_modules/log.txt', prefix:''}
					},
					ports: {1080:'http'}
				}, null,'   ')

				fs.writeFile('../'+name+'/package.json', pkg, function(err)
				{
					fs.rename('../ng.seed', '../'+name+'/node_modules/ng.seed', function(err)
					{
						log.cyan("\n\n*** Installation Completed Successfully ***")
						log.gray("create or npm [--save] install at least one module into "+name+"/node_modules")
						log.gray("then simply use 'node "+name+" local/test/live' to start your new application.")
						log.gray("visit https://npmjs.org/package/ng.seed for detailed instructions and examples.\n\n")

						rl.close()
					})
				})
			})
		})
	})
}()