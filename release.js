#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const util = require('./script-utilities');
const prompt = require('./prompt');
const updateVersion = require('./update-version');
const currentVersion = util.getCurrentVersion();

const errorMessage = `
Current version is VERSION
Only use this release script when you are currently in rc and you're ready to go live
`;
const firstPrompt = 'Are you sure you want to release?';
const secondPrompt = 'Are you really, really sure?';

function release() {
	return preReleaseCheck()
		.then(() => prompt.askYesNoQuestion(firstPrompt))
		.then((shouldRelease) => shouldRelease && prompt.askYesNoQuestion(secondPrompt))
		.then((shouldRelease) => shouldRelease || Promise.reject('release aborted'))
		.then(() => getNextVersion(currentVersion))
		.then((version) => updateVersion(version))
		.catch((err) => console.log(chalk.red(err)));
}

function preReleaseCheck() {
	if (!util.isPreRelease(currentVersion)) {
		return Promise.reject(errorMessage.replace('VERSION', currentVersion));
	}

	return Promise.resolve();
}

function getNextVersion(currentVersion) {
	return semver.coerce(currentVersion).version;
}

release();
