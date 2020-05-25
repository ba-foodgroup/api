module.exports = {
    "type": "mysql",
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT,
    "username": process.env.MYSQL_USERNAME,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "synchronize": false,
    "logging": false,
    "entities": [
        `${process.env.NODE_ENV !== 'PRODUCTION' ? 'src/entities/**/*.ts' : 'build/entities/**/*.js'}`
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
};