import path from 'path';
import dangerJs from './plugins';

dangerJs({
  inputFilePath: path.join(__dirname, './example/analyser-output.md'),
});
