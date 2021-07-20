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
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

Route.where('id', /^[0-9]+$/).where('slug', /^[a-z0-9_-]+$/)

// api routes
Route.group(() => {
  Route.post('/login', 'UsersController.login').as('users.login')
  Route.get('/logout', 'UsersController.logout').as('users.logout')

  // User related group
  Route.group(() => {
    // User index, show, store
    Route.get('/:id', 'UsersController.show').as('users.show')
    Route.post('/email', 'UsersController.getByEmail').as('users.getByEmail')
    Route.post('/', 'UsersController.store').as('users.store')
    Route.patch('/:id', 'UsersController.update').as('users.update')

    // Token mandatory
    Route.group(() => {
      Route.post('/searchBy', 'UsersController.getBy').as('users.getBy')
      Route.get('/', 'UsersController.index').as('users.index')
      // User update, destroy
      Route.delete('/:id', 'UsersController.destroy').as('users.destroy')
    }).middleware('auth')
  }).prefix('/users')

  Route.group(() => {
    // File index, show, store, destroy
    Route.get('/user/:userId', 'FilesController.index').as('users_files.index')
    Route.get('/:id', 'FilesController.show').as('users_files.show')
    Route.post('/user/:userId', 'FilesController.store').as('users_files.store')
    Route.delete('/:id', 'FilesController.destroy').as('users_files.destroy')
  }).prefix('/files')
}).prefix('/api')

// Fatory
Route.get('/factory', async () => {
  await User.query().whereRaw('1=1').delete()
  await UserFactory.with('files', 3).createMany(10)
  return 'Factory done'
})
