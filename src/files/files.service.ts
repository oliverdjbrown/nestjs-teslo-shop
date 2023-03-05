import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticFile(fileName: string) {
    const path = join(__dirname, '../../static/uploads', fileName);
    if (!existsSync(path)) {
      throw new BadRequestException(`Not file found with name ${fileName}`);
    }
    return path;
  }
}
