import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ type: 'text' })
  declare id: string

  @Column({ type: 'text' })
  declare password: string

  @Column({ type: 'text', unique: true })
  declare email: string

  @Column({ name: 'first_name', type: 'text', nullable: true })
  declare firstName: string | null

  @Column({ name: 'last_name', type: 'text', nullable: true })
  declare lastName: string | null

  @Column({ default: false })
  declare active: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  declare createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone', nullable: true })
  declare updatedAt: Date | null
}
