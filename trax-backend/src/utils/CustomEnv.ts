import dotenv from "dotenv";
dotenv.config();

const EnvParser={
    DB_URL:process.env.DB_URL as string,
    PORT:process.env.PORT||'3000',
    JWT_SECRET:process.env.JWT_SECRET||'default_secret',
}

export default EnvParser;