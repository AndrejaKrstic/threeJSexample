import "./style.css";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// @ts-ignore
import myGLB from "./lib/res/models/opa.glb";

const loadingManager = new THREE.LoadingManager();
const loader = new GLTFLoader(loadingManager);
const scene = new THREE.Scene();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
loader.setDRACOLoader(dracoLoader);

const loadingDiv = document.getElementById("progressDiv") as HTMLDivElement;

const ambientLightning = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLightning);
scene.background = new THREE.CubeTextureLoader()
  .setPath("https://sbcode.net/img/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Started loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

loadingManager.onLoad = function () {
  console.log("Loading complete!");
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

loadingManager.onError = function (url) {
  console.log("There was an error loading " + url);
};

loader.load(
  // resource URL
  myGLB,
  // called when the resource is loaded
  function (gltf) {
    scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    const progress = ((xhr.loaded / xhr.total) * 100).toFixed(2);
    console.log(progress + "% loaded");

    loadingDiv.innerHTML = `Progress: ${progress}%`;
    if (progress === "100.00") {
      loadingDiv.style.display = "none";
    }
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
    console.log(error);
  }
);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 25);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

new OrbitControls(camera, renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  camera.lookAt(0, 0.5, 0);

  renderer.render(scene, camera);

  stats.update();
}

animate();
