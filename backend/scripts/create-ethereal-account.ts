import nodemailer from 'nodemailer'

async function createEtherealAccount() {
  try {
    // Criar uma conta de teste Ethereal
    const testAccount = await nodemailer.createTestAccount()

    console.log('Credenciais Ethereal geradas com sucesso!')
    console.log('----------------------------------------')
    console.log('Email:', testAccount.user)
    console.log('Senha:', testAccount.pass)
    console.log('Host SMTP:', testAccount.smtp.host)
    console.log('Porta SMTP:', testAccount.smtp.port)
    console.log('----------------------------------------')
    console.log('\nAdicione estas credenciais ao seu arquivo .env:')
    console.log(`
    MAIL_MAILER=smtp
    MAIL_HOST=${testAccount.smtp.host}
    MAIL_PORT=${testAccount.smtp.port}
    MAIL_USERNAME=${testAccount.user}
    MAIL_PASSWORD=${testAccount.pass}
    MAIL_ENCRYPTION=tls
    MAIL_FROM_ADDRESS=${testAccount.user}
    MAIL_FROM_NAME="Talent Pool"
        `)
      } catch (error) {
        console.error('Erro ao criar conta Ethereal:', error)
      }
    }

createEtherealAccount() 