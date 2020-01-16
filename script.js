import * as THREE from './vendor/three.js-master/build/three.module.js';
import Stats from './vendor/three.js-master/examples/jsm/libs/stats.module.js';
import {
    OrbitControls
} from './vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import {
    FBXLoader
} from './vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';
const Scene = {
    vars: {
        container: null,
        scene: null,
        stats: null,
        renderer: null,
        objet: null,
        collidableMeshList: [],
        camera: null,
        distance: 30,
        plane: null
    },
    loadFBX: (file, size, position, rotation, color, name, callback) => {
        let loader = new FBXLoader();
        loader.load(file, function (object) {
            object.scale.set(size, size, size);

            object.position.set(position[0], position[1], position[2]);

            object.rotation.set(rotation[0], rotation[1], rotation[2]);


            object.traverse(function (node) {
                if (node.isMesh) {
                    node.receiveShadow = true;
                    node.castShadow = true;
                    node.material.color = new THREE.Color(color);
                }
            });

            Scene.vars[name] = object;

            callback();

        });

    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);

        Scene.vars.stats.update();
    },
    //Rafraichissement 
    animate: () => {
        Scene.render();

        requestAnimationFrame(Scene.animate);
    },
    onKeyDown: (event) => {
        var keyCode = event.key;
        if (keyCode == 'z' || keyCode== 'Z') {
            if(Scene.vars.plane.rotation.y != 0){
                Scene.vars.plane.rotation.y = 0
            }
            Scene.vars.plane.position.z += Scene.vars.distance;
        } else if (keyCode == 's' || keyCode== 'S') {
            if(Scene.vars.plane.rotation.y != Math.PI){
                Scene.vars.plane.rotation.y = Math.PI
            }
            Scene.vars.plane.position.z -= Scene.vars.distance;
        } else if (keyCode == 'q' || keyCode== 'Q') {
            if(Scene.vars.plane.rotation.y != -Math.PI/2){
                Scene.vars.plane.rotation.y = -Math.PI/2
            }
            Scene.vars.plane.position.x -= Scene.vars.distance;
        } else if (keyCode == 'd' || keyCode== 'D') {
            if(Scene.vars.plane.rotation.y != Math.PI/2){
                Scene.vars.plane.rotation.y = Math.PI/2
            }
            Scene.vars.plane.position.x += Scene.vars.distance;
        } else if (keyCode == ' ') {
            Scene.vars.plane.rotation.y = 0;
            Scene.vars.plane.position.set(0, 0, 0);
        }
        Scene.render();
    },
    init: () => {
        console.log("init");
        let vars = Scene.vars;
        var collidableMeshList = [];
        // Preparer le container de la scene
        vars.container = document.createElement('div');
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xa0a0a0);

        vars.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        vars.container.appendChild(vars.renderer.domElement);

        //Creation de la caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(-1.5, 210, 572);

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

        let planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.07;
        let shadowPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000,
            2000), planeMaterial);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.receiveShadow = true;
        vars.scene.add(shadowPlane);

        //Création du terrain
        let wall = new THREE.Mesh(new THREE.BoxGeometry(500,100,200),new THREE.MeshLambertMaterial({
            color: new THREE.Color(0xFFFFFF)
        }));
        wall.position.set(90,0,0);
        vars.scene.add(wall);
        collidableMeshList.push(wall);

        //Redimension de la window
        window.addEventListener('resize', Scene.onWindowResize, false);
        window.addEventListener('keydown',Scene.onKeyDown,false);
        vars.stats = new Stats();
        vars.container.appendChild(vars.stats.dom);

        Scene.loadFBX("piper_pa18.fbx", 0.1, [0, 30, 0], [0, 0, 0], 0xffff00, "plane", () => {
            let airplane = new THREE.Group();
            airplane.add(Scene.vars.plane);
            
            vars.scene.add(airplane);
            var originPoint = Scene.vars.plane.position.clone();
            for (var vertexIndex = 0; vertexIndex < Scene.vars.plane.geometry.vertices.length; vertexIndex++)
	        {		
		    var localVertex = Scene.vars.plane.geometry.vertices[vertexIndex].clone();
		    var globalVertex = localVertex.applyMatrix4( Scene.vars.plane.matrix );
		    var directionVector = globalVertex.sub( Scene.vars.plane.position );
		
		    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		    var collisionResults = ray.intersectObjects( collidableMeshList );
		    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			    console.log('Hit')
	        }

        });
        document.querySelector('#loader').remove();


        Scene.animate();

    }
};
Scene.init();