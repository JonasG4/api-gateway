import { MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

export const fileValidators = {
  logo: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
    new FileTypeValidator({
      fileType: '.(jpg|jpeg|png)',
    }),
  ],
  foto_candidato: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
    new FileTypeValidator({
      fileType: '.(jpg|jpeg|png)',
    }),
  ],
};
