import Factory from '@ioc:Adonis/Lucid/Factory'
import File, { FileType } from 'App/Models/File'
import User from 'App/Models/User'
import slugify from 'slugify'

export const FileFactory = Factory.define(File, ({ faker }) => {
  return {
    type: faker.random.arrayElement(Object.keys(FileType)),
    path: faker.random.image(),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address: faker.address.streetAddress(true),
    phone: '0123456789',
    siret: '11111111',
  }
})
  .relation('files', () => FileFactory)
  .build()
