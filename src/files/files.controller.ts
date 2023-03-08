import { BadRequestException, Controller, Post } from '@nestjs/common';
import {
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileName } from './helpers/fileName.helper';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:fileName')
  //INFO: Res decorator allows to control the request
  //INFO: param decorator extract the params properties from request
  findFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const path = this.filesService.getStaticFile(fileName);
    res.sendFile(path);
  }

  //INFO: endpoint to post files on server
  @Post('product')
  //INFO: implements interceptor and parameter decorator for catching files
  @UseInterceptors(
    FileInterceptor('file', {
      //INFO: implements file filter for file validations property
      fileFilter: fileFilter,
      //INFO: implements upload file size limit property
      //limits: { fileSize: 1000 }
      //INFO: implements Disk storage location property
      storage: diskStorage({
        //INFO: file disk storage root destination
        destination: './static/uploads',
        //INFO: rename stored files
        filename: fileName,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    //const secureUrl = `${file.filename}`;
    //INFO: use an environment variable in controller
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return { secureUrl };
  }
}
