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
    Route.get('/', 'UsersController.index').as('users.index')
    Route.get('/:id', 'UsersController.show').as('users.show')
    Route.post('/', 'UsersController.store').as('users.store')

    // Token mandatory
    Route.group(() => {
      // User update, destroy
      Route.patch('/:id', 'UsersController.update').as('users.update')
      Route.delete('/:id', 'UsersController.destroy').as('users.destroy')

      // File index, show, store, destroy
      Route.get('/:userId/files', 'FilesController.index').as('users_files.index')
      Route.get('/files/:id', 'FilesController.show').as('users_files.show')
      Route.post('/:userId/files', 'FilesController.store').as('users_files.store')
      Route.delete('/files/:id', 'FilesController.destroy').as('users_files.destroy')
    }).middleware('auth')
  }).prefix('/users')
}).prefix('/api')

// Fatory
Route.get('/factory', async () => {
  await User.query().whereRaw('1=1').delete()
  await UserFactory.with('files', 3).createMany(10)
  return 'Factory done'
}).middleware('auth')
