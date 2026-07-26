export class User {
  declare id: string
  declare email: string
  declare password: string
  declare firstName: string | null
  declare lastName: string | null
  declare active: boolean
  declare createdAt: Date
  declare updatedAt: Date | null
}

export type AuthedUser = Pick<User, 'id' | 'email'>
