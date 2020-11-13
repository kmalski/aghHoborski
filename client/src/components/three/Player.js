import * as THREE from 'three';

export { Player };

class Player {
  constructor(name, head, body, position) {
    this.head = head;
    this.body = body;
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2000);
    this.pointOfIntersection = new THREE.Vector3(0, 200, 1500);

    this.threegroup = new THREE.Group();
    this.threegroup.name = name;
    this.threegroup.add(head);
    this.threegroup.add(body);
    this.threegroup.position.set(position.x, position.y, position.z);

    this.head.lookAt(this.pointOfIntersection);
    this.body.lookAt(new THREE.Vector3(0, 0, 10000));
  }

  setX(x) {
    this.threegroup.position.setX(x);
  }

  setY(y) {
    this.threegroup.position.setY(y);
  }

  setZ(z) {
    this.threegroup.position.setZ(z);
  }

  pick() {
    this.setZ(100);
  }

  reset() {
    this.setZ(0);
  }

  update(raycaster) {
    raycaster.ray.intersectPlane(this.plane, this.pointOfIntersection);
    this.head.lookAt(this.pointOfIntersection);
  }
}
