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
            },
            selectSeries: function (selectedSeries) {
                this.selectedSeries = selectedSeries;
                var data = this;
                new PMProxy('localhost').metricName(this.selectedSeries).then(function(response){
                    data.metricName = response.data[0].name;
                });
                new PMProxy('localhost').instanceNames(this.selectedSeries).then(function(response){
                    data.instances = response.data
                });
            },
            querySeries: function () {
                var data = this;
                new PMProxy('localhost').setExpression(data.seriesQuery).seriesQuery().then(function(response){
                    data.pmseries = response.data;
                });
            }


        },
        data: {
            axishelper: {
                size: 500
            },
            camera: {
                orbitTarget: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                orbitPosition: {
                    distance: 1000,
                    phi: 0.8,
                    theta: 0.3,
                }
            },
            seriesQuery: 'disk.dev.*',
            pmseries:[],
            instances: [],
            selectedSeries: '<no series selected>',
            metricName: '<no series selected>',
            disks: [
                {
                    text: '/dev/sda',
                    utilization: 0.5,
                },
                {
                    text: '/dev/sdb',
                    utilization: 0.7,
                },
                {
                    text: '/dev/sdc',
                    utilization: 1.0,
                }
            ]
        },
        mounted: function() {
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

