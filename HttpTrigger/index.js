module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const PARAM_NAME = 'productId'
    if (req.query[PARAM_NAME] || (req.body && req.body[PARAM_NAME])) 
    {
        let productId = req.query[PARAM_NAME] || req.body[PARAM_NAME]
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: `The product name for your product id ${productId} is Starfruit Explosion`
        };
    }
    else {
        context.res = {
            status: 400,
            body: `Please pass a ${PARAM_NAME} on the query string or in the request body`
        };
    }
};