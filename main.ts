import 'reflect-metadata'
import * as express from 'express'
import * as bodyParse from 'body-parser'
import { User } from './entities/User.entites'
import { AppDataSource } from './data-source'

const app = express()

app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())

app.get("/", (req, res) => {
  res.send('Hello world!')
})

app.post("/create", async (req, res) => {
  let {id, firstName, lastName, isActive} = req.body

  const newUser = new User()
  newUser.id = id
  newUser.firstName = firstName
  newUser.lastName = lastName
  newUser.isActive = isActive

  try {
    await AppDataSource.manager.save(newUser)
    res.send({"status": "200", "data": newUser})
  } catch(err) {
    console.log(err)
  }
})

app.post("/read", async (req, res) => {
  let {id} = req.body
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userToRead = await userRepository.findOneBy({
        id: id
    })
    res.send({"status": "200", "data": userToRead})
  } catch(err) {
    console.log(err)
  }
})

app.post("/update", async (req, res) => {
  let {id, firstName, lastName, isActive} = req.body

  try {
    const userRepository = AppDataSource.getRepository(User)
    const userToUpdate = await userRepository.findOneBy({
        id: id,
    })
    userToUpdate.firstName = firstName
    userToUpdate.lastName = lastName
    userToUpdate.isActive = isActive

    await userRepository.save(userToUpdate)
    res.send({"status": "200", "data": userToUpdate})
  } catch(err) {
    console.log(err)
  }

})

app.post("/delete", async (req, res) => {
  let {id} = req.body
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userToRemove = await userRepository.findOneBy({
        id: id,
    })
    await userRepository.remove(userToRemove)
    res.send({"status": "200", "data": `The user ${id} removed!`})
  } catch(err) {
    console.log(err)
  }
})

app.listen(3001, () => {
  console.log('Server running http://localhost:3001')
})