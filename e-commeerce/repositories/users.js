const fs = require('fs');
const crypto = require('crypto');
const { error } = require('console');

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

    async create(attrs) {
        attrs.id = this.randomID();

        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records)
    }

    async writeAll(records) {
        // write the updated 'records' array back to this.filename (user.json)
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2))
    }

    randomID() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(records => records.id === id)
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id)

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        // record === {email: 'test@test.com'}
        // attrs === {password: 'mypassword'}
        Object.assign(record, attrs);
        // record === {email: 'test@test.com',password: 'mypassword'}

        await this.writeAll(records)
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
}



const test = async () => {
    const repo = new UsersRepositoty('users.json')

    const user = await repo.create({
        email: 'test@test.com',
        password: 'mypassword'
    });

    console.log(user);

}
test();
