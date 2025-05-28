import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

export default class EmailService {
  public static async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = 'http://localhost:3000'
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`
    const fromAddress = Env.get('MAIL_FROM_ADDRESS', 'noreply@talentpool.com')

    try {
      Logger.info(`Iniciando envio de email para ${email}`)
      Logger.debug('Configurações SMTP:', {
        host: 'smtp.ethereal.email',
        port: 587,
        username: 'grrrq7kiauxgrhfj@ethereal.email',
        fromAddress
      })

      const mailer = Mail.use('smtp')
      Logger.debug('Mailer configurado:', { mailer })

      await mailer.send((message) => {
        message
          .from(fromAddress)
          .to(email)
          .subject('Bem-vindo ao Talent Pool - Complete seu Cadastro')
          .htmlView('emails/verification', {
            name,
            verificationUrl,
          })
      })

      Logger.info(`Email de verificação enviado com sucesso para: ${email}`)
    } catch (error) {
      Logger.error(`Erro ao enviar email de verificação para ${email}:`, {
        error: error.message,
        stack: error.stack,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      })
      
      // Verifica se é um erro de conexão SMTP
      if (error.code === 'ESOCKET' || error.code === 'ECONNREFUSED') {
        throw new Error('Não foi possível conectar ao servidor de email. Verifique as configurações SMTP.')
      }
      
      // Verifica se é um erro de autenticação
      if (error.code === 'EAUTH') {
        throw new Error('Erro de autenticação no servidor de email. Verifique as credenciais SMTP.')
      }

      throw new Error('Não foi possível enviar o email de verificação. Por favor, tente novamente mais tarde.')
    }
  }

  public static async sendInterviewNotification(email: string, name: string, interviewDate: DateTime) {
    const formattedDate = interviewDate.toFormat("dd/MM/yyyy 'às' HH:mm")
    const companyName = Env.get('COMPANY_NAME', 'Nossa Empresa')
    const companyAddress = Env.get('COMPANY_ADDRESS', 'Endereço da empresa')
    const companyPhone = Env.get('COMPANY_PHONE', 'Telefone da empresa')

    try {
      Logger.info(`Enviando email de entrevista para ${email}`)
      
      await Mail.send((message) => {
        message
          .from(Env.get('MAIL_FROM_ADDRESS'))
          .to(email)
          .subject('Você foi selecionado para uma entrevista!')
          .htmlView('emails/interview', { 
            name, 
            interviewDate: formattedDate,
            companyName,
            companyAddress,
            companyPhone
          })
      })

      Logger.info(`Email de entrevista enviado com sucesso para ${email}`)
    } catch (error) {
      Logger.error(`Erro ao enviar email de entrevista para ${email}:`, error)
      throw error
    }
  }
} 