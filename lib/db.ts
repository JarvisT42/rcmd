import sql from "mssql"

const config = {
  user: "sa",
  password: "30214087695",
  server: "localhost",
  database: "rcmd",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

export async function connectDB() {
  try {
    const pool = await sql.connect(config)
    return pool
  } catch (error) {
    console.error(error)
    throw error
  }
}