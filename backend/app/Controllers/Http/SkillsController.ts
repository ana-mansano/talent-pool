import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Skill from 'App/Models/Skill'

export default class SkillsController {
  // Listar todas as habilidades
  public async index({ response }: HttpContextContract) {
    try {
      const skills = await Skill.all()
      return response.ok(skills)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Erro ao listar habilidades' })
    }
  }
} 