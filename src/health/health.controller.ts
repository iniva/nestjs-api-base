import { Controller, Get } from '@nestjs/common'
import { version } from '../../package.json'

type HealthResponse = {
  message: string
  version: string
}

@Controller('health')
export class HealthController {
  @Get()
  get(): HealthResponse {
    return {
      message: 'All good here, thanks for asking!',
      version,
    }
  }
}
