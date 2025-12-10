const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Логируем тело запроса для POST/PUT
    if (['POST', 'PUT'].includes(method) && req.body) {
        console.log('Тело запроса:', JSON.stringify(req.body, null, 2));
    }

    next();
};

module.exports = { requestLogger };