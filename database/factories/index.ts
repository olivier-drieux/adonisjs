import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFile, { UserFileType } from 'App/Models/UserFile'
import User from 'App/Models/User'

export const FileFactory = Factory.define(UserFile, ({ faker }) => {
  return {
    type: faker.random.arrayElement(Object.keys(UserFileType)),
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
