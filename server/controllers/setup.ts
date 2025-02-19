import fs from 'fs-extra';
import path from 'path';

// interfaces
interface files {
  [key: string]: string;
}

interface filesStatus {
  [key: string]: boolean;
}

interface defaultFileContent {
  [key: string]: string;
}

// files must to be there
const files: files = {
  tempJson: path.resolve(__dirname, '../../../data/.temp.json'),
  secureJson: path.resolve(__dirname, '../../../data/.secure.json'),
};
const defaultFileContent: defaultFileContent = {
  tempJson: require('../libs/setupDefaults/.temp.json.template.json'),
  secureJson: require('../libs/setupDefaults/.secure.json.template.json'),
};

const ensureFiles = async () => {
  try {
    const filesKey = Object.keys(files);
    const filesStatus: filesStatus = {};
    filesKey.forEach((file) => {
      filesStatus[file] = fs.existsSync(files[file]);
    });
    const filesToCreate = filesKey.filter((file) => !filesStatus[file]);
    if (filesToCreate.length > 0) {
      await Promise.all(
        filesToCreate.map(async (file) => {
          await fs.writeJSONSync(files[file], defaultFileContent[file]);
        })
      );
    }
  } catch (error) {
    throw new Error(`✗ Failed to ensure files, error: ${error}`);
  }
};

export { ensureFiles };
