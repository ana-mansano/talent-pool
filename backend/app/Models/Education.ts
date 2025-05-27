import { DateTime } from 'luxon'
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Candidate from './Candidate'

export default class Education extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public candidateId: number

  @column()
  public courseName: string

  @column()
  public institutionName: string

  @column.date()
  public completionDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Candidate)
  public candidate: BelongsTo<typeof Candidate>
} 