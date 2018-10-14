const inquirer = require('inquirer');

function askYesNoQuestion(question) {
	let questionKey = 'confirm';

	return inquirer
		.prompt([
			{
				type: 'confirm',
				name: questionKey,
				message: question,
			},
		])
		.then((data) => data[questionKey]);
}

module.exports = {
	askYesNoQuestion,
};
