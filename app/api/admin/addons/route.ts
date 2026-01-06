import { NextRequest, NextResponse } from 'next/server';
import { dbConfig } from '@/lib/db';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    connection = await mysql.createConnection(dbConfig);

    const [addons]: any = await connection.execute(
      'SELECT * FROM addon ORDER BY name ASC'
    );

    return NextResponse.json({ addons }, { status: 200 });
  } catch (error) {
    console.error('Addons GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}