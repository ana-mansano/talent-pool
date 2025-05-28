import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Candidate from 'App/Models/Candidate'
import Skill from 'App/Models/Skill'
import Education from 'App/Models/Education'
import { DateTime } from 'luxon'

export default class CandidatesController {
  // Listar todos os candidatos (apenas para gestores)
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = Number(request.input('page', 1))
      const limit = Number(request.input('limit', 10))
      const search = request.input('search', '')

      let query = Candidate.query()
        .preload('user')
        .preload('skills')
        .preload('educations')

      if (search) {
        query = query.whereHas('user', (userQuery) => {
          userQuery.whereILike('name', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        })
      }

      const candidates = await query.paginate(page, limit)
      const candidatesJson = candidates.toJSON()

      // Formata os dados dos candidatos
      const formattedCandidates = candidatesJson.data.map(candidate => ({
        id: candidate.id,
        code: candidate.code,
        name: candidate.user.name,
        email: candidate.user.email,
        phone: candidate.phone,
        birthDate: candidate.birthDate ? candidate.birthDate.toFormat('yyyy-MM-dd') : null,
        zipCode: candidate.zipCode,
        street: candidate.street,
        number: candidate.number,
        complement: candidate.complement,
        neighborhood: candidate.neighborhood,
        city: candidate.city,
        state: candidate.state,
        skills: candidate.skills.map(skill => skill.name),
        educations: candidate.educations ? candidate.educations.map(education => ({
          id: education.id,
          courseName: education.courseName,
          institutionName: education.institutionName,
          completionDate: education.completionDate ? education.completionDate.toFormat('yyyy-MM-dd') : null
        })) : [],
        selectedForInterview: candidate.selectedForInterview,
        interviewDate: candidate.interviewDate ? candidate.interviewDate.toISO() : null
      }))

      return response.ok({
        data: formattedCandidates,
        meta: {
          total: candidatesJson.meta.total,
          per_page: candidatesJson.meta.per_page,
          current_page: candidatesJson.meta.current_page,
          last_page: candidatesJson.meta.last_page,
          first_page: candidatesJson.meta.first_page,
          first_page_url: candidatesJson.meta.first_page_url,
          last_page_url: candidatesJson.meta.last_page_url,
          next_page_url: candidatesJson.meta.next_page_url,
          previous_page_url: candidatesJson.meta.previous_page_url
        }
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Erro ao listar candidatos' })
    }
  }

  // Buscar candidatos por nome ou habilidades
  public async search({ request, response }: HttpContextContract) {
    const { name, skills } = request.all()

    try {
      let query = Candidate.query().preload('user').preload('skills')

      if (name) {
        query = query.whereHas('user', (userQuery) => {
          userQuery.whereILike('name', `%${name}%`)
        })
      }

      if (skills && Array.isArray(skills) && skills.length > 0) {
        query = query.whereHas('skills', (skillQuery) => {
          skillQuery.whereIn('skill_id', skills)
        })
      }

      const candidates = await query.exec()
      return response.ok(candidates)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Erro ao buscar candidatos' })
    }
  }

  // Obter dados de um candidato específico
  public async show({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.query()
        .where('userId', user.id)
        .preload('user')
        .preload('skills')
        .preload('educations')
        .firstOrFail()

      // Formata as datas para o formato ISO
      const formattedCandidate = {
        ...candidate.serialize(),
        birthDate: candidate.birthDate ? candidate.birthDate.toFormat('yyyy-MM-dd') : null,
        educations: candidate.educations.map(education => ({
          ...education.serialize(),
          completionDate: education.completionDate ? education.completionDate.toFormat('yyyy-MM-dd') : null
        }))
      }

      return response.ok(formattedCandidate)
    } catch (error) {
      return response.notFound({ message: 'Perfil não encontrado' })
    }
  }

  // Atualizar dados do candidato
  public async update({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)

      const data = request.only([
        'birthDate',
        'phone',
        'zipCode',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state'
      ])

      // Mapeia os campos do frontend para o backend, mantendo os valores existentes se não forem fornecidos
      const mappedData = {
        birthDate: data.birthDate ? DateTime.fromISO(data.birthDate) : candidate.birthDate,
        phone: data.phone || candidate.phone,
        zipCode: data.zipCode || candidate.zipCode,
        street: data.street || candidate.street || '',
        number: data.number || candidate.number || '',
        complement: data.complement || candidate.complement || '',
        neighborhood: data.neighborhood || candidate.neighborhood || '',
        city: data.city || candidate.city || '',
        state: data.state || candidate.state || ''
      }

      // Atualiza o candidato com os novos dados
      candidate.merge(mappedData)
      await candidate.save()

      // Recarrega o candidato com todos os relacionamentos
      await candidate.load('skills')
      await candidate.load('educations')

      // Formata a resposta
      const formattedCandidate = {
        ...candidate.serialize(),
        birthDate: candidate.birthDate ? candidate.birthDate.toFormat('yyyy-MM-dd') : null,
        skills: candidate.skills,
        educations: candidate.educations.map(education => ({
          ...education.serialize(),
          completionDate: education.completionDate ? education.completionDate.toFormat('yyyy-MM-dd') : null
        }))
      }

      return response.ok({
        message: 'Perfil atualizado com sucesso',
        candidate: formattedCandidate
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return response.badRequest({
        message: 'Erro ao atualizar perfil',
        error: error.message
      })
    }
  }

  // Adicionar uma formação acadêmica ao candidato
  public async addEducation({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)

      const data = request.only(['course_name', 'institution_name', 'completion_date'])

      // Validar campos obrigatórios
      if (!data.course_name || !data.institution_name || !data.completion_date) {
        return response.badRequest({
          message: 'Todos os campos são obrigatórios: course_name, institution_name, completion_date'
        })
      }

      const education = await candidate.related('educations').create({
        courseName: data.course_name,
        institutionName: data.institution_name,
        completionDate: data.completion_date
      })

      return response.created({
        message: 'Formação adicionada com sucesso',
        education
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao adicionar formação',
        error: error.message || error
      })
    }
  }

  // Adicionar habilidade ao candidato
  public async addSkill({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)
      const { skillId } = request.only(['skillId'])

      const skill = await Skill.findOrFail(skillId)
      await candidate.related('skills').attach([skill.id])

      return response.ok({
        message: 'Habilidade adicionada com sucesso',
        skill
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao adicionar habilidade',
        error: error.message || error
      })
    }
  }

