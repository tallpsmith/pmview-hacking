// module pmproxy

var axios = require('axios');

function PMProxy(host = 'localhost', port = 44322) {
    const pmproxyAxios = axios.create({
        baseURL: 'http://' + host + ":" + port + "",
        debug: true
    });

    return {
        expression: '',
        setExpression: function (expression) {
            this.expression = expression;
            return this;
        },
        seriesQuery: function () {
            return pmproxyAxios.get('/series/query?expr=' + this.expression);
        },
        seriesMetricValues: function (metric, samples = 1) {
            return pmproxyAxios.get(encodeURI(`/series/query?expr=${metric}[samples:${samples}]`));
        },
        metricName: function (series) {
            return pmproxyAxios.get('series/metrics?series=' + series);
        },
        instanceNames: function (series) {
            return pmproxyAxios.get('series/instances?series=' + series);
        }
    }
};


module.exports = PMProxy;