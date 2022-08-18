import { schema } from '../../utils/validation'

export const authValidation = {
  signUpSchema: {
    email: { ...schema.required, ...schema.email, ...schema.emailExist },
    password: { ...schema.required, ...schema.password },
    firstName: schema.required,
    lastName: schema.required
  },
  signInSchema: {
    email: { ...schema.required, ...schema.email },
    password: { ...schema.required, ...schema.password }
  },
  confirmEmailSchema: {
    token: { ...schema.required, ...schema.token }
  },
  sendResetEmailSchema: {
    email: { ...schema.required, ...schema.email }
  },
  resetPasswordSchema: {
    token: { ...schema.required, ...schema.token },
    password: { ...schema.required, ...schema.password }
  },
  updatePasswordSchema: {
    password: { ...schema.required, ...schema.password },
    newPassword: {
      ...schema.required,
      ...schema.password,
      ...schema.newPassword
    }
  }
}
