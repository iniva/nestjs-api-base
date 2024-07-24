import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common'

export type MappedError = {
  [key: string]: string[]
}

export class BadRequestFactory {
  static mapErrors(errors: ValidationError[], parentProperty?: string): MappedError {
    const mappedError: MappedError = {}

    errors.forEach((error) => {
      const propertyName = parentProperty ? `${parentProperty}.${error.property}` : error.property

      if (error.children.length > 0) {
        const nestedMappedErrors = BadRequestFactory.mapErrors(error.children, propertyName)

        Object.entries(nestedMappedErrors).forEach(([errorKey, errorValues]) => {
          mappedError[errorKey] = errorValues
        })

        return
      }

      mappedError[propertyName] = Object.entries(error.constraints).map((constraint) =>
        constraint[1].replace(`${error.property} `, `[${error.value}] `),
      )
    })

    return mappedError
  }

  static createFromErrors(errors: ValidationError[]): BadRequestException {
    const mappedErrors: MappedError = BadRequestFactory.mapErrors(errors)

    return new BadRequestException({
      status_code: HttpStatus.BAD_REQUEST,
      error: mappedErrors,
    })
  }
}
