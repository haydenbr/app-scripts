const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

function updatePackageVersion(newVersion) {
	const packageJson = getPackageJson();

	packageJson.version = newVersion;

	return writeFile(path.resolve(__dirname, '..', 'package.json'), JSON.stringify(packageJson, null, 4));
}

function execFile(command, args) {
	return new Promise((resolve, reject) => {
		childProcess.execFile(command, args, (err, stdout) => (err ? reject(err) : resolve(stdout)));
	});
}

function isPreRelease(version) {
	return new RegExp(/\d+\.\d+\.\d+-rc\.\d+/).test(version);
}

function getCurrentVersion() {
	return getPackageJson().version;
}

function getNextVersion(versionBump) {
	const versionLevels = ['major', 'minor', 'patch'];

	if (!versionBump || !versionLevels.includes(versionBump)) {
		throw `when bumping the version, you must specify one of <${versionLevels.join('|')}>`;
	}

	let currentVersion = getCurrentVersion();
	return semver.inc(currentVersion, versionBump);
}

function getPackageJson() {
	return require(path.resolve(__dirname, '..', 'package.json'));
}

function readFile(filepath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
	});
}

function spawnPromise(command, args) {
	return new Promise((resolve, reject) => {
		let child = childProcess.spawn(command, args);

		child.stdout.on('data', (data) => process.stdout.write(data));
		child.stderr.on('data', (data) => process.stderr.write(data));

		child.on('close', (code) => (code === 0 ? resolve(code) : reject(code)));
	});
}

function writeFile(filepath, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, data, { flag: 'w' }, (err, data) => (err ? reject(err) : resolve(data)));
	});
}

module.exports = {
	updatePackageVersion,
	execFile,
	getCurrentVersion,
	getNextVersion,
	getPackageJson,
	isPreRelease,
	readFile,
	spawnPromise,
	writeFile,
};
