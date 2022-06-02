import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    // #cube;
    #mesh;
    #control;



    constructor() {
        console.log("Hello, three.js");

        const domContainer = document.querySelector("#webgl_container");
        this.#domContainer = domContainer;
        // 필드화. 또다른 매소드에서도 참조 가능.

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // 픽셀 배율 설정.
        // console.log(window.devicePixelRatio);
        //모니터마다 다름. 고해성도면 1 이상 값이 나옴. 픽셀이 미려하게 출력이 됨
        domContainer.appendChild(renderer.domElement);
        this.#renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0, 0, 0);
        this.#scene = scene;

        this.#setupCamera();
        this.#setupLight();
        this.#setupControls();

        this.#setupModel();

        this.resize();

        window.onresize = this.resize.bind(this);
        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        console.log("resize done")
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();

        this.#renderer.setSize(width, height);
    }

    // # 의미. App class 밖에서는 사용 못함.
    #setupCamera() {
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );

        camera.position.set(1, 2, 2);
        this.#camera = camera;
    }

    #setupLight() {
        const color = 0xffffff;

        const light1 = new THREE.DirectionalLight(color, 1);
        light1.position.set(0, 0, 2);
        this.#scene.add(light1);
        const helper1 = new THREE.DirectionalLightHelper(light1);
        this.#scene.add(helper1);

        const light2 = new THREE.DirectionalLight(color, 1);
        light2.position.set(3, 0, 0);
        this.#scene.add(light2);
        const helper2 = new THREE.DirectionalLightHelper(light2);
        this.#scene.add(helper2);


        const light3 = new THREE.DirectionalLight(color, 1);
        light3.position.set(-2, 2, 0);
        this.#scene.add(light3);
        const helper3 = new THREE.DirectionalLightHelper(light3);
        this.#scene.add(helper3);
        // 광원이 강할수록 재질의 특성이 크게 발현됨.

    }


    #setupModel() {
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("../examples/textures/uv_grid_opengl.jpg")
        const material = new THREE.MeshStandardMaterial({
            map: map,
        });

        // map.repeat.x = 3;
        // map.repeat.y = 3;

        // map.wrapS = THREE.RepeatWrapping;
        // map.wrapT = THREE.RepeatWrapping;

        // map.wrapS = THREE.ClampToEdgeWrapping;
        // map.wrapT = THREE.ClampToEdgeWrapping;

        // map.wrapS = THREE.MirroredRepeatWrapping;
        // map.wrapT = THREE.MirroredRepeatWrapping;

        // map.offset.x = 0.1;
        // map.offset.y = 0;

        // map.rotation = THREE.Math.degToRad(45);
        // map.center.set(0.5, 0.5);
        //중앙점 중심 회전

        map.magFilter = THREE.LinearFilter;
        map.minFilter = THREE.NearestMipmapLinearFilter;

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.set(-1, 0, 0);
        // 재질 다르게 설정. 박스는 안 투명하니까 구를 통해 투과해 보인다.

        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.set(1, 0, 0);


        this.#scene.add(box);
        this.#scene.add(sphere);

    }

    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }


    update(time) {
        time *= 0.001;
        // ms -> s
        // console.log(time);
        this.#control.update();

    }

    render(time) {
        this.#renderer.render(this.#scene, this.#camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
}

window.onload = function () {
    new App();
}