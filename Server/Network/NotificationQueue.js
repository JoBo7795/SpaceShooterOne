module.exports = class NotificationQueue {

    constructor(io){
        this.io = io;
        this.clientID =[];
        this.queue=[];
    }

  addClient(clientID){
        this.clientID.push(clientID);
  }

  // clientSocketID 0 === broadcast
 addQueueEntry(clientSocketID,key,value){
     this.queue.push({clientID:clientSocketID,data:{key:key,value:value}});
 }

 // builds data package for every client in clientID list
 buildDataPackage(clientID){
        let tmpPackage =[];

        this.queue.forEach(e=>{
            if(e.clientID===clientID||e.clientID === 0)
                tmpPackage.push(e.data)
        });

     return tmpPackage;
 }

 //distributes queue data to clients
 distributeQueue(){

    this.clientID.forEach(e=>{
        this.io.to(e).emit("package",this.buildDataPackage(e))
    });

     this.queue=[]; // delete old data
 }

};