  // Selecionar candidato para entrevista (apenas para gestores)
  public async selectForInterview({ params, response }: HttpContextContract) {
    const { id } = params

    try {
      const candidate = await Candidate.findOrFail(id)

      // Verifica se o candidato já foi selecionado
      if (candidate.selectedForInterview) {
        return response.badRequest({ 
          message: 'Este candidato já foi selecionado para entrevista' 
        })
      }

      // Calcular o terceiro dia útil após hoje
      let interviewDate = DateTime.now().plus({ days: 3 })
      // Se o dia da entrevista cair no fim de semana, mover para segunda-feira
      if (interviewDate.weekday === 6) { // Sábado
        interviewDate = interviewDate.plus({ days: 2 })
      } else if (interviewDate.weekday === 7) { // Domingo
        interviewDate = interviewDate.plus({ days: 1 })
      }

      // Definir horário para 14h
      interviewDate = interviewDate.set({ hour: 14, minute: 0, second: 0, millisecond: 0 })

      candidate.selectedForInterview = true
      candidate.interviewDate = interviewDate
      candidate.notified = false
      await candidate.save()

      // Recarrega o candidato com todos os relacionamentos
      await candidate.load('skills')
      await candidate.load('educations')

      // Formata a resposta
      const formattedCandidate = {
        ...candidate.serialize(),
        birthDate: candidate.birthDate ? candidate.birthDate.toFormat('yyyy-MM-dd') : null,
        skills: candidate.skills,
        educations: candidate.educations.map(education => ({
          ...education.serialize(),
          completionDate: education.completionDate ? education.completionDate.toFormat('yyyy-MM-dd') : null
        }))
      }

      return response.ok({
        message: 'Candidato selecionado para entrevista',
        candidate: formattedCandidate,
        interviewDate: interviewDate.toISO()
      })
    } catch (error) {
      console.error('Erro ao selecionar candidato:', error)
      return response.internalServerError({ 
        message: 'Erro ao selecionar candidato para entrevista',
        error: error.message 
      })
    }
  }

  public async getSkills({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)
      await candidate.load('skills')

      return response.ok(candidate.skills)
    } catch (error) {
      return response.badRequest({ message: 'Erro ao buscar habilidades' })
    }
  }

  // Remover habilidade do candidato
  public async removeSkill({ request, response, params }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)

      await candidate.related('skills').detach([params.id])

      return response.ok({
        message: 'Habilidade removida com sucesso'
      })
    } catch (error) {
      return response.badRequest({ message: 'Erro ao remover habilidade' })
    }
  }

  public async getEducation({ request, response }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)
      await candidate.load('educations')

      return response.ok(candidate.educations)
    } catch (error) {
      return response.badRequest({ message: 'Erro ao buscar formações' })
    }
  }

  // Remover formação do candidato
  public async removeEducation({ request, response, params }: HttpContextContract) {
    try {
      const user = request.user!
      const candidate = await Candidate.findByOrFail('userId', user.id)

      const education = await Education.query()
        .where('id', params.id)
        .where('candidateId', candidate.id)
        .firstOrFail()

      await education.delete()

      return response.ok({
        message: 'Formação removida com sucesso'
      })
    } catch (error) {
      return response.badRequest({ message: 'Erro ao remover formação' })
    }
  }

  // Criar perfil do candidato
  public async store({ request, response }: HttpContextContract) {
    try {
      const user = request.user!

      // Verifica se já existe um perfil para este usuário
      const existingCandidate = await Candidate.findBy('userId', user.id)
      if (existingCandidate) {
        return response.conflict({ message: 'Você já possui um perfil de candidato' })
      }

      const data = request.only([
        'birthDate',
        'phone',
        'zipCode',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state'
      ])

      const candidate = await Candidate.create({
        userId: user.id,
        ...data,
        selectedForInterview: false,
        notified: false
      })

      return response.created({
        message: 'Perfil criado com sucesso',
        candidate
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao criar perfil',
        error: error.message || error
      })
    }
  }
}