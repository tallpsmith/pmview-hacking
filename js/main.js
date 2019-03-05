var three = require('three');
var Vue = require('vue/dist/vue.js');
var VueGL= require('vue-gl');


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
        cameraPosition: function(){
          //return "`${camera.x} ${camera.y} ${camera.z}`"
            //console.log("`${this.camera.x} ${this.camera.y} ${this.camera.z}`");
            // return "1200 1.3 0.3";
            return this.camera.x + " " + this.camera.y + " " + this.camera.z;
        },
    },
    data: {
        rotator: 0.0,
        axishelper: {
            size: 500
        },
        camera: {
            x: 1200,
            y: 1.3,
            z: 0.3,
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
});

function renderScene() {
    vue.disks.forEach(function (disk) {
        disk.height++;
        if (disk.height > 200) {
            disk.height = 0;
        }
    })
    requestAnimationFrame(renderScene);
    vue.$refs.renderer.render();
};
renderScene();
