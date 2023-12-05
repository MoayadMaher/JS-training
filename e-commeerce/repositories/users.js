const fs = require('fs');

class UsersRepositoty {
    constructor(filename) {
        if (!filename) {
            throw new Error('Carating a repository reqires a filename')
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]')
        }

    }
    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        )
    }

    async create(attras) {
        const records
    }
}



const test = async () => {
    const repo = new UsersRepositoty('users.json')

    const users = await repo.getAll();

    console.log(users);
}
test();
