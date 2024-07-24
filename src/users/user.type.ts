export type User = {
  id: string
  password: string
  email: string
  active: boolean
  firstName?: string | null
  lastName?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export type AuthedUser = Pick<User, 'id' | 'email'>
