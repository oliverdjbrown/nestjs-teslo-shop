import { InternalServerErrorException, Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

const logger = new Logger('DataBase Errors');

export const handlerDbExceptions = (error) => {
  if (error.code === '23505') throw new BadRequestException(error.detail);
  logger.error(error);
  //INFO: set internal server exception
  throw new InternalServerErrorException();
};
