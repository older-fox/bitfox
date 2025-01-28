import * as config from 'config'
import {threadId} from "node:worker_threads";
import logger from "./modules/logger";

async function main (){
    await logger.debug({message:`Worker ${threadId} started.`,module:'QUEUE'});
    setInterval(async()=>{
        await queueNewHash()
    },1000)
}


//Push a new file hash to the queue.
async function queueNewHash (){
    //Create a new hash
    //Check if the hash already fetched before (From memory or redis)
    //push to rabbitMQ or some other message queue.
}

main()