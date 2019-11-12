// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  CONFIG REDIS
// ============================
process.env.REDIS_EXPIRE_TIME = '60'; // segundos

// ============================
//  URL API
// ============================
process.env.URLAPI = process.env.URLAPI || 'https://simple.ripley.cl/api/v2/';