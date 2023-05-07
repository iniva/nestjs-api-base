export type User = {
  id: string
  password: string
  email: string
  active: boolean
  firstname: string | null
  lastname: string | null
}

export type AuthedUser = Pick<
  User,
  'id' | 'email'
>
