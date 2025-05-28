import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Candidate from 'App/Models/Candidate'
import Skill from 'App/Models/Skill'
import { DateTime } from 'luxon'
import EmailService from 'App/Services/EmailService'

export default class RecruitersController {
  private formatPhoneNumber(phone: string | null): string {
    if (!phone) return 'Não informado'
    
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos (com DDD)
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    
    // Verifica se tem 10 dígitos (com DDD)
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    
    // Se não tiver o formato esperado, retorna o número original
    return phone
  }

  private formatCandidateData(candidate: Candidate) {
    return {
      id: candidate.id,
      code: candidate.code,
      name: candidate.user.name,
      email: candidate.user.email,
      phone: this.formatPhoneNumber(candidate.phone),
      birthDate: candidate.birthDate ? candidate.birthDate.toFormat('yyyy-MM-dd') : null,
      zipCode: candidate.zipCode,
      street: candidate.street,
      number: candidate.number,
      complement: candidate.complement,
      neighborhood: candidate.neighborhood,
      city: candidate.city,
      state: candidate.state,
      skills: candidate.skills.map(skill => skill.name),
      educations: candidate.educations.map(education => ({
        id: education.id,
        courseName: education.courseName,
        institutionName: education.institutionName,
        completionDate: education.completionDate ? education.completionDate.toFormat('yyyy-MM-dd') : null
      })),
      selectedForInterview: Boolean(candidate.selectedForInterview),
      interviewDate: candidate.interviewDate
    }
  }

  public async listCandidates({ request, response }: HttpContextContract) {
    try {
      const { name, skill } = request.qs()
      
      const query = Candidate.query()
        .preload('user')
        .preload('skills')
        .preload('educations')

      if (name) {
        query.whereHas('user', (userQuery) => {
          userQuery.where('name', 'like', `%${name}%`)
        })
      }

      if (skill) {
        query.whereHas('skills', (skillQuery) => {
          skillQuery.where('name', 'like', `%${skill}%`)
        })
      }

      const candidates = await query.exec()
      const formattedData = candidates.map(candidate => this.formatCandidateData(candidate))

      return response.ok(formattedData)
    } catch (error) {
      return response.badRequest({ message: 'Erro ao listar candidatos' })
    }
  }

  public async showCandidate({ params, response }: HttpContextContract) {
    try {
      const candidate = await Candidate.query()
        .where('id', params.id)
        .preload('user')
        .preload('skills')
        .preload('educations')
        .firstOrFail()

      return response.ok(this.formatCandidateData(candidate))
    } catch (error) {
      return response.notFound({ message: 'Candidato não encontrado' })
    }
  }

  public async addCandidateSkill({ params, request, response }: HttpContextContract) {
    try {
      const candidate = await Candidate.findOrFail(params.id)
      const { skillId } = request.only(['skillId'])

      const skill = await Skill.findOrFail(skillId)
      await candidate.related('skills').attach([skill.id])

      return response.ok({
        message: 'Habilidade adicionada com sucesso',
        skill
      })
    } catch (error) {
      return response.badRequest({ message: 'Erro ao adicionar habilidade' })
    }
  }

  public async removeCandidateSkill({ params, response }: HttpContextContract) {
    try {
      const candidate = await Candidate.findOrFail(params.id)
      await candidate.related('skills').detach([params.skillId])

      return response.ok({
        message: 'Habilidade removida com sucesso'
      })
    } catch (error) {
      return response.badRequest({ message: 'Erro ao remover habilidade' })
    }
  }

  public async selectForInterview({ params, response }: HttpContextContract) {
    try {
      const candidate = await Candidate.query()
        .where('id', params.id)
        .preload('user')
        .firstOrFail()

      // Verifica se o candidato já foi selecionado
      if (candidate.selectedForInterview) {
        return response.badRequest({ 
          message: 'Este candidato já foi selecionado para entrevista' 
        })
      }

      // Calcula a data da entrevista (terceiro dia útil às 14h)
      const interviewDate = this.calculateInterviewDate()
      
      // Atualiza o candidato
      candidate.selectedForInterview = true
      candidate.interviewDate = interviewDate
      candidate.notified = false
      await candidate.save()

      try {
        // Envia email de notificação
        await EmailService.sendInterviewNotification(
          candidate.user.email,
          candidate.user.name,
          interviewDate
        )
      } catch (emailError) {
        return response.badRequest({ 
          message: 'Erro ao enviar email de notificação',
          error: emailError.message 
        })
      }

      // Retorna o candidato atualizado
      return response.ok({
        message: 'Candidato selecionado para entrevista com sucesso',
        candidate: this.formatCandidateData(candidate)
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'Erro ao selecionar candidato para entrevista',
        error: error.message 
      })
    }
  }

  private calculateInterviewDate(): DateTime {
    let date = DateTime.now()
    let businessDays = 0

    // Pula para o próximo dia se já passou das 14h
    if (date.hour >= 14) {
      date = date.plus({ days: 1 })
    }

    // Define o horário para 14:00
    date = date.set({ hour: 14, minute: 0, second: 0, millisecond: 0 })

    // Encontra o terceiro dia útil
    while (businessDays < 3) {
      // Ignora finais de semana (6 = sábado, 7 = domingo)
      if (date.weekday < 6) {
        businessDays++
      }
      if (businessDays < 3) {
        date = date.plus({ days: 1 })
      }
    }

    return date
  }
} 