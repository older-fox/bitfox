import Redis from "ioredis"
import config from 'config'
import { dhtNode } from "types/dht/node"
import logger from "../logger"

const nodeExpireTTL:number = config.get('dht.nodeExpireTTL')


/**
 * @description Create a new ioredis client connection
 */
const getRedisConnectionForDHT = async () => {
    const redisConfig:cacheConfig = await config.get('redis')
    return new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db: 0
    })
}


/**
 * @param connection ioRedis Connection
 * @param node DHT node
 * @description Save DHT Nodes in case for software reboot or performance tracking
 */
const saveNode = async (connection:Redis,node:dhtNode) => {
    const res = await connection.set(node.host, node.port,"EX",nodeExpireTTL)
    if (res){
        await logger.debug({message:`Node ${node.host} has been saved`,module:`CACHE`})
    }else{
        await logger.error({message:`Save node info failed`,module:`CACHE`,data:new Error()})
    }
}


const readAllNodes = async (redis:Redis):Promise<Array<dhtNode>> => {
    const hosts = await redis.keys('*')
    const ports = await redis.mget(hosts)
    const list = []
    for (let i=0; i<ports.length; i++) {
        list.push({host:hosts[i],port:ports[i]})
    }
    return list
}

const getNodeSortByTTL = async ()=>{

}

export {getRedisConnectionForDHT,saveNode,getNodeSortByTTL,readAllNodes}