module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.id || (req.body && req.body.id)) {
        context.res = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(context.bindings.ratingRecord)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a userId on the query string or in the request body"
        };
    }
};