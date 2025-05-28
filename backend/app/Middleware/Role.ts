import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class Role {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string | string[]
  ) {
    const user = request.user
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!user) {
      return response.unauthorized({
        message: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      })
    }

    if (!allowedRoles.includes(user.role)) {
      return response.forbidden({
        message: 'Acesso negado. Papel não autorizado',
        code: 'FORBIDDEN'
      })
    }

    await next()
  }
} 