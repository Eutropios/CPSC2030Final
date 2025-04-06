//mongodb+srv://mbouguerra:<db_password>@summer.hnqug.mongodb.net/?retryWrites=true&w=majority&appName=summer
(() => {
    const config = {};
    config.SERVER = process.env.DB_SERVER;
    config.USERNAME = process.env.DB_USERNAME;
    config.PASSWORD = process.env.DB_PASSWORD;
    config.DATABASE = "Database";
    module.exports = config;
})();
//mongodb+srv://mongo:<db_password>@test-cluster.aqrlg1f.mongodb.net/?retryWrites=true&w=majority&appName=Test-Cluster
