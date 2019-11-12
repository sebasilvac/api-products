import axios from 'axios';
import redis from 'redis';

import '../config/config';
import Util from '../utils/Utils';
import SimulatedPagination from '../utils/SimulatedPagination';
import SimulateError from '../utils/SimulateError';

const util = new Util();
const simulateError = new SimulateError();

const redisClient = redis.createClient(6379);

redisClient.on('connect', function() {
    console.log('Conectado a Redis Server');
});

const listSku = [
    '2000347645740p','MPM00004438714', '2000376313009p', '2000343074735p', '2000375868845p',
    '2000365488411p', '2000351258394p', '2000368473292p', '2000373864399p', '2000357178191p',
    '2000374227049p', '2000360502051p', '2000360588512p', '2000354167129p', '2000375921588',
    '2000363428686p', 'mpm00004781620', '2000375653014p', '2000366140462p', '2000361051640p',
    'mpm00000068072', 'mpm00000525945', 'mpm00000346229', '2000373849389p', '2000374306430p',
];

class ProductController {  

    static async getAll(req, res) {

        let page = req.params.page;
        let limit = req.params.limit;
        
        //formamos una key para redis compuesta del page y el limit
        const productsRedisKey = `products:${page}-${limit}`;

        const simulated = new SimulatedPagination( page, limit, listSku );
        const result = simulated.simulatedPagination();
        const url = `${process.env.URLAPI}products?partNumbers=${result.products.join(',')}?format=json`;

        let listProducts = [];

        // consultamos primero si está cacheada la consulta
        return redisClient.get(productsRedisKey, (err, products) => {
 
            // si existe la key se devuelve el contenido desde el cache
            if (products) {
                util.setSuccess(300, 'OK', JSON.parse(products), 'cache' );
                return util.send(res);
            }

            axios
            .get(url)
            .then(data => {

                    if( simulateError.simulate() ) {

                        util.setError(404, {
                            "message" : "No se ha podido establecer una conexión",
                            "name" : "Error simulado"
                        });

                        return util.send(res);
                    }

                    data.data.forEach( (item, index) => {

                        let product = {
                            'id' : item.uniqueID,
                            'sku' : item.partNumber,
                            'name' : item.name,
                            'image' : item.fullImage,
                            'price' : item.prices.formattedOfferPrice,
                            'shortDescription': item.shortDescription,
                            'longDescription': item.longDescription
                        }

                        listProducts.push( product )
                    });

                    const response = {
                        'products'    : listProducts,
                        'totalPages'  : result.totalPages,
                        'totalItems'  : result.totalItems,
                        'page'    : result.page,
                        'limit'   : result.limit
                    }

                    // Guardamos la respuesta en cache
                    redisClient.setex(productsRedisKey, process.env.REDIS_EXPIRE_TIME, JSON.stringify(response))
                    util.setSuccess(data.status, 'OK', response );
                    return util.send(res);

            })
            .catch(err => {
                console.log(err);
                    util.setError(res.statusCode, err);
                    return util.send(res);
            });
        });
    }

    static async getBySku(req, res) {

        const productsRedisKey = 'product:detail';
        let sku = req.params.sku;
        const url = `${process.env.URLAPI}products/${sku}`;

        // consultamos primero si está cacheada la consulta
        return redisClient.get(productsRedisKey, (err, product) => {

            // si existe la key se devuelve el contenido desde el cache
            if (product) {
                util.setSuccess(300, 'OK', JSON.parse(product), 'cache' );
                return util.send(res);
            }

            axios
           .get(url)
           .then(data => {

                if( simulateError.simulate() ) {

                    util.setError(404, {
                        "message" : "No se ha podido establecer una conexión",
                        "name" : "Error simulado"
                    });

                    return util.send(res);
                }


                let product = {
                    'id' : data.data.uniqueID,
                    'sku' : data.data.partNumber,
                    'name' : data.data.name,
                    'image' : data.data.fullImage,
                    'price' : data.data.prices.formattedOfferPrice,
                    'shortDescription': data.data.shortDescription,
                    'longDescription': data.data.longDescription
                }

                // Guardamos la respuesta en cache
                redisClient.setex(productsRedisKey, process.env.REDIS_EXPIRE_TIME, JSON.stringify(product))
                util.setSuccess(data.status, 'OK', product );
                return util.send(res);

           })
           .catch(err => {

                util.setError(res.statusCode, err);
                return util.send(res);
           });
        });
    }
}


export default ProductController;