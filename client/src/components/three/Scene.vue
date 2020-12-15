<template>
  <div class="scene" ref="scene">
    <p class="scene__hint">Kliknij nas!</p>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OldMan } from '@/components/three/OldMan';
import { Woman } from '@/components/three/Woman';
import { Man } from '@/components/three/Man';

export default {
  name: 'Scene',
  data() {
    return {
      container: null,
      camera: null,
      renderer: new THREE.WebGLRenderer({ alpha: true, antialias: true }),
      scene: new THREE.Scene(),
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      characters: [],
      objects: [],
      isClicked: false,
      releaseDelay: 0
    };
  },
  mounted() {
    this.container = this.$refs.scene;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(65, this.container.clientWidth / this.container.clientHeight, 1, 3000);
    this.camera.position.set(0, 300, 2300);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;

    this.bindEvents();
    this.addPlayers();
    this.addLights();
    this.animate();
  },
  methods: {
    onWindowResize() {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    },
    onMouseMove(event) {
      this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
      this.mouse.y = -((event.clientY - 150) / this.container.clientHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
    },
    onTouchMove(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        this.isClicked = true;
        this.mouse.x = (event.touches[0].pageX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].pageY / this.container.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }
    },
    onDown() {
      this.isClicked = true;
      this.releaseDelay = 0;
      this.pickPlayer();
    },
    onUp() {
      this.isClicked = false;
      this.releaseDelay = 0;
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i].reset();
      }
    },
    getParentGroup(obj) {
      let group = obj;
      while (group.type !== 'Group') {
        group = group.parent;
      }
      return group;
    },
    pickPlayer() {
      const intersects = this.raycaster.intersectObjects(this.objects, true);
      if (intersects.length > 0) {
        const obj = this.getParentGroup(intersects[0].object);
        for (let i = 0; i < this.objects.length; i++) {
          if (obj === this.objects[i]) {
            this.characters[i].pick();
            this.releaseDelay = 0;
            break;
          }
        }
      } else {
        this.releaseDelay += 1;

        if (this.releaseDelay > 5) {
          for (let i = 0; i < this.characters.length; i++) {
            this.characters[i].reset();
          }
        }
      }
    },
    bindEvents() {
      window.addEventListener('resize', this.onWindowResize);
      this.container.addEventListener('mousemove', this.onMouseMove);
      this.container.addEventListener('touchmove', this.onTouchMove);
      this.container.addEventListener('mousedown', this.onDown);
      this.container.addEventListener('mouseup', this.onUp);
      this.container.addEventListener('ontouchend', this.onUp);
    },
    addPlayers() {
      const oldMan = new OldMan(new THREE.Vector3(-900, 100, 0));
      const woman = new Woman(new THREE.Vector3(0, 150, 0));
      const man = new Man(new THREE.Vector3(900, 100, 0));

      this.characters = [oldMan, woman, man];
      this.objects = [oldMan.threegroup, woman.threegroup, man.threegroup];
      this.scene.add(oldMan.threegroup);
      this.scene.add(woman.threegroup);
      this.scene.add(man.threegroup);
    },
    addLights() {
      const lightColor = 0xffffff;
      const hemiLight = new THREE.HemisphereLight(lightColor, lightColor, 0.6);

      const dirLight = new THREE.DirectionalLight(lightColor, 0.3);
      dirLight.position.set(0, 300, 4000);
      dirLight.castShadow = true;

      const backLight = new THREE.DirectionalLight(lightColor, 0.3);
      backLight.position.set(0, 1000, 100);
      backLight.castShadow = true;

      this.scene.add(backLight);
      this.scene.add(hemiLight);
      this.scene.add(dirLight);
    },
    animate() {
      this.renderer.render(this.scene, this.camera);
      this.characters.forEach(character => character.update(this.raycaster));
      if (this.isClicked) this.pickPlayer();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.scene {
  position: relative;
  width: 100%;
  height: 75vh;
  padding: 0;
  margin: 0;

  &__hint {
    position: absolute;
    left: 50%;
    bottom: 15%;
    transform: translate(-50%, 0);
    margin: 0;
    font-family: monospace;
    font-size: 15px;
    font-weight: 700;
    color: #bbbbbb;
  }
}

@include media-breakpoint-down(md) {
  .scene {
    height: 60vh;
  }
}
</style>
