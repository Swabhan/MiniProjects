import { promises as fsPromises, createReadStream } from 'fs';
import { createInterface } from 'readline';
import * as path from 'path';
import { readdir } from 'fs/promises';

type nestDict = {
    [key: string]: string[];
}

type Graph = {
    [key: string]: nestDict;
};

export class CreateConnections {
    graph: Graph;
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
        try {
            const fileStream = createReadStream(path.join(dirname, filename), 'utf-8');

            const rl = createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.on('line', async (line) => {
                this.AddToGraph(path.join(dirname, filename), line);
            });

            return new Promise<void>((resolve, reject) => {
                rl.on('close', () => {
                    resolve();
                });
            });
        } catch (error) {
            console.error(`Error reading file ${filename}:`, error);
        }
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


//Testing function, allows async code to be processed
async function test(){
    var connections = new CreateConnections();

    await connections.OpenFiles("./test");

    console.log(connections.graph)

}
test();

// export default { CreateConnections };