import { Provider } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { DATA_SOURCE, USER_REPOSITORY } from '@/database/constants'
import { UserEntity } from './user.entity'

export const userProviders: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [DATA_SOURCE],
  },
]
