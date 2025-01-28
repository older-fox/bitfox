import config from 'config'
import logger from "./src/modules/logger"
import {Worker} from "node:worker_threads";
import path from "node:path";
async function main() {
    //Start queue service....
    await logger.info({message:'Booting queue service.....',module:'Bootstrap'})
    const maxQueueWorkers:number = await config.get('queue.maxWorks')
    for(let i=0; i<maxQueueWorkers; i++) {
        await runQueueWorker()
    }
    await logger.info({message:'Booting DHT service.....',module:'Bootstrap'})
    const maxDHTWorkers:number = await config.get('dht.maxDHTWorkers')
    for(let i=0; i<maxDHTWorkers; i++) {
        await runDHTWorker()
    }
}

async function runDHTWorker(){
    const worker = new Worker('./src/dht.ts')
    const threadId = worker.threadId
    worker.on('exit', (code)=>{
        logger.warn({message:`Worker ${threadId} exited with code ${code}, restarting it...`, module:'DHT'});
        runDHTWorker()
    })
    worker.on('error', err => {
        logger.error({message:err.message,module:'DHT',data:err.stack})
    })
}

async function runQueueWorker(){
    const worker = new Worker('./src/queue.ts')
    const threadId = worker.threadId
    worker.on('exit', code => {
        logger.warn({message:`Worker ${threadId} exited with code ${code}, restarting it...`, module:'QUEUE'});
        runQueueWorker()
    })
    worker.on('error', err => {
        logger.error({message:err.message,module:'QUEUE',data:err.stack})
    })
}

main()