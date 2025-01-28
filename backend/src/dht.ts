import DHT from 'bittorrent-dht';
import logger from "./modules/logger";
import {threadId} from "node:worker_threads";
import config from "config";
import {randomBytes} from "node:crypto";
import {getRedisConnectionForDHT, readAllNodes, saveNode} from "./modules/cache";
import {dhtNode, peerFrom} from 'types/dht/node';
import * as buffer from "buffer";

async function main() {
    const nodeId = randomBytes(20).toString('hex')
    const redis = await getRedisConnectionForDHT()
    const dht = new DHT({
        nodeId:nodeId,
        bootstrap: await config.get('dht.bootstrap'),   // bootstrap servers (default: router.bittorrent.com:6881, router.utorrent.com:6881, dht.transmissionbt.com:6881)
        timeBucketOutdated: 900000, // check buckets every 15min
        maxAge: 900000  // optional setting for announced peers to time out
    })

    dht.on('ready', async () => {
        const add = dht.address()
        await logger.info({message:`DHT is listening on ${add.address}:${add.port}, id [${nodeId}], total nodes [${dht.toJSON().nodes.length}]`,module:`DHT WORKER ${threadId}`})
    })

    dht.on('error', (err:any) => {
        logger.error({message:err.message,module:`DHT WORKER ${threadId}`,data:err.stack})
    })

    dht.on('node', async (node:dhtNode) => {
        await saveNode(redis,node)
        await logger.debug({message:`Discover new DHT node ${node.host}:${node.port}`,module:`DHT WORKER ${threadId}`})
    })

    dht.on('peer', async (peer:dhtNode,infoHash:Buffer,from:peerFrom) => {
        await saveNode(redis,peer)
        await dht.addNode(peer)
        await logger.debug({message: `Found [${infoHash.toString('hex')}] peer ${peer.host}:${peer.port} from ${from.address}:${from.port}`, module:`DHT WORKER ${threadId}`})
    })
    await dht.listen()
    //Add all old nodes to dht node list
    const nodeList = await readAllNodes(redis)
    for (let i = 0; i < nodeList.length; i++) {
        await dht.addNode(nodeList[i])
    }
}

main().then()