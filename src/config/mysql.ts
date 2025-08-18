import mysql from "mysql2/promise";

export const createPool = (country: "PE" | "CL") => {
    let config: MySQLConfig;

    if (country === "PE") {
        config = {
            host: process.env.MYSQL_HOST_PE!,
            user: process.env.MYSQL_USER_PE!,
            password: process.env.MYSQL_PASSWORD_PE!,
            database: process.env.MYSQL_DB_PE!
        };
    } else {
        config = {
            host: process.env.MYSQL_HOST_CL!,
            user: process.env.MYSQL_USER_CL!,
            password: process.env.MYSQL_PASSWORD_CL!,
            database: process.env.MYSQL_DB_CL!
        };
    }

    return mysql.createPool(config);
};
