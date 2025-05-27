import { DateTime } from 'luxon'
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Skill from './Skill'
import Education from './Education'

export default class Candidate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public code: number

  @column.date()
  public birthDate: DateTime

  @column()
  public phone: string

  @column()
  public zipCode: string

  @column()
  public street: string | null

  @column()
  public number: string | null

  @column()
  public complement: string | null

  @column()
  public neighborhood: string | null

  @column()
  public city: string | null

  @column()
  public state: string | null

  @column()
  public selectedForInterview: boolean

  @column.dateTime()
  public interviewDate: DateTime | null

  @column()
  public notified: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Skill, {
    pivotTable: 'candidate_skills',
  })
  public skills: ManyToMany<typeof Skill>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @beforeCreate()
  public static async generateCode(candidate: Candidate) {
    const lastCandidate = await Candidate.query().orderBy('code', 'desc').first()
    candidate.code = lastCandidate ? lastCandidate.code + 1 : 1
  }
} 