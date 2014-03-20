'use strict'
// ng.seed > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------
// This the child process spawned by index.js.  It will continue to live
// even when user exits original program and/or closes the terminal. Our
// deamon is allowed to talk & listedn to the parent - over ipc - but when
// the parent closes, we want to redirect all of our output to our log files

//Daemon set stdout to 'ignore' so we redirect it to Daemon's ipc channel
process.stdout.write = function(data)
{
	process.send({type:'stdout', write:data})
}

//Daemon set stdout to 'ignore' so we redirect it to Daemon's ipc channel
process.stderr.write = function(data)
{
	process.send({type:'stderr', write:data})
}

process.env.NODE_ENV = process.argv[2]

process.chdir(__dirname+'/../../')

var log = require('fs').createWriteStream
  , pkg = require('../../package.json')

//ng is now accessible everywhere!
//this is our one & only global var
global.ng = {config:{}}

//Create a global config based on environment
for (var i in pkg)
{
	var env = pkg[i][process.env.NODE_ENV]

	//See documentation.  If env specified, use it. If env refers to a different
	//env, use that one instead. Else assume that all envs share the same config
	ng.config[i] = env ? pkg[i][env] ? pkg[i][env] : env : pkg[i]
}

var log =
	 { //Create log files while terminal can still show ENOENT errors
		stdout: log(ng.config.logs.stdout.file, {flags: 'a'}),
		stderr: log(ng.config.logs.stderr.file, {flags: 'a'})
	 }

//Parent disconnected - no more console output - redirect to log files
process.on('disconnect', function()
{
	process.send = function(data)
	{
		var prefix = ng.config.logs[data.type].prefix

		prefix = prefix ? prefix+' ' : ''

		var date = (new Date).toJSON().slice(0, -5)

		log[data.type].write(date+' '+prefix+data.write)
	}
})

process.on('uncaughtException', function(err)
{
	console.log('UNCAUGHT BY NG.SEED\n', err.stack)
})

require('./loader')(__dirname.slice(0, -21))

//Experiment with long error stacks
//
//nextTick = process.nextTick
//
//process.nextTick = function()
//{
////	console.log(arguments[0].toString())
//
//	nextTick.apply(this, arguments)
//}