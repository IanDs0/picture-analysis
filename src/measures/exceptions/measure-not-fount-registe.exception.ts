import { HttpException, HttpStatus } from '@nestjs/common';

export class MeasureNotFoundRegisterException extends HttpException {
  constructor() {
    super(
      {
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}