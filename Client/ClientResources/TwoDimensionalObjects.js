import Victor from "./victor.js";

export default class TwoDimensionalObjects {

    static rectangle(center, scale) {

        return [Victor((center.x) * scale, center.y * scale),
            Victor((center.x + 90) * scale, (center.y) * scale),
            Victor((center.x + 90) * scale, (center.y + 50) * scale),
            Victor((center.x) * scale, (center.y + 50) * scale)]
    }

    static triangle(center, scale) {
        return [Victor((center.x + 33) * scale, center.y * scale),
            Victor((center.x + 65) * scale, (center.y + 50) * scale),
            Victor((center.x) * scale, (center.y + 50) * scale)]

    }


    static diamond(center, scale) {
        return [Victor((center.x + 65) * scale, center.y * scale),
            Victor((center.x + 90) * scale, (center.y + 25) * scale),
            Victor((center.x + 65) * scale, (center.y + 50) * scale),
            Victor((center.x + 40) * scale, (center.y + 25) * scale)]
    }

    static octagon(center, scale) {

        return [Victor(center.x * scale, (center.y - 50) * scale),
            Victor((center.x + 35) * scale, (center.y - 35) * scale),
            Victor((center.x + 50) * scale, center.y * scale),
            Victor((center.x + 35) * scale, (center.y + 35) * scale),
            Victor(center.x * scale, (center.y + 50) * scale),
            Victor((center.x - 35) * scale, (center.y + 35) * scale),
            Victor((center.x - 50) * scale, center.y * scale),
            Victor((center.x - 35) * scale, (center.y - 35) * scale)]
    }

    static leftwing(center, scale) {
        return [Victor((center.x - 5) * scale, (center.y-35) * scale),
            Victor((center.x + 5) * scale, (center.y) * scale),
            Victor((center.x + 5) * scale, (center.y + 35) * scale),
            Victor((center.x + -5) * scale, (center.y) * scale)]

    }

    static rightwing(center, scale) {
        return [Victor((center.x + 5) * scale, (center.y-35) * scale),
            Victor((center.x - 5) * scale, (center.y) * scale),
            Victor((center.x - 5) * scale, (center.y + 35) * scale),
            Victor((center.x +5) * scale, (center.y) * scale)]

    }

    static shipCenter(center,scale){
        return [Victor((center.x) * scale, center.y * scale),
            Victor((center.x + 45) * scale, (center.y-15) * scale),
            Victor((center.x + 90) * scale, (center.y) * scale),
            Victor((center.x + 90) * scale, (center.y + 35) * scale),
            Victor((center.x) * scale, (center.y + 35) * scale)]
    }

    static bullet(center,scale){
        return [
            Victor(center.x + 0 * scale, center.y + 0 * scale),
            Victor(center.x + 0 * scale, center.y - 4 * scale),
            Victor(center.x + 2 * scale, center.y - 4 * scale),
            Victor(center.x + 2 * scale, center.y + 0 * scale),
        ]
    }

    static rocket(spawnCoordinates,scale){
        return[
            Victor(spawnCoordinates.x+0*scale,spawnCoordinates.y+0*scale),
            Victor(spawnCoordinates.x+0*scale,spawnCoordinates.y-40*scale),
            Victor(spawnCoordinates.x+10*scale,spawnCoordinates.y-50*scale),
            Victor(spawnCoordinates.x+20*scale,spawnCoordinates.y-40*scale),
            Victor(spawnCoordinates.x+20*scale,spawnCoordinates.y+0*scale),
        ]
    }

    static particles(spawnCoordinates,scale){

        return[
            Victor(spawnCoordinates.x+0*scale,spawnCoordinates.y+0*scale),
            Victor(spawnCoordinates.x+10*scale,spawnCoordinates.y+0*scale),
            Victor(spawnCoordinates.x+10*scale,spawnCoordinates.y+10*scale),
            Victor(spawnCoordinates.x+0*scale,spawnCoordinates.y+10*scale),

        ]
    }

}