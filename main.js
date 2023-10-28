import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);

// Set the initial camera position
camera.position.set(0, 1.7, 10);

const loader = new GLTFLoader();

// Loading the objects
let model; // Variable to store the object model
loader.load(
  "assets/hostel_a.glb", // Replace with the path to your model
  function (gltf) {
    model = gltf.scene;
    // model.position(0, 0, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let car_model; // Variable to store the object model
loader.load(
  "free__atlanta_corperate_office_building/scene.gltf", // Replace with the path to your model
  function (gltf) {
    car_model = gltf.scene;
    car_model.position.set(50, -8, -1);
    scene.add(car_model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const geometry = new THREE.BoxGeometry(10000, 1, 10000);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const ground = new THREE.Mesh(geometry, material);
ground.position.set(-500, -1, 500);
scene.add(ground);

// Create a light
const lightColor = 0xffffff;
const lightIntensity = 1;
const light = new THREE.AmbientLight(lightColor, lightIntensity);
scene.add(light);

const forward = new THREE.Vector3().set(0, 0, -1);
const right = new THREE.Vector3().set(1, 0, 0);
const moveDirection = new THREE.Vector3();
const moveSpeed = 0.1;

// Variables for mouse-based camera movement
const mouseSensitivity = 0.01;

document.addEventListener("keydown", (event) => {
  if (event.code == "KeyW") {
    // Calculate the forward direction based on camera orientation
    moveDirection.copy(forward).multiplyScalar(moveSpeed);
  }
  // break;
  if (event.code == "KeyS") {
    moveDirection.copy(forward).multiplyScalar(-moveSpeed); // Move backward
  }
  // break;
  if (event.code == "KeyA") {
    moveDirection.copy(right).multiplyScalar(-moveSpeed); // Move left
  }
  // break;
  if (event.code == "KeyD") {
    moveDirection.copy(right).multiplyScalar(moveSpeed); // Move right
    // break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
    case "KeyS":
    case "KeyA":
    case "KeyD":
      moveDirection.set(0, 0, 0); // Stop moving
      break;
  }
});

let pitch = 0;
let yaw = 0;
let isMouseMoving = false;
document.addEventListener("mousemove", (event) => {
  const deltaX = event.movementX || event.mozMovementX || 0;
  const deltaY = event.movementY || event.mozMovementY || 0;

  if (deltaX !== 0 || deltaY !== 0) {
    isMouseMoving = true; // Mouse is moving
  }

  // Update pitch and yaw based on mouse movement
  yaw -= deltaX * mouseSensitivity;
  pitch -= deltaY * mouseSensitivity;

  // Limit the pitch angle to avoid flipping
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

  // Updating the vectors
  forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  right.set(-Math.sin(yaw - Math.PI / 2), 0, -Math.cos(yaw - Math.PI / 2));
  forward.normalize();
  right.normalize();
});

// collisions

// Check collision with ground
function checkCollisionWithGround() {
  // Assuming the camera is your object for collision
  const cameraPosition = camera.position;

  if (cameraPosition.y < 0) {
    // Collision with ground (y < 0)
    camera.position.y = 0; // Reset camera's y-coordinate to avoid going below ground
    // You can also implement other responses, like bouncing, here
  }
}

//coliision with the models
function checkCollisionWithModels() {}

function animate() {
  requestAnimationFrame(animate);

  // if (!isMouseMoving) {
  //   // If the mouse is not moving, stop the camera rotation
  //   return;
  // }
  camera.rotation.x = pitch;
  camera.rotation.y = yaw;

  // Calculate the quaternion for the camera's rotation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(right, pitch);
  quaternion.multiply(
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
  );

  // Apply the quaternion rotation to the camera
  camera.setRotationFromQuaternion(quaternion);

  camera.position.add(moveDirection);

  renderer.render(scene, camera);
}

animate();