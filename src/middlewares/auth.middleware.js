const jwt = require('jsonwebtoken');

const autheticate = async (resolve, parent, args, context, info) => {

    const authHeader = context.request.get("Authorization");

    if(!authHeader)
        throw new Error("No Token provided");
        
    const parts = authHeader.split(' ');
    
    if (!parts.length === 2)
        throw new Error("Token error");
    
    const [ scheme, token ] = parts;
    
    if (!/^Bearer$/i.test(scheme)) 
        throw new Error("Token malformatted");
    
    await jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {

        if (err) throw new Error("Token invalid");
    
        context.userId = decoded.id;
    });


    return resolve(parent, args, context, info);

}

module.exports = autheticate;