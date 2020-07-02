const VectorMath = require("./VectorMath.js");
const Victor = require("victor");

module.exports = class CollsionDetection {

    static calculateBoundingBox(pointArray) {

        let minX = pointArray[0].x, minY = pointArray[0].y;
        let maxX = 0, maxY = 0;

        pointArray.forEach(e => {
            if (e.x < minX)
                minX = e.x;
            if (e.x > maxX)
                maxX = e.x;

            if (e.y < minY)
                minX = e.x;
            if (e.y > maxY)
                maxY = e.y;
        });

        return [Victor(minX, minY),
            Victor(minX, maxY),
            Victor(maxX, maxY),
            Victor(maxX, minY)];

    }

    // nimmt 2 Arrays mit Punkten und berechnet deren Kollision
    // die Punkte der Objekte müssen gegen den Uhrzeigersinn gespeichert sein
    static nAxisseperateCollisionDetection(pointArray1, pointArray2) {

        let edges = []; // Array enthält alle Kanten
        let normals = []; //Array enthält alle Normalen
        let projectedPolygons = []; //Array enthält alle projezierten Polygone

        // Projeziert die Punkte der Polygone auf alle Normalen im Array

        for (let i = 0; i < (pointArray1.length + pointArray2.length - 1); i++) {
            if (i < pointArray1.length) {
                if (i < pointArray1.length - 2)
                    edges.push(VectorMath.calcEdge(pointArray1[i], pointArray1[i + 1]));
                else
                    edges.push(VectorMath.calcEdge(pointArray1[i], pointArray1[0]));
            } else {

                if (i - (pointArray1.length - 1) < pointArray2.length - 1) {

                    edges.push(VectorMath.calcEdge(pointArray2[i - (pointArray1.length - 1)], pointArray2[i - (pointArray1.length)]));
                } else {
                    edges.push(VectorMath.calcEdge(pointArray2[i - (pointArray1.length - 1)], pointArray2[0]));
                }
            }
        }

        // normale linksseitig für alle kanten
        for (let i = 0; i < edges.length; i++) {
            normals.push(Victor(-edges[i].y, edges[i].x));
        }

        // Projeziert die Punkte der Polygone auf alle Normalen im Array
        for (let i = 0; i < (normals.length * 2); i++) {
            if (i < normals.length)
                projectedPolygons.push(VectorMath.projectXPolygon(normals[i], pointArray1));
            else
                projectedPolygons.push(VectorMath.projectXPolygon(normals[i - normals.length], pointArray2));
        }

        for (let i = 0; i < projectedPolygons.length / 2; i++) {
            if (!VectorMath.intersectPolygons(projectedPolygons[i], projectedPolygons[i + normals.length])) {
                return false;
            }
        }
        return true;
    }
};