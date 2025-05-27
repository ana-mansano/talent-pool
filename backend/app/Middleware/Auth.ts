import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      const authHeader = request.header('Authorization')
      
      if (!authHeader) {
        return response.unauthorized({ 
          message: 'Token de autenticação não fornecido',
          code: 'TOKEN_MISSING'
        })
      }

      const token = authHeader.replace('Bearer ', '')
      
      try {
        const decoded = jwt.verify(token, Env.get('APP_KEY')) as any
        
        const user = await User.findOrFail(decoded.id)
        
        // Adiciona o usuário ao contexto da requisição
        request.user = user
        
        await next()
      } catch (error) {
        return response.unauthorized({ 
          message: 'Token inválido ou expirado',
          code: 'INVALID_TOKEN'
        })
      }
    } catch (error) {
      return response.unauthorized({ 
        message: 'Erro de autenticação',
        code: 'AUTH_ERROR'
      })
    }
  }
} 