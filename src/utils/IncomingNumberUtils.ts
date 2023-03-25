import { FolderDto } from 'models/doc-main-models';

export const constructIncomingNumber = (folder: FolderDto): string => {
  const { nextNumber, year } = folder;
  try {
    const nextNumberString: string = nextNumber < 10 ? `0${nextNumber}` : nextNumber.toString();
    const yearString: string = year.toString();
    return `${nextNumberString}/${yearString}`;
  } catch (error) {
    return '';
  }
};
