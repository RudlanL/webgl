import * as THREE from './vendor/three.js-master/build/three.module.js';

const Scene = {
    vars:{
        container : null,
        scene: null,
        camera: null,
        renderer: null
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene,Scene.vars.camera);

    },
    animate: () => {
        Scene.render();
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

        //Création de la camera
        vars.camera = new THREE.PerspectiveCamera(57,window.innerWidth /window.innerHeight,1,2000)
        vars.camera.position.set(0,210,572);

        //Creation de l'HemishereLight
        let hemilight = new THREE.HemisphereLight(0xFFFFFF,0x444444,0.5);
        hemilight.position.set(0,700,0);
        vars.scene.add(hemilight);
        
        Scene.animate();
    }
};
Scene.init();