#!/usr/bin/env node

const chalk = require('chalk');

const gitUtil = require('./git-utilities');
const util = require('./script-utilities');
const generateVersionFile = require('./generate-version-file');

const versionBump = process.argv[2];

function updateVersion(version) {
	return checkTag(version)
		.then(() => console.log(`\nbumping to version ${chalk.bold(version)}\n`))
		.then(() => util.updatePackageVersion(version))
		.then(() => generateVersionFile(version))
		.then(() => commitAndTag())
		.then(() => gitPush());
}

function checkTag(version) {
	return gitUtil.existsTag(version).then((exists) => {
		if (exists) {
			throw `version ${nextVersion} already exists. Get your commit history in line with origin before version bumping`;
		}
	});
}

function commitAndTag() {
	let version = util.getCurrentVersion();
	return gitUtil.commit(version).then(() => gitUtil.tag(version));
}

function gitPush() {
	let tag = util.getCurrentVersion();
	return gitUtil.push().then(() => gitUtil.pushTag(tag));
}

module.exports = updateVersion;
