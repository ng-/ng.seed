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

var fs  = require('fs')
  , pkg = require('../../package.json')
  , log =
	 { //Create log files while terminal can still show ENOENT errors
		stdout: fs.createWriteStream(pkg.logs.stdout.file, {flags: 'a'}),
		stderr: fs.createWriteStream(pkg.logs.stderr.file, {flags: 'a'})
	 }

//Parent disconnected - no more console output - redirect to log files
process.on('disconnect', function()
{
	process.send = function(data)
	{
		var prefix = pkg.logs[data.type].prefix

		prefix = prefix ? prefix+' ' : ''

		var date   = (new Date).toJSON().slice(0, -5)

		log[data.type].write(date+' '+prefix+data.write)
	}
})

process.on('uncaughtException', function(err)
{
	console.log('UNCAUGHT BY SEED', err.stack)
})

require('./loader')(__dirname.slice(0, -21))

//nextTick = process.nextTick
//
//process.nextTick = function()
//{
////	console.log(arguments[0].toString())
//
//	nextTick.apply(this, arguments)
//}