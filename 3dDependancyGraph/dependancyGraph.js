// import fs from 'fs';
import readline from 'readline';
import path from 'path';

import { promises as fs } from 'fs';
const { readdir } = fs;


class CreateConnections {
    constructor() {
        this.graph = {};
    }

    /**
    * Entry Point for Process
    * Allows functionality to open file, awaits for read completion
    * @param {string} dirname - The string containing current directory path
    */
    async OpenFiles(dirname) {
        const files = await readdir(dirname, { withFileTypes: true });

        //Go through each file in directory
        for (const file of files) {
            if (file.isFile()) {
                await this.ReadFile(dirname, file.name);
            } else {
                //If nested directory, start process in new directory
                this.OpenFiles(path.join(dirname, file.name));
            }
        }
    }

    /**
    * Event Driven function reads file line by line, returns Promise
    * @param {string, string} dirname, filename - Used to create file path
    */
    async ReadFile(dirname, filename) {
        const fileStream = fs.createReadStream(path.join(dirname, filename), 'utf-8');

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        //Interface provides line for Event Listener
        rl.on('line', async (line) => {
            this.AddToGraph(path.join(dirname, filename), line);
        });

        //Finally, when all files read, close and return Promise
        return new Promise((resolve, reject) => {
            rl.on('close', () => {
                console.log("closed");
                resolve();
            });
        });
    }

    /**
    * Creates connection between filePath and dependency
    * @param {string, string} filePath, line
    */
    AddToGraph(filePath, line) {
        var lineParts = line.split(" ");
        if (lineParts[0] === "from") {
            if (!this.graph[filePath]) {
                this.graph[filePath] = {};
            }
            this.graph[filePath][lineParts[1]] = [lineParts[3]];
        } else if (lineParts[0] === "import") {
            if (!this.graph[filePath]) {
                this.graph[filePath] = {};
            }
            this.graph[filePath][lineParts[1]] = [];
        }
    }
}


export { CreateConnections };