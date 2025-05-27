import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Candidate from 'App/Models/Candidate'
import { v4 as uuidv4 } from 'uuid'
import Hash from '@ioc:Adonis/Core/Hash'
import EmailService from 'App/Services/EmailService'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AuthController {
  private generateToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      Env.get('APP_KEY'),
      { expiresIn: '24h' }
    )
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name', 'email', 'role'])

      // Verifica se o email já está em uso
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.conflict({ message: 'Este email já está em uso' })
      }

      // Gera token de verificação
      const verificationToken = uuidv4()

      // Cria usuário com senha temporária
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: uuidv4(), // Temporary password
        role: data.role || 'candidate',
        emailVerified: false,
        verificationToken,
      })

      // Se for candidato, cria perfil do candidato
      if (data.role === 'candidate') {
        await Candidate.create({
          userId: user.id,
          selectedForInterview: false,
          notified: false
        })
      }

      // Envia email de verificação
      await EmailService.sendVerificationEmail(user.email, user.name, verificationToken)

      return response.created({
        message: 'Usuário registrado com sucesso. Por favor, verifique seu email para completar o registro.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      })
    } catch (error) {
      return response.internalServerError({ message: 'Erro ao registrar usuário' })
    }
  }

  public async login({ request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Busca usuário pelo email
      const user = await User.findByOrFail('email', email)

      // Verifica se o email está verificado
      if (!user.emailVerified) {
        return response.unauthorized({
          message: 'Por favor, verifique seu email primeiro',
          code: 'EMAIL_NOT_VERIFIED'
        })
      }

      // Verifica se a senha é válida
      const isPasswordValid = await Hash.verify(user.password, password)

      if (!isPasswordValid) {
        return response.unauthorized({
          message: 'Credenciais inválidas',
          code: 'INVALID_CREDENTIALS'
        })
      }

      // Gera token JWT
      const token = this.generateToken(user)

      return response.ok({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      })
    }
  }

  public async verifyEmail({ request, response }: HttpContextContract) {
    const { token, password } = request.only(['token', 'password'])
    Logger.info('Tentativa de verificação de email:', { token })

    try {
      const user = await User.findByOrFail('verificationToken', token)

      // Verifica se o token está expirado (24 horas)
      const tokenAge = Date.now() - user.createdAt.toMillis()

      if (tokenAge > 24 * 60 * 60 * 1000) {
        Logger.warn('Token expirado:', { token })
        return response.badRequest({
          message: 'Token de verificação expirado',
          code: 'TOKEN_EXPIRED'
        })
      }

      // Atualiza usuário
      user.emailVerified = true
      user.verificationToken = null
      user.password = password
      await user.save()

      // Gera token JWT
      const authToken = this.generateToken(user)

      return response.ok({
        message: 'Email verificado e senha definida com sucesso. Você já pode fazer login.',
        token: authToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      })
    } catch (error) {
      return response.badRequest({
        message: 'Token de verificação inválido ou expirado',
        code: 'INVALID_TOKEN'
      })
    }
  }

  public async logout({ response }: HttpContextContract) {
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}