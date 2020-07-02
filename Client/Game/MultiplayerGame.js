import Particles from "../ClientResources/ClientSideObjects.js";

export default class MultiplayerGame {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = canvas.getContext(context);

        this._DrawObjectArray = [];
        this._shootObjectArray = [];
        this._particleProperties = [];
        this._particleArray = [];
        this._particles = false;
        this._hitScreen = 0;
        this._upgradObjectArray = [];
        this._frameCount = 0;
        this._lastFrame = Date.now();
    }

    get upgradeObjectArray() {
        return this._upgradObjectArray;
    }

    set upgradeObjectArray(value) {
        this._upgradObjectArray = value;
    }

    get hitScreen() {
        return this._hitScreen;
    }

    set hitScreen(value) {
        this._hitScreen = value;
    }

    get DrawObjectArray() {
        return this._DrawObjectArray;
    }

    set DrawObjectArray(value) {
        this._DrawObjectArray = value;
    }

    get shootObjectArray() {
        return this._shootObjectArray;
    }

    set shootObjectArray(value) {
        this._shootObjectArray = value;
    }

    get particleCoords() {
        return this._particleProperties;
    }

    set particleCoords(value) {
        this._particleProperties = value;
    }

    get particles() {
        return this._particles;
    }

    set particles(value) {
        this._particles = value;
    }

    hitScreenColor() {

        this.ctx.fillStyle = "#ff1722";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // let audio = new Audio("Resources/Sound/07037325.wav");
        // audio.autoplay = true;
    }

    manageParticles() {

        this._particleArray.push(...Particles.createRandomMultipleParticles(this._particleProperties.coords, this._particleProperties.rotation));

        this._particles = false;
    }



    drawObjects() {

     //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //TODO Merge into one draw.foreach(element=>()) function

        //draw Playerobjects and Obstacles
        this._DrawObjectArray.forEach( (element) =>{

            let i = 0;
            element.polygonObjectList.forEach(e => {
                this.ctx.beginPath();
                this.ctx.moveTo(e[0].x, e[0].y);    //zum ersten Punkt des Objektes
                e.forEach(e => this.ctx.lineTo(e.x, e.y));  //alle Punkte miteinander verbinden
                this.ctx.lineTo(e[0].x, e[0].y);    //letzten Arraypunkt mit Anfangspunkt verbinden => Objekt schließen

                this.ctx.fillStyle = element.objectColor[i];

                this.ctx.fill();
                this.ctx.strokeStyle = element.objectColor[i];
                this.ctx.closePath();
                this.ctx.stroke();

                i++;
            });

        }, this);

        // draw Particles
        let i = 0;

        this._particleArray.forEach( (element) => {

            element.polygonObjectList.forEach(e => {
                this.ctx.beginPath();
                this.ctx.moveTo(e[0].x, e[0].y);    //zum ersten Punkt des Objektes
                e.forEach(e => this.ctx.lineTo(e.x, e.y));  //alle Punkte miteinander verbinden
                this.ctx.lineTo(e[0].x, e[0].y);    //letzten Arraypunkt mit Anfangspunkt verbinden => Objekt schließen

                this.ctx.fillStyle = element.objectColor;

                this.ctx.fill();
                this.ctx.strokeStyle = element.objectColor;
                this.ctx.closePath();
                this.ctx.stroke();

            });

            if (element.centerPoint.y < 0 || element.centerPoint.y > this.canvas.height || element.centerPoint.x < 0 || element.centerPoint.x > this.canvas.width) {
                this._particleArray.splice(this._particleArray.indexOf(element), 1);
            }

            // velocity = g*t => g == 0.01 t == one loop
            this._particleArray[i].velocity.y -= 0.01;
            this._particleArray[i].updatePosition();

            i++;

        },this);

    }

    calculateFramesPerSecond(){

        this._frameCount++;

        if(Date.now()-this._lastFrame >= 1000) {
            console.log("fps: "+this._frameCount);
            this._frameCount = 0;
            this._lastFrame = Date.now();
        }

    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawObjects();

        this.calculateFramesPerSecond();

        if (this._hitScreen > 0) {
            this.hitScreenColor();
            this._hitScreen--;
        }

        if (this._particles) {
            this.manageParticles();
        }

    }
}