<template>
  <div class="scene" ref="scene" />
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
      delay: 0
    };
  },
  mounted() {
    this.container = this.$refs.scene;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(65, this.container.clientWidth / this.container.clientHeight, 1, 3000);
    this.camera.position.z = 2500;
    this.camera.position.y = 300;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;

    window.addEventListener('resize', this.onWindowResize);
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('touchmove', this.onTouchMove);

    const oldMan = new OldMan(new THREE.Vector3(-900, 100, 0));
    const woman = new Woman(new THREE.Vector3(0, 150, 0));
    const man = new Man(new THREE.Vector3(900, 100, 0));

    this.characters = [oldMan, woman, man];
    this.objects = [oldMan.threegroup, woman.threegroup, man.threegroup];
    this.scene.add(oldMan.threegroup);
    this.scene.add(woman.threegroup);
    this.scene.add(man.threegroup);
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
        this.mouse.x = (event.touches[0].pageX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].pageY / this.container.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }
    },
    addLights() {
      const lightColor = 0xffffff;
      const hemiLight = new THREE.HemisphereLight(lightColor, lightColor, 0.6);

      // const dirLight = new THREE.DirectionalLight(0x61ba9b, 0.3);
      const dirLight = new THREE.DirectionalLight(lightColor, 0.3);
      dirLight.position.set(200, 200, 200);
      dirLight.castShadow = true;

      // const backLight = new THREE.DirectionalLight(0x62adbf, 0.3);
      const backLight = new THREE.DirectionalLight(lightColor, 0.3);
      backLight.position.set(-200, 200, 50);
      backLight.castShadow = true;

      this.scene.add(backLight);
      this.scene.add(hemiLight);
      this.scene.add(dirLight);
    },
    pickPlayer() {
      const intersects = this.raycaster.intersectObjects(this.objects, true);
      if (intersects.length > 0) {
        for (let i = 0; i < this.characters.length; i++) {
          if (intersects[0].object.parent.parent === this.characters[i].threegroup) {
            this.characters[i].pick();
            this.delay = 0;
            break;
          }
        }
      } else {
        for (let i = 0; i < this.characters.length; i++) {
          this.characters[i].reset();
        }
      }
    },
    animate() {
      this.renderer.render(this.scene, this.camera);
      this.characters.forEach(character => character.update(this.raycaster));
      this.pickPlayer();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped lang="scss">
.scene {
  width: 100%;
  height: 75%;
  padding: 0;
  margin: 0;
}
</style>
