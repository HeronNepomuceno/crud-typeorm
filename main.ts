import 'reflect-metadata'
import * as express from 'express'
import { Request, Response } from 'express'
import * as bodyParse from 'body-parser'
import { User } from './entities/User.entites'
import { AppDataSource } from './data-source'

const app = express()

app.use(bodyParse.urlencoded({ extended: false }))
app.use(bodyParse.json())

app.post("/create", async (req: Request, res: Response) => {
  let {id, firstName, lastName, isActive} = req.body

  const newUser = new User()
  newUser.id = id
  newUser.firstName = firstName
  newUser.lastName = lastName
  newUser.isActive = isActive

  try {
    await AppDataSource.manager.save(newUser)
    res.json({ data: newUser})
  } catch(err) {
    console.log(err)
  }
})

app.post("/read", async (req: Request, res: Response) => {
  let {id} = req.body
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userToRead = await userRepository.findOneBy({ id: id })
    res.json({ data: userToRead })
  } catch(err) {
    console.log(err)
  }
})

app.post("/update", async (req: Request, res: Response) => {
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
    res.json({ data: userToUpdate })
  } catch(err) {
    console.log(err)
  }
})

app.post("/delete", async (req: Request, res: Response) => {
  let {id} = req.body
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userToRemove = await userRepository.findOneBy({ id: id })
    await userRepository.remove(userToRemove)
    res.send(`User ${id} removed!`)
  } catch(err) {
    console.log(err)
  }
})

app.get("/list", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const allUsers = await userRepository.find()
    res.json(allUsers)
  } catch(err) {
    console.log(err)
  }
})

app.get("/read-by-first-name", async (req: Request, res: Response) => {
  let { firstName } = req.body
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userByFirstName = await userRepository.find({
      where: {
        firstName: firstName
      }
    })
    res.json(userByFirstName)
  } catch(err) {
    console.log(err)
  }
})

app.listen(3001, () => {
  console.log('Server running http://localhost:3001')
})