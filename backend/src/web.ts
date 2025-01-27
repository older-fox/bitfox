import * as config from 'config'
import logger from "./modules/logger";

async function main (){
    console.log(config.get('port'))
    console.log("main started");
    await logger.debug({message:'test',module:'WEB'});
}

main()