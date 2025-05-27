import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class Manager {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // Em uma implementação real, você obteria o usuário atual da autenticação
    // Por enquanto, vamos apenas permitir o acesso sem verificar se é um gestor
    
    // Na implementação real, seria algo assim:
    // const user = auth.user
    // if (user.role !== 'manager') {
    //   return response.forbidden({ message: 'Acesso negado. Apenas gestores podem acessar este recurso.' })
    // }

    await next()
  }
} 