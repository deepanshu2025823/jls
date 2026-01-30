import mysql from 'mysql2/promise';

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'), 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jls', 
};

export const db = mysql.createPool(dbConfig); 

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}