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

Vue.component('pcp-disk', {
    props: {
        index: Number,
        diskName: String,
        utilization: Number,
    },
    data: function () {
        return {
            position: "0 0 0",
            label: {
                height: 5
            },
        };
    },
    template: '<vgl-group :position="offsetDisk(index)">\n\t<vgl-text-geometry :name="computeTextId(index)" font="node_modules/three/examples/fonts/helvetiker_regular.typeface.json" :height="label.height" :text="diskName"></vgl-text-geometry>\n' +
        '<vgl-mesh :geometry="computeTextId(index)" material="std" rotation="-1.5708 0 0"></vgl-mesh>\n' +
        ' <vgl-box-geometry :name="computeBoxId(index)" :width="diskWidth" :height="diskHeight()" :depth="diskDepth"/>' +
        '\'<vgl-mesh :geometry="computeBoxId(index)" material="std" :position=boxPosition()></vgl-mesh>\\' +
        '</vgl-group>',

    computed: {
        diskWidth: function () {
            return 100;
        },
        diskDepth: function () {
            return 100;
        },

    },
    methods: {
        computeTextId: function (index) {
            return `text.${index}`;
        },
        computeBoxId: function (index) {
            return "`box." + index;
        },
        offsetDisk: function (index) {
            return "0 0 " + (index * 200) + "  ";
        },

        diskHeight: function () {
            const maxHeight = 500;
            return this.utilization * maxHeight;
        },
        boxPosition: function () {
            thediskHeight = this.diskHeight() / 2;
            return `750 ${thediskHeight} 0`;
        },


    }

});

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
    })
;


autoPlay(true);

let updateCallback = ({height}) => {
    vue.disks[0].height = height;
};


var boxTween = new Tween({height: 0})
    .to({height: 100}, 1000)
    .on('update', updateCallback)
;

//boxTween.repeat(2).yoyo(true).start();


function renderScene() {
    requestAnimationFrame(renderScene);
    vue.$refs.renderer.render();
};
renderScene();
