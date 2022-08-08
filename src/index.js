// const prompt = require('prompt');
const YAML = require('yaml');
const { Command } = require('commander');
const program = new Command();
const version = require('../package.json').version;
const fs = require('fs');
const path = require('path');

const autoFile = '.autov.yaml';
const defaultAutovPath = path.join(__dirname, `../${autoFile}`);

const parse = (filePath = defaultAutovPath) => {
  const _path = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, '../', filePath);
  if (!fs.existsSync(_path)) {
    console.error('No such file :', _path);
    return process.exit(1);
  }
  return YAML.parse(fs.readFileSync(_path, 'utf8'));
};

const writeFile = (obj, filePath = defaultAutovPath) => {
  const _path = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, '../', filePath);

  return fs.writeFileSync(_path, YAML.stringify(obj));
};

const splitVersion = (version) => {
  if (!version) return;
  const arr = `${version}`.split('.');
  const _v = ['0', '0', '0'];
  for (let index = 0; index < _v.length; index++) {
    !!arr[index] && (_v[index] = arr[index]);
  }
  return _v;
};

program.name('autov').description('CLI to increasing version').version(version);

program
  .command('init')
  .description(`Init ${autoFile}`)
  .action(() => {
    writeFile({
      autov: {
        version: '1.0.0',
      },
    });
  });

program
  .command('pre')
  .description('Get previous version')
  .option('-c, --config <string>', `Path to ${autoFile}`)
  .action((opts) => {
    const res = parse(opts.config);
    const versions = splitVersion(res.autov.version);
    console.log(versions.join('.'));
  });

program
  .command('next')
  .description('Get next version')
  .option('-c, --config <string>', `Path to ${autoFile}`)
  .option('-s, --save', `Save new version to file`)
  .action((opts) => {
    const res = parse(opts.config);
    const versions = splitVersion(res.autov.version);
    versions[2] = parseInt(versions[2]) + 1;
    const nextV = versions.join('.');
    console.log(nextV);
    res.autov.version = nextV;
    opts.save && writeFile(res, opts.config);
  });

program.parse();

// var schema = {
//   properties: {
//     name: {
//       pattern: /^[a-zA-Z\s\-]+$/,
//       message: 'Name must be only letters, spaces, or dashes',
//       required: true,
//     },
//     password: {
//       hidden: true,
//     },
//   },
// };

//
// Start the prompt
//
// prompt.start();

//
// Get two properties from the user: name, password
//
// prompt.get(schema, function (err, result) {
//   //
//   // Log the results.
//   //
//   console.log('Command-line input received:');
//   console.log('  name: ' + result.name);
//   console.log('  password: ' + result.password);
// });
