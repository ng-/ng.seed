# ng.seed: create a modular [ng app](https://github.com/ng-/ng)
ng.seed aims to make it dead simple to create a modular application using the [ng framework](https://github.com/ng-/ng)

###ng is right for you if:
- You want to use npm as a package manager to create, organize, & share ng modules
- You want access to an ecosystem of npm packages (anything with an “ng.” prefix)
- You want a modular application with a matching directory structure
- You want to have simple environmental settings & run on all your server's cores

## getting started
1. Goto to your favorite command prompt or terminal program

2. Install [node](http://nodejs.org/api/) if you haven't yet. [Install it manually](https://gist.github.com/isaacs/579814) or with this command:

		curl http://github.com/ng-/ng.seed/raw/master/node.sh | sh

3. Goto the diretory where you want your application, and install ng.seed

		npm install ng-/ng.seed

4. Upon successful installation, you will be prompted to name your application

		What would you like to name your application? myProject

	Answering `myProject` would create the following
	- myProject/package.json (modify this as you need)
	- myProject/node_modules/ng.seed (this loads your modules)
	- myProject/node_modules/ng.seed/node_modules/ng (the ng framework)

5. Start your application

		node node_modules/myProject <environment>

	environment - such as local, test, live - will be available as process.env.NODE_ENV

	In the browser, `http://localhost:1080` should display "Welcome to ng.seed!"

6. Continue application as a daemon

		ctrl-c

	Your application's input and output will be redirected from the terminal to the log files specified in package.json

7. End or restart your application

		node myProject stop|restart

8. Install modules as dependencies

		npm install myProject --save <dependency>

	All ng.seed dependencies should begin with an `ng.` prefix

9. Build your application using this readme as a guide

10. Share it with others!

		npm publish myProject

####Note about running as root:
Don’t install or run nave/node/npm as root because of security vulnerabilities. When not root, the only thing you won’t be able to do is listen on ports less than 1024.  Listen on a port > 1024 and use ip-table to forward ports 80 & 443 to the ones your server is actually listening to

## how it works
ng.seed uses your directory structure to organize and load your ng application. Each folder in node_modules becomes an ng module. If the module contains additional modules in its node_modules folder, then those modules are also loaded and their names are automatically entered into the module's "requires" array.

Files contained within subdirectories named 'animate', 'config', 'constant', 'controller', 'directive', 'factory', 'filter', 'provider', 'run', 'service', 'value', 'stack', 'parse' of the modules will be loaded into  angular automatically as that type. Other folders within a module will be ignored.

The name provided to ng will be the name of the file. For example, myapp/node_modules/module1/factory/example.js will be registered as ng.module(‘module1’, []).factory(‘example’, `<code>`)

You define modules much like you would in node.js or angular.  For example in myapp/node_modules/module1/factory/example.js
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

To use a third-party ng library simply add it to your package.json as a dependency or have npm do it for you by using `npm install --save <package-name>`

## config

By default, ng.seed loads the bleeding-edge of angular on `http port 1080`.  Edit your projects package.json if you wish to stay on a particular version (google's cdn is highly recommended for production) or change the default protocol/port.

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
