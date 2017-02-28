var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:admin@localhost:5432/postgres");

db.none("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name text, surname text, birth_date text, gender text, email text, position text, project text);");

