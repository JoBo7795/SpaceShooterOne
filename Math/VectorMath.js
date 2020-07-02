const Victor = require("victor");

module.exports = class VectorMath{

    static skalarProdukt(a, b) {
        return parseInt(a.x * b.x + a.y * b.y)
    }

    static vektorBetrag(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    }

    static vektorStrecke(a, b) {
        return Victor(b.x - a.x, b.y - a.y);
    }

    static vectorWinkel(a, b) {
        return Math.acos(VectorMath.skalarProdukt(a, b) / (VectorMath().vektorBetrag(a) * VectorMath.vektorBetrag(b))) * 180 / Math.PI
    }

    static calcEdge(a, b) {
        return Victor(parseInt(b.x - a.x), parseInt(b.y - a.y));
    }

    static projectXPolygon(axis, polygon) {
        let skalarArr = [];
        polygon.forEach(polygonPoint=>{
            skalarArr.push(VectorMath.skalarProdukt(axis, polygonPoint))
        });

        let min = skalarArr[0];
        let max = min;

        for (let i = 0; i < skalarArr.length; i++) {
            if (skalarArr[i] < min)
                min = skalarArr[i];
            if (skalarArr[i] > max)
                max = skalarArr[i];
        }
        return {min: min, max: max};

    }

    static intersectPolygons(object1, object2) {
        if(object1.min>object2.min) {
            return object2.max > object1.min && object2.min < object1.min;
        }else {
            return object1.max > object2.min && object1.min < object2.min;
        }
    }

    static transformVector(vector,transformationVector){
        return Victor(vector.x+transformationVector.x,vector.y+transformationVector.y);
    }

    // list of points that represent the polygon and a vector to transform the polygon with
    static transformPolygon(pointList,transformationVector){

        let transformedPointList = [];

        pointList.forEach(e=>{
          transformedPointList.push(Victor(e.x+transformationVector.x,e.y+transformationVector.y))
        });

        return transformedPointList;
    }

    static rotatePolygon(pointList,centerPoint,rotationAngle){

        let rotatedPointList=[];

        pointList.forEach(e=>{
           e = e.subtract(centerPoint);
           e = e.rotate(rotationAngle);
           rotatedPointList.push( e.add(centerPoint));
        });

        return rotatedPointList;
    }

    static negotiateVector(vector){
        return Victor(vector.x*-1,vector.y*-1)
    }

    static calculateCenter(pointList){
        let addedPoints=Victor(0,0);


        pointList.forEach(e=> {
            addedPoints.x += e.x;
            addedPoints.y += e.y;
        });

        addedPoints.x /= pointList.length;
        addedPoints.y /= pointList.length;

        return addedPoints;
    }


};

