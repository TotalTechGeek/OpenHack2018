module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const request = require('request-promise-native')
    const parse = require('csv-parse/lib/sync')
    let body
    if(typeof req.body === "string")
    {
        body = JSON.parse(req.body)
    }
    else 
    {
        body = req.body
    }

    context.log(body)
   
    if(body)
        body = (body.body || {}).value

    if(Array.isArray(body))
    {
        let compute = {} 

        body.forEach(i => {
            compute[i.content.url.split('-')[1]] = request(i.content.url) 
        })

        return Promise.all([compute['ProductInformation.csv'], compute['OrderHeaderDetails.csv'], compute['OrderLineItems.csv']]).then(([
            products,
            headers,
            items
        ]) =>
        {
            products = parse(products, { columns: true })
            headers = parse(headers, { columns: true })
            items = parse(items, { columns: true })

            headers.forEach(header => 
            {
                header.items = items.filter(i=>i['ponumber'] === header['ponumber'])
            })

            items.forEach(item =>
            {
                delete item.ponumber

                products.filter(i=>i.productid === item.productid).forEach(i=>
                {
                    Object.assign(item, i)
                })
            })

            context.bindings.batchRecord = headers;

            context.res = {
                body: JSON.stringify(headers)
            };
        })

    }
    else
    {
        context.res = {
            status: 400,
            body: "I do not recognize this input"
        };
    }

    
};