(() => {
    const config = {};
    config.SERVER = process.env.DB_SERVER;
    config.USERNAME = process.env.DB_USERNAME;
    config.PASSWORD = process.env.DB_PASSWORD;
    config.DATABASE = process.env.DB_DATABASE;
    module.exports = config;
})();
