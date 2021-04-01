import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'

type HealthResponse = {
  message: string
  version: string
}

@Controller('health')
export class HealthController {
  @Get()
  get(@Req() req: Request): HealthResponse {
    return {
      message: 'All good here, thanks for asking!',
      version: req.app.get('version'),
    }
  }
}
