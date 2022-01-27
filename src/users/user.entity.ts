import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id: string

  @Column()
  password: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  firstname: string

  @Column({ nullable: true })
  lastname: string

  // Set to false when dealing with email verification flows
  @Column({ default: true })
  active: boolean
}
