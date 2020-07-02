module.exports = class GameObject {

        get polygonObjectList() {
            return this._polygonObjectList;
        }

        set polygonObjectList(value) {
            this._polygonObjectList = value;
        }

        get centerPoint() {
            return this._centerPoint;
        }

        set centerPoint(value) {
            this._centerPoint = value;
        }

        get objectColor() {
            return this._objectColor;
        }

        set objectColor(value) {
            this._objectColor = value;
        }
        constructor(polygonObjectList, centerPoint, objectColor) {
            this._polygonObjectList = polygonObjectList;
            this._centerPoint = centerPoint;
            this._objectColor = objectColor;
        }
};