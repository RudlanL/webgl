import * as THREE from './vendor/three.js-master/build/three.module.js';

const Scene = {
    vars:{
        container : null,
        scene: null,
        camera: null,
        renderer: null
    },
    init: () =>{
        console.log("init");
        let vars = Scene.vars;
        vars.container = document.createElement('div');
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xe1e1e1);

        vars.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        vars.container.appendChild(vars.renderer.domElement);

    }
}