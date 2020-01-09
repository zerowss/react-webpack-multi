const proxy = require('http-proxy-middleware');
const target = `http://${process.env.ERP_DOMAIN}`;
//before
module.exports = (app)=>{
    app.use(
      proxy("/api", {
        target,
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      })
    );
};


