import {
  BadRequestException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common'

export class BadRequestFactory {
  static fromErrors(errors: ValidationError[]): BadRequestException {
    const mappedErrors = {}

    errors.forEach((error) => {
      mappedErrors[error.property] = Object.entries(
        error.constraints,
      ).map((constraint) => constraint[1].replace(`${error.property} `, ''))
    })

    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      error: mappedErrors,
    })
  }
}
