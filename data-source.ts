import { DataSource } from "typeorm"
import { User } from "./entities/User.entites"

export const AppDataSource = new DataSource({
	type: "better-sqlite3",
	database: "./main.sqlite",
	synchronize: true,
	logging: true,
	subscribers: [],
	entities: [User],
	migrations: [`${__dirname}/migrations/default`]
})
AppDataSource.initialize()
	.then(() => {
		console.log('AppDataSource initilized')
	})
	.catch((err) => {
		console.log(err)
	})