# ng.seed: create a modular [ng app](https://github.com/ng-/ng)
ng.seed aims to make it dead simple to create a modular application using the [ng framework](https://github.com/ng-/ng)

#####ng is right for you if:
- You want to use npm as a package manager to create, organize, & share ng modules
- You want access to an ecosystem of npm packages (anything with an “ng.” prefix)
- You want a modular application with a matching directory structure
- You want to have simple environmental settings & run on all your server's cores

## getting started
1. Goto to your favorite command prompt or terminal program

2. Install [node](http://nodejs.org/api/) if you haven't yet. [Install it manually](https://gist.github.com/isaacs/579814) or with this command:

		curl http://github.com/ng-/ng.seed/raw/master/node.sh | sh

	This will install and use the latest stable version of node, to specify a version edit `~/.bashrc`

3. Goto the diretory where you want your application, and install ng.seed

		npm install ng-/ng.seed

4. Upon successful installation, you will be prompted to name your application

		What would you like to name your application? myProject

	Answering `myProject` would create the following
	- `myProject/package.json` (this is your config file)
	- `myProject/node_modules/ng.seed` (this loads your modules)
	- `myProject/node_modules/ng.seed/node_modules/ng` (the ng framework)

5. Start your application

		node node_modules/myProject <environment>

	`<environment>` is available inside your application as `process.env.NODE_ENV`

	In the browser, `http://localhost:1080` should now display "Welcome to ng.seed!"

6. Continue application in background as a daemon

		ctrl-c

	Input and output will now be redirected from the terminal to the log files specified in `package.json`

7. Quit or restart your application

		node myProject stop|restart

8. Install modules as dependencies

		npm install myProject --save <dependency>

	All ng.seed dependencies should begin with an `ng.` prefix

9. Build your application using this readme.md as a guide

10. Share your application with others!

		npm publish myProject

## how it works
ng.seed uses your directory structure to organize and load your ng application. The easiest way to learn is to explore one of the existing projects listed at the end of this readme.

Starting in `myProject` ng.seed recursively search for folders named `node_modules`. Each of these folders becomes an ng module. If a module contains modules in its `node_modules` folder, then those modules are loaded and their names are automatically entered into the parent module's "requires" array.

Each module can contain any number of files and folders, however, folder's named after an ng service (e.g., `animate`, `config`, `constant`, `controller`, `directive`, `factory`, `filter`, `provider`, `run`, `service`, `value`, `stack`, `parse`) will have their files loaded into ng as that type.

ng.seed will use the name of the file as the name it registers with ng. For example, `myapp/node_modules/module1/factory/example.js` will be registered as `ng.module('module1', []).factory('example', <code>)`

You define services much like you would in node.js or angular.  For example in `myapp/node_modules/module1/factory/example.js`
```javascript
module.exports = function(dependency1, dependency2)
{
	//I am initialization code that runs only once, the first time that this factory is injected

	return {
		// I am the object that is available to service that injected me
	}
}
```

As with ng, the default is identical client & server behavior.  To exert more fine-grained control over
```javascript
exports.client = function(dependency1, dependency2)
{
	return //injecting "example" on client is completely different than on the server
}

exports.server = function(dependency3, dependency4)
{
	return //injecting "example" on server is completely different than on the client
}
```

## dependencies
To use a third-party ng library simply add it to your `package.json` as a dependency.  When you publish your project as a dependency, please use the "ng." prefix.  Preserving this namespace is helpful for other developers to discover your project.

## config
All config options are contained in your project's `package.json`. By default, ng.seed loads the bleeding-edge of angular on `http port 1080`.  Edit `package.json` if you wish to stay on a particular version (google's cdn is highly recommended for production), change the location/prefix of your log files, or change the default protocol/port.

## running as root
Don’t install or run nave/node/npm as root because of security vulnerabilities. When not root, the only thing you won’t be able to do is listen on ports less than 1024.  Instead, listen on a port > 1024 (e.g., the default is 1080 for http and 1443 for https) and use ip-table to forward ports 80 & 443 to the ones your server is actually listening to

## changelog
### experimental2
- Added automatic daemon functionality
- Added log file config to package.json
- Refactored code into separate files

## todos
- Environment based Config
- Override $apply $digest on server for performance?
- Better Error stacks, like long-stack-trace
- Documentation: explain Global ng Var
- Duplication detection before overwrite
- Use fs.watch to do automatic reloads
- Use the cluster module to run multi-thread

## related projects
- [ng](https://github.com/ng-/ng): angular reimagined
- [ng.data](https://github.com/ng-/ng.data): simple getter/setter for data persistence
- ng.cql: realtime cassandra database syncing
- [ng.auth](https://github.com/ng-/ng.auth): example authentication using ng interceptors
- [ng.crud](https://github.com/ng-/ng.crud): example demonstrating a simple crud application using ng.seed
- [ng.style](https://github.com/ng-/ng.style): alert and input helpers for use with twitter bootstrap
