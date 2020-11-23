import { MeshLambertMaterial, Mesh, BoxGeometry } from 'three';
import { Player } from './Player';

export { Woman };

const blackMat = new MeshLambertMaterial({
  color: '#242626',
  flatShading: true
});

const whiteMat = new MeshLambertMaterial({
  color: 'white',
  flatShading: true
});

const skinMat = new MeshLambertMaterial({
  color: '#e0bea5',
  flatShading: true
});

const hairMat = new MeshLambertMaterial({
  color: '#ecce94',
  flatShading: true
});

const irisMat = new MeshLambertMaterial({
  color: '#143822',
  flatShading: true
});

const shirtMat = new MeshLambertMaterial({
  color: '#1e1e1e',
  flatShading: true
});

const skirtMat = new MeshLambertMaterial({
  color: '#0275d8',
  flatShading: true
});

const beltMat = new MeshLambertMaterial({
  color: '#ecce94',
  flatShading: true
});

const hairbandMat = new MeshLambertMaterial({
  color: '#fb7c7c',
  flatShading: true
});

// Head
const head = new Mesh(new BoxGeometry(275, 325, 250), skinMat);
head.position.set(0, 160, 400);

const hairLeft = new Mesh(new BoxGeometry(65, 400, 260), hairMat);
hairLeft.position.set(-155, -25, -50);

const hairRight = hairLeft.clone();
hairRight.position.set(155, -25, -50);

const hairFront = new Mesh(new BoxGeometry(375, 75, 310), hairMat);
hairFront.position.set(0, 152, -25);

const hairbandLeft = new Mesh(new BoxGeometry(70, 75, 260), hairbandMat);
hairbandLeft.position.set(-155, 0, -20);

const hairbandRight = hairbandLeft.clone();
hairbandRight.position.set(155, 0, -20);

const eyebrowLeft = new Mesh(new BoxGeometry(50, 15, 10), hairMat);
eyebrowLeft.position.set(-80, 35, 160);

const eyebrowRight = eyebrowLeft.clone();
eyebrowRight.position.set(80, 35, 160);

const eyeLeft = new Mesh(new BoxGeometry(50, 40, 10), whiteMat);
eyeLeft.position.set(-80, 0, 160);

const eyeRight = eyeLeft.clone();
eyeRight.position.set(80, 0, 160);

const irisLeft = new Mesh(new BoxGeometry(25, 30, 5), irisMat);
irisLeft.position.set(10, -2, 3);
eyeLeft.add(irisLeft);

const irisRight = irisLeft.clone();
irisRight.position.set(-10, -2, 3);
eyeRight.add(irisRight);

const lip = new Mesh(new BoxGeometry(45, 20, 5), blackMat);
lip.position.set(0, -110, 162);

head.add(hairLeft);
head.add(hairRight);
head.add(hairFront);
head.add(hairbandLeft);
head.add(hairbandRight);
head.add(eyebrowLeft);
head.add(eyebrowRight);
head.add(eyeLeft);
head.add(eyeRight);
head.add(lip);

// Body
const body = new Mesh(new BoxGeometry(250, 225, 150), shirtMat);
body.position.set(0, -220, 400);

const armLeft = new Mesh(new BoxGeometry(60, 190, 100), shirtMat);
armLeft.position.set(-145, -25, 0);

const armRight = armLeft.clone();
armRight.position.set(145, -25, 0);

const handLeft = new Mesh(new BoxGeometry(60, 300, 50), skinMat);
handLeft.position.set(0, -15, 0);

const handRight = handLeft.clone();
handRight.position.set(0, -15, 0);

const belt = new Mesh(new BoxGeometry(255, 25, 135), beltMat);
belt.position.set(0, -130, -10);

const skirt = new Mesh(new BoxGeometry(240, 125, 125), skirtMat);
skirt.position.set(0, -200, -10);

const legLeft = new Mesh(new BoxGeometry(75, 300, 100), skinMat);
legLeft.position.set(-75, -200, -10);

const legRight = legLeft.clone();
legRight.position.set(75, -200, -10);

const shoeLeft = new Mesh(new BoxGeometry(75, 50, 175), shirtMat);
shoeLeft.position.set(-75, -360, 25);

const shoeRight = shoeLeft.clone();
shoeRight.position.set(75, -360, 25);

armLeft.add(handLeft);
armRight.add(handRight);

armRight.name = 'upHand';

body.add(armLeft);
body.add(armRight);
body.add(belt);
body.add(skirt);
body.add(legLeft);
body.add(legRight);
body.add(shoeLeft);
body.add(shoeRight);

class Woman extends Player {
  constructor(position) {
    super('Woman', head.clone(), body.clone(), position);
  }

  pick() {
    super.pick();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = Math.PI;
    hand.rotation.z = -100;
    hand.position.x = 175;
    hand.position.y = 150;
  }

  reset() {
    super.reset();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = 0;
    hand.rotation.z = 0;
    hand.position.x = 145;
    hand.position.y = -25;
  }
}
