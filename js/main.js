var three = require('three');
var Vue = require('vue/dist/vue.js');
var VueGL = require('vue-gl');
var pcpDisk = require('./lib/pcp-disk');
var PMProxy = require('./lib/pmproxy');
require('bootstrap');

// TODO need to switch this to be a module so I can use
// import
//import { Easing, Tween, autoPlay } from 'es6-tween'
const {Tween, Easing, autoPlay} = require('es6-tween');


Object.keys(VueGL).forEach(name => {
    Vue.component(name, VueGL[name]);
});

;

var vue = new Vue({
        el: '#app',
        methods: {
            cameraPosition: function () {
                return this.camera.orbitPosition.distance + " " + this.camera.orbitPosition.phi + " " + this.camera.orbitPosition.theta;
            },
            cameraTarget: function () {
                return this.camera.orbitTarget.x + " " + this.camera.orbitTarget.y + " " + this.camera.orbitTarget.z;
            },
            startAnimation: function () {
                const targetSpherical = new three.Spherical(0, 1.3, 3.14 * 2);
                var cameraTween = new Tween(this.camera.orbitPosition).to(targetSpherical, 5000);
                cameraTween.repeat(3).start();
                this.disks.forEach(function (disk) {
                    console.log(disk);
                    new Tween(disk).to({utilization: 1.0}, 5000).repeat(5).start();

                });
            },
            selectSeries: function (selectedSeries) {
                this.selectedSeries = selectedSeries;
                var data = this;
                let pmProxy = new PMProxy(this.pmproxy.hostName, this.pmproxy.port);
                pmProxy.instanceNames(this.selectedSeries.seriesId).then(function (response) {
                    data.instances = response.data
                });
                pmProxy.seriesMetricValues(this.selectedSeries.metricName).then(function (response) {
                    data.metricValues = response.data;
                })
            },
            selectInstance: function (instance) {
                this.selectedInstance = instance;
            },
            querySeries: function () {
                var data = this;
                let pmProxy = new PMProxy(this.pmproxy.hostName, this.pmproxy.port);
                pmProxy.seriesQuery(data.seriesQuery).then(function (response) {
                    data.pmseries = response.data.map(seriesId => {
                        return {seriesId: seriesId, metricName: '<unknown>'}
                    });
                    // mega inefficient, but..
                    data.pmseries.forEach(function (series) {
                        pmProxy.metricName(series.seriesId).then(function (response) {
                            if (response.data.length == 0) {
                                return;
                            }
                            series.metricName = response.data[0].name;
                        });
                    });

                });
            },
            addDisk() {
                console.log(this.disks);
                let newDisk = {text: this.selectedInstance.name, utilization: 0.5};
                if (this.disks.length > 0) {
                    this.disks = [this.disks, newDisk];
                } else {
                    this.disks = [newDisk];
                }
            }


        },
        data: {
            axishelper: {
                size: 500
            },
            camera: {
                orbitTarget: {
                    x: 200,
                    y: 0,
                    z: 0
                },
                orbitPosition: {
                    distance: 1000,
                    phi: 0.8,
                    theta: 0.3,
                }
            },
            pmproxy: {
                hostName: "localhost",
                port: 44322

            },
            seriesQuery: 'disk.dev.*',
            pmseries: [],
            instances: [],
            selectedSeries: {metricName: '<no metric selected>'},
            metric: '<no series selected>',
            metricValues: [],
            selectedInstance: {name: '<no selected instance>'},
            disks: []
        },
        mounted: function () {
            this.querySeries();
        }
    })
;


autoPlay(true);

function renderScene() {
    requestAnimationFrame(renderScene);
    vue.$refs.renderer.render();
};
renderScene();

