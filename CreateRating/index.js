module.exports = async function (context, req) {
    const uuid = require('uuid/v4')
    const request = require('request-promise-native')
    // Various elements required by the POST request
    const USER = 'userId'
    const PRODUCT = 'productId'
    const RATING = 'rating'
    const NOTE = 'userNotes' 
    const LOCATION = 'locationName'

    let PARAMS = [RATING, USER, PRODUCT, NOTE, LOCATION]

    function grab(param)
    {
        return req.query[param] || (req.body && req.body[param])
    }

    function checkExists(params)
    {
        return params.map(i=>typeof grab(i) !== "undefined").reduce((cur, res) => cur && res)
    }

    function getRequest(uri, data)
    {
        return request({
            method: 'GET',
            uri: uri,
            qs: data
        })
    }

    let range = grab(RATING)

    return Promise.resolve().then(() =>
    {
        if(!checkExists(PARAMS))
        {
            return Promise.reject('One of the necessary parameters does not exist')
        }

        if(!(range >= 1 && range <= 5))
        {
            return Promise.reject('The value is not in range.')
        }
    }).then(() =>
    {
        return Promise.all([
            getRequest('https://serverlessohproduct.trafficmanager.net/api/GetProduct', { productId: grab(PRODUCT) }),
            getRequest('https://serverlessohuser.trafficmanager.net/api/GetUser', { userId: grab(USER) })
        ])
    }).then(([product, user]) =>
    {
        // context.log(product)
        // context.log(user)

        let id = uuid()
        let timestamp = new Date().toISOString().replace(/T/g, ' ')

        // context.log(id)
        // context.log(timestamp)

        let obj = { timestamp : timestamp, id: id, rating: range } 

        PARAMS.forEach(i=>
        {
            obj[i] = grab(i)
        })

        context.res = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }

        context.bindings.ratingRecord = JSON.stringify(obj);
    }).catch((err) =>
    {
        context.log(err)
        // there was an issue
        context.res = {
            status: 400,
            body: err.toString()
        };
    })

};