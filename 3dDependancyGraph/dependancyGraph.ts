import { promises as fsPromises, createReadStream } from 'fs';
import { createInterface } from 'readline';
import * as path from 'path';
import { readdir } from 'fs/promises';



type Inheritance = {
    [key: string]: string[];
};

type Composition = {
    [key: string]: string[];
};

type Association = {
    [key: string]: string[];
};

export class CreateConnections {
    inheritance: Inheritance;
    composition: Composition;
    association: Association;

    classified;

    constructor() {
        this.inheritance = {};
        this.composition = {};
        this.association = {};

        this.classified = new Set([]);
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
                if(file.name[file.name.length - 1] == "h"){
                    await this.ReadFile(dirname, file.name);
                }
            } else {
                //If nested directory, start process in new directory
                await this.OpenFiles(path.join(dirname, file.name));
            }
        }
    }

    /**
    * Determines C++ classes currently in directory
    * Used to fill classfied set for ease of retrieval
    * @param {string} dirname - The string containing current directory path
    */
    async ClassifyFiles(dirname){
        const files = await readdir(dirname, { withFileTypes: true });

        //Go through each file in directory
        for (const file of files) {
            if (file.isFile()) {
                if(file.name[file.name.length - 1] == "h"){
                   this.classified.add(file.name.slice(0, -2));
                }
            } else {
                //If nested directory, start process in new directory
                await this.ClassifyFiles(path.join(dirname, file.name));
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
                this.AddToGraph(path.join(dirname, filename), line, filename.slice(0, -2));
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
    AddToGraph(filePath, line, className) {
        //Normalize Line
        line = line.trim();
        line = line.replace(/[:<>;]/g, " ");

        var lineParts = line.split(" ");
        
        if (lineParts[0] === "class" && lineParts.length > 1) {
            var publicFound = false;

            for (let i = 1; i < lineParts.length; i++) {
                let item = lineParts[i];

                if(item == "public"){
                    publicFound = true;
                }

                if (this.classified.has(item) && publicFound) {
                    if (!this.inheritance[item]) {
                        this.inheritance[item] = [];
                    }

                    this.inheritance[item].push(className);
                    
                }
            }
        } else {
            var vector = false;
            var foundClass;
            for (let item of lineParts) {
                if(item == "vector"){
                    vector = true;
                }
                if (this.classified.has(item)) {
                    foundClass = item;
                }
            }

            if(vector == true && foundClass){
                if (!this.composition[className]) {
                    this.composition[className] = [];
                }
                this.composition[className].push(foundClass);
            } else if (foundClass) {
                if (!this.association[className]) {
                    this.association[className] = [];
                }
                this.association[className].push(foundClass);
            }
        }
    }
}


//Testing function, allows async code to be processed
async function test(){
    var connections = new CreateConnections();

    await connections.ClassifyFiles("./test");

    
    await connections.OpenFiles("./test");

    console.log(connections.association)
    console.log("")

    console.log(connections.composition)
    console.log("")

    console.log(connections.inheritance)
    console.log("")

}
test();

// export default { CreateConnections };