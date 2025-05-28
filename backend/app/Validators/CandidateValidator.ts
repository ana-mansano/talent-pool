import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CandidateValidator {
  public static createSchema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(100)
    ]),
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' })
    ]),
    birthDate: schema.date({ format: 'yyyy-MM-dd' }, [
      rules.required(),
      rules.before('today')
    ]),
    phone: schema.string({ trim: true }, [
      rules.required(),
      rules.regex(/^\(\d{2}\) \d{5}-\d{4}$/)
    ]),
    zipCode: schema.string({ trim: true }, [
      rules.required(),
      rules.regex(/^\d{8}$/)
    ]),
    street: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(100)
    ]),
    number: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(10)
    ]),
    complement: schema.string.optional({ trim: true }, [
      rules.maxLength(50)
    ]),
    neighborhood: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(50)
    ]),
    city: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(50)
    ]),
    state: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(2)
    ]),
    skills: schema.array().members(
      schema.string({ trim: true }, [
        rules.required(),
        rules.exists({ table: 'skills', column: 'name' })
      ])
    ),
    educations: schema.array().members(
      schema.object().members({
        courseName: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(100)
        ]),
        institutionName: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(100)
        ]),
        completionDate: schema.date({ format: 'yyyy-MM-dd' }, [
          rules.required(),
          rules.before('today')
        ])
      })
    )
  })

  public static messages = {
    'name.required': 'O nome é obrigatório',
    'name.minLength': 'O nome deve ter no mínimo 3 caracteres',
    'name.maxLength': 'O nome deve ter no máximo 100 caracteres',
    'email.required': 'O email é obrigatório',
    'email.email': 'Email inválido',
    'email.unique': 'Este email já está em uso',
    'birthDate.required': 'A data de nascimento é obrigatória',
    'birthDate.before': 'A data de nascimento não pode ser futura',
    'phone.required': 'O telefone é obrigatório',
    'phone.regex': 'Formato de telefone inválido. Use (XX) XXXXX-XXXX',
    'zipCode.required': 'O CEP é obrigatório',
    'zipCode.regex': 'Formato de CEP inválido. Use 8 dígitos',
    'street.required': 'A rua é obrigatória',
    'street.maxLength': 'A rua deve ter no máximo 100 caracteres',
    'number.required': 'O número é obrigatório',
    'number.maxLength': 'O número deve ter no máximo 10 caracteres',
    'complement.maxLength': 'O complemento deve ter no máximo 50 caracteres',
    'neighborhood.required': 'O bairro é obrigatório',
    'neighborhood.maxLength': 'O bairro deve ter no máximo 50 caracteres',
    'city.required': 'A cidade é obrigatória',
    'city.maxLength': 'A cidade deve ter no máximo 50 caracteres',
    'state.required': 'O estado é obrigatório',
    'state.maxLength': 'O estado deve ter 2 caracteres',
    'skills.required': 'As habilidades são obrigatórias',
    'skills.*.exists': 'Habilidade inválida',
    'educations.*.courseName.required': 'O nome do curso é obrigatório',
    'educations.*.courseName.maxLength': 'O nome do curso deve ter no máximo 100 caracteres',
    'educations.*.institutionName.required': 'O nome da instituição é obrigatório',
    'educations.*.institutionName.maxLength': 'O nome da instituição deve ter no máximo 100 caracteres',
    'educations.*.completionDate.required': 'A data de conclusão é obrigatória',
    'educations.*.completionDate.before': 'A data de conclusão não pode ser futura'
  }
} 