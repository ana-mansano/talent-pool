import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Candidate from 'App/Models/Candidate'
import Skill from 'App/Models/Skill'
import { DateTime } from 'luxon'
import EmailService from 'App/Services/EmailService'

export default class RecruitersController {
  public async listCandidates({ request, response }: HttpContextContract) {
    try {
      const { name, skill } = request.qs()
      
      const query = Candidate.query()
        .preload('user')
        .preload('skills')

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

      return response.ok(candidates.map(candidate => ({
        id: candidate.id,
        code: candidate.code,
        name: candidate.user.name,
        email: candidate.user.email,
        phone: candidate.phone,
        skills: candidate.skills.map(skill => skill.name)
      })))
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

      return response.ok(candidate)
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

      // Calcula a data da entrevista (terceiro dia útil às 14h)
      const interviewDate = this.calculateInterviewDate()
      
      candidate.selectedForInterview = true
      candidate.interviewDate = interviewDate
      candidate.notified = false
      await candidate.save()

      // Envia email de notificação
      await EmailService.sendInterviewNotification(
        candidate.user.email,
        candidate.user.name,
        interviewDate
      )

      return response.ok({
        message: 'Candidato selecionado para entrevista com sucesso',
        interviewDate
      })
    } catch (error) {
      return response.badRequest({ message: 'Erro ao selecionar candidato' })
    }
  }

  private calculateInterviewDate(): DateTime {
    let date = DateTime.now()
    let businessDays = 0

    while (businessDays < 3) {
      date = date.plus({ days: 1 })
      // Ignora finais de semana (6 = sábado, 7 = domingo)
      if (date.weekday < 6) {
        businessDays++
      }
    }

    // Define o horário para 14:00
    return date.set({ hour: 14, minute: 0, second: 0, millisecond: 0 })
  }
} 