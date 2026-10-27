import path from "path";
import fs from "fs";

const DB_PATH = path.join(import.meta.dirname, "../data/users.json");
function writeUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function readUsers(){
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    return data
}

function findByEmail(email) {
    return readUsers().find((u)=>u.email === email) || null
}

function findById(id) {
    return readUsers().find((u)=>u.id === id) || null

}

export {writeUsers, findByEmail, findById, readUsers}