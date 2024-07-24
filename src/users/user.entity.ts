import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ type: 'text' })
  id: string

  @Column({ type: 'text' })
  password: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({ name: 'first_name', type: 'text', nullable: true })
  firstName: string

  @Column({ name: 'last_name', type: 'text', nullable: true })
  lastName: string

  @Column({ default: false })
  active: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone', nullable: true })
  updatedAt: Date
}
