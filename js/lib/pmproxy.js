// module pmproxy

var axios = require('axios');

function PMProxy(host='localhost', port=44322) {
    const pmproxyAxios = axios.create({
        baseURL: 'http://' + host + ":" + port + ""
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
        metricName: function (series) {
            return pmproxyAxios.get('series/metrics?series=' + series);
        },
        instanceNames: function (series) {
            return pmproxyAxios.get('series/instances?series=' + series);
        }
    }
};


module.exports = PMProxy;