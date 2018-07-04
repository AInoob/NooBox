const YAML = require('yamljs');
const fs = require('fs');

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist');
}
if (!fs.existsSync('./dist/_locales')) {
	fs.mkdirSync('./dist/_locales');
}

const generateLocale = (language, toLanguage) => {
	if(!toLanguage) {
		toLanguage = language;
	}
	if (!fs.existsSync('./dist/_locales/' + toLanguage)) {
		fs.mkdirSync('./dist/_locales/' + toLanguage);
	}
	fs.writeFile(
		'./dist/_locales/' + toLanguage + '/' + 'messages.json',
		JSON.stringify(YAML.parse(fs.readFileSync('./src/_locales/'+language+'.yml', 'utf8'))),
		{
			encoding: 'utf8'
		},
		() => {
			console.log('Generated ' + toLanguage + ' locale');
		}
	);
}

fs.readdir('./src/_locales', (err, dir) => {
	console.log('Generating locales');
	for(let i = 0; i < dir.length; i++) {
		const match = dir[i].match(/(\w+)\.yml/);
		if (match) {
			const language = match[1];
			generateLocale(language);
			if (language == 'zh_CN') {
				generateLocale('zh_CN', 'zh');
			}
		}
	}
});