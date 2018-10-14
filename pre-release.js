#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const util = require('./script-utilities');
const prompt = require('./prompt');
const updateVersion = require('./update-version');

const currentVersion = util.getCurrentVersion();
const versionBump = process.argv[2];
const isNewRc = !util.isPreRelease(currentVersion) && versionBump;

const errorMessage = `If you want to start cutting releases, specify what kind of release this is <major|minor|patch>`;
const rcPrompt = `Are you sure you're ready to enter rc phase?`;

function preRelease() {
	return preReleaseCheck()
		.then((shouldRc) => shouldRc || Promise.reject('version bump aborted'))
		.then(() => getNextVersion(currentVersion))
		.then((version) => updateVersion(version))
		.catch((err) => console.log(chalk.red(err)));
}

function preReleaseCheck() {
	if (!util.isPreRelease(currentVersion) && !versionBump) {
		return Promise.reject(errorMessage);
	}

	if (isNewRc) {
		return prompt.askYesNoQuestion(rcPrompt);
	}

	return Promise.resolve(true);
}

function getNextVersion(currentVersion) {
	if (isNewRc) {
		try {
			let nextVersion = util.getNextVersion(versionBump);
			return Promise.resolve(`${nextVersion}-rc.0`);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	return Promise.resolve(semver.inc(currentVersion, 'prerelease'));
}

preRelease();
