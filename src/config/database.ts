import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

//connection pool - library that has already bouigt and coected books(database)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

//helps us run queries from anywhere in our application
export const query = (text: string, params?: any[]) => pool.query(text, params) 

export const testDbConnection = async () => {
    try {
        const client = await pool.connect() //attempting to check client from pool , awit - pause function until connection is successful or error occurs
        console.log('Database connection successful');
        client.release();
    } catch (error) {
        console.error('Unable to connect to databse', error);
        process.exit(1);
    }
}