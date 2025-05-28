/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Rota raiz
Route.get('/', async () => {
  return { message: 'API do Talent Pool está funcionando!' }
})

// Rotas públicas
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/verify-email', 'AuthController.verifyEmail')
}).prefix('/api')

// Rotas protegidas
Route.group(() => {
  Route.post('/logout', 'AuthController.logout')
  
  // Rotas de candidatos
  Route.group(() => {
    Route.get('/skills', 'SkillsController.index')
    Route.post('/candidates', 'CandidatesController.store')
    Route.get('/candidates/profile', 'CandidatesController.show')
    Route.put('/candidates/profile', 'CandidatesController.update')
    Route.get('/candidates/skills', 'CandidatesController.getSkills')
    Route.post('/candidates/skills', 'CandidatesController.addSkill')
    Route.delete('/candidates/skills/:id', 'CandidatesController.removeSkill')
    Route.get('/candidates/education', 'CandidatesController.getEducation')
    Route.post('/candidates/education', 'CandidatesController.addEducation')
    Route.put('/candidates/education/:id', 'CandidatesController.updateEducation')
    Route.delete('/candidates/education/:id', 'CandidatesController.removeEducation')
  }).middleware('role:candidate')

  // Rotas do gestor
  Route.group(() => {
    Route.get('/candidates', 'RecruitersController.listCandidates')
    Route.get('/candidates/:id', 'RecruitersController.showCandidate')
    Route.post('/candidates/:id/skills', 'RecruitersController.addCandidateSkill')
    Route.delete('/candidates/:id/skills/:skillId', 'RecruitersController.removeCandidateSkill')
    Route.post('/candidates/:id/select', 'RecruitersController.selectForInterview')
  }).middleware('role:manager')
}).prefix('/api').middleware('auth')
