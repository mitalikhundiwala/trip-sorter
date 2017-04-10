import { Duration } from './duration';
import * as _ from 'underscore';

export class Graph {
    readonly vertices: string[] = [];
    readonly numberOfVertices: number = 0;
    readonly graph: any = {};

    constructor(vertices: string[]) {
        this.vertices = vertices;
        this.numberOfVertices = vertices.length;
    }

    addEdge(source, destination) {
        if (!this.graph[source]) {
            this.graph[source] = [];
        }

        this.graph[source].push(destination);
    }

    printAllPathsUtil(source: string, destination: string, visited: any, path: string[]) {
        visited[source] = true;
        path.push(source);

        if (source === destination) {
            console.log(path);
        } else {
            _.forEach(this.graph[source], (i: string) => {
                if (!visited[i]) {
                    this.printAllPathsUtil(i, destination, visited, path);
                }
            });
        }
    }

    printAllPaths(source: string, destination: string) {
        let visited: any = {};
        _.forEach(this.vertices, (currentVertice: string) => {
            visited[currentVertice] = false;
        });

        let path = [];

        this.printAllPathsUtil(source, destination, visited, path);
    }
}
