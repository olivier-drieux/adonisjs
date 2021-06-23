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
Route.where('id', /^[0-9]+$/).where('slug', /^[a-z0-9_-]+$/)

Route.group(() => {
  Route.post('/login', 'UsersController.login').as('users.login')
  Route.resource('/users', 'UsersController').apiOnly().as('users')
  Route.group(() => {
    Route.get('/files/:id', 'FilesController.show').as('users_files.show')
    Route.get('/:userId/files', 'FilesController.index').as('users_files.index')
    Route.post('/:userId/files', 'FilesController.store').as('users_files.store')
    Route.delete('/files/:id', 'FilesController.destroy').as('users_files.destroy')
  }).prefix('/users')
}).prefix('/api')
