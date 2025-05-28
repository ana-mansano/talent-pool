import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      // Adiciona headers de segurança
      response.header('X-Content-Type-Options', 'nosniff')
      response.header('X-Frame-Options', 'DENY')
      response.header('X-XSS-Protection', '1; mode=block')
      response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      response.header('Content-Security-Policy', "default-src 'self'")
      response.header('Referrer-Policy', 'strict-origin-when-cross-origin')

      const authHeader = request.header('Authorization')
      
      if (!authHeader) {
        Logger.warn('Tentativa de acesso sem token', {
          ip: request.ip(),
          url: request.url(),
          method: request.method()
        })
        return response.unauthorized({ 
          message: 'Token de autenticação não fornecido',
          code: 'TOKEN_MISSING'
        })
      }

      const token = authHeader.replace('Bearer ', '')
      
      try {
        const decoded = jwt.verify(token, Env.get('APP_KEY'), {
          algorithms: ['HS256'],
          maxAge: '24h'
        }) as any

        const user = await User.findOrFail(decoded.id)
      
        // Verifica se o usuário está verificado
        if (!user.emailVerified) {
          Logger.warn('Tentativa de acesso com email não verificado', {
            userId: user.id,
            email: user.email
          })
          return response.unauthorized({
            message: 'Email não verificado',
            code: 'EMAIL_NOT_VERIFIED'
          })
        }

        // Adiciona o usuário ao contexto da requisição
        request.user = user

        // Log de acesso bem-sucedido
        Logger.info('Acesso autorizado', {
          userId: user.id,
          email: user.email,
          role: user.role,
          url: request.url(),
          method: request.method()
        })

        await next()
      } catch (error) {
        Logger.error('Token inválido ou expirado', {
          error: error.message,
          token: token.substring(0, 10) + '...' // Log apenas parte do token por segurança
        })
        return response.unauthorized({ 
          message: 'Token inválido ou expirado',
          code: 'INVALID_TOKEN'
        })
      }
    } catch (error) {
      Logger.error('Erro de autenticação', {
        error: error.message,
        stack: error.stack
      })
      return response.unauthorized({ 
        message: 'Erro de autenticação',
        code: 'AUTH_ERROR'
      })
    }
  }
} 