import fs from 'node:fs/promises'



const databasePath = new URL('../db.json', import.meta.url)

export class DataBase{
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8')
          .then(data => {
            this.#database = JSON.parse(data)
          })
          .catch(() =>{
            this.#persist()
          })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table,id){
        let data = this.#database[table] ?? []

        if (id) {
            const result = data.find(row => row.id === id);
            return result ? [result] : [];
        }
    
        return data
    }



    insert(table, data){
        if( Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }

        else{
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
      
        if( rowIndex > -1){
          this.#database[table][rowIndex] = {
            id,
            ...this.#database[table][rowIndex], // informações já existentes
            ...data // informações fornecidas no parâmetro data
          }
          this.#persist()
        }
      }
}