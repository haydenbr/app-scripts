#!/usr/bin/env node
const chalk = require('chalk');
const util = require('./script-utilities');
const updateVersion = require('./update-version');

const versionBump = process.argv[2];

function bump() {
	return getNextVersion(versionBump)
		.then((version) => updateVersion(version))
		.catch((err) => console.log(chalk.red(err)));
}

function getNextVersion(versionBump) {
	return Promise.resolve(util.getNextVersion(versionBump));
}

bump();
