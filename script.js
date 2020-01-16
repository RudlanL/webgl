import * as THREE from './vendor/three.js-master/build/three.module.js';
import {
    OrbitControls
} from './vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { KeyframeTrack } from './vendor/three.js-master/src/Three.js';

const Scene = {
    vars:{
        container : null,
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        keyboard: new THREE.Key
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene,Scene.vars.camera);

    },
    onKeyDown: () => {

    },
    animate: () => {
        Scene.render();
    },
    loadFBX: (file, size, position, rotation, name, callback) => {
        let loader = new FBXLoader();
        loader.load(file, function (object) {
            object.scale.set(size, size, size);

            object.position.set(position[0], position[1], position[2]);

            object.rotation.set(rotation[0], rotation[1], rotation[2]);

        });
        Scene.vars[name] = object;
        callback();
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
        vars.camera.position.set(0,1000,1000);
        vars.camera.rotation.x = -Math.PI/5;

        //évenement
        window.addEventListener('keydown', Scene.onKeyDown, false);
    

        //Creation de l'HemishereLight
        let hemilight = new THREE.HemisphereLight(0xFFFFFF,0x444444,0.5);
        hemilight.position.set(0,700,0);
        vars.scene.add(hemilight);

        //Création du sol
        let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshLambertMaterial({
            color: new THREE.Color(0x006994)
        }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = false;
        vars.scene.add(mesh);

        //Création du terrain
        let wall = new THREE.Mesh(new THREE.BoxGeometry(50,100,60),new THREE.MeshLambertMaterial({
            color: new THREE.Color(0xFFFFFF)
        }));
        wall.position.set(90,0,0);
        vars.scene.add(wall);
        //Ajout de l'avion
        Scene.loadFBX("piper_pa18.fbx", 10, [0, 0, 0], [0, 0, 0], 0x000000, "airplane", () => {
            
        });
        Scene.animate();
    }
};
Scene.init();