import { Column, Entity } from 'typeorm'

@Entity()
export class UserEntity {
  @Column()
  id: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  username: string

  @Column({ nullable: true })
  firstname: string

  @Column({ nullable: true })
  lastname: string

  // Set to false when dealing with email verification flows
  @Column({ default: true })
  active: boolean
}
