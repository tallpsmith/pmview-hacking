var Vue = require('vue/dist/vue.js');


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
    template: '<vgl-group :position="diskOffset">\n\t<vgl-text-geometry :name="textId" font="node_modules/three/examples/fonts/helvetiker_regular.typeface.json" :height="label.height" :text="diskName"></vgl-text-geometry>\n' +
        '<vgl-mesh :geometry="textId" material="std" rotation="-1.5708 0 0"></vgl-mesh>\n' +
        ' <vgl-box-geometry :name="boxId" :width="diskWidth" :height="diskHeight()" :depth="diskDepth"/>' +
        '\'<vgl-mesh :geometry="boxId" material="std" :position=boxPosition()></vgl-mesh>\\' +
        '</vgl-group>',

    computed: {
        diskWidth: function () {
            return 100;
        },
        diskDepth: function () {
            return 100;
        },
        textId: function () {
            return `text.${this.index}`;
        },
        boxId: function () {
            return `box.${this.index}`;
        },
        diskOffset: function () {
            return "0 0 " + (this.index * 200) + "  ";
        },
    },
    methods: {


        diskHeight: function () {
            const maxHeight = 500;
            return this.utilization * maxHeight;
        },
        boxPosition: function () {
            thediskHeight = this.diskHeight() / 2;
            return `750 ${thediskHeight} 0`;
        },


    }

})