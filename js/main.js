var three = require('three');
var Vue = require('vue/dist/vue.js');
var VueGL = require('vue-gl');

// TODO need to switch this to be a module so I can use
// import
//import { Easing, Tween, autoPlay } from 'es6-tween'
const {Tween, Easing, autoPlay} = require('es6-tween');


Object.keys(VueGL).forEach(name => {
    Vue.component(name, VueGL[name]);
});

var vue = new Vue({
        el: '#app',
        methods: {
            calculateBoxPosition: function (disk) {
                return `750 ${disk.height / 2} 0`;
            },
            calculateRotation: function () {
                return this.rotator + " 0 0";
            },
            offsetDisk: function (index) {
                return "0 0 " + (index * 200) + "  ";
            },
            cameraPosition: function () {
                return this.camera.orbitPosition.distance + " " + this.camera.orbitPosition.phi + " " + this.camera.orbitPosition.theta;
            },
            cameraTarget: function () {
                return this.camera.orbitTarget.x + " " + this.camera.orbitTarget.y + " " + this.camera.orbitTarget.z;
            },
        },
        data: {
            rotator: 0.0,
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
                    distance: 1500,
                    phi: 1.3,
                    theta: 0.3,
                }
            },
            disks: [
                {
                    "lheight": 5,
                    "text": '/dev/sda',
                    "width": 100,
                    "height": 10,
                    "depth": 100,
                },
                {
                    "lheight": 5,
                    "text": '/dev/sdb',
                    "width": 100,
                    "height": 100,
                    "depth": 100,
                },
                {
                    "lheight": 5,
                    "text": '/dev/sdc',
                    "width": 100,
                    "height": 50,
                    "depth": 100,
                }
            ]
        },
    })
;

autoPlay(true);

let updateCallback = ({height}) => {
    vue.disks[0].height = height;
};

const targetSpherical = new three.Spherical(0, 1.3, 3.14 * 2);
var cameraTween = new Tween(vue.camera.orbitPosition).to(targetSpherical, 5000);

var boxTween = new Tween({height: 0})
    .to({height: 100}, 1000)
    .on('update', updateCallback)
;

boxTween.repeat(2).yoyo(true).start();
cameraTween.repeat(3).start();

function renderScene() {
    requestAnimationFrame(renderScene);
    vue.$refs.renderer.render();
};
renderScene();
