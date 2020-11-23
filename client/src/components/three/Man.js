import { MeshLambertMaterial, Mesh, BoxGeometry } from 'three';
import { Player } from './Player';

export { Man };

const skinMat = new MeshLambertMaterial({
  color: '#c09c83',
  flatShading: true
});

const blackMat = new MeshLambertMaterial({
  color: '#242626',
  flatShading: true
});

const whiteMat = new MeshLambertMaterial({
  color: 'white',
  flatShading: true
});

const hairMat = new MeshLambertMaterial({
  color: '#513f2c',
  flatShading: true
});

const irisMat = new MeshLambertMaterial({
  color: '#1e4d7d',
  flatShading: true
});

const shirtMat = new MeshLambertMaterial({
  color: '#a71930',
  flatShading: true
});

const beltMat = new MeshLambertMaterial({
  color: '#753a22',
  flatShading: true
});

const beltClipMat = new MeshLambertMaterial({
  color: '#cdbd51',
  flatShading: true
});

const legMat = new MeshLambertMaterial({
  color: '#10202e',
  flatShading: true
});

const legsGapMat = new MeshLambertMaterial({
  color: '#0c1924',
  flatShading: true
});

const shoesMat = new MeshLambertMaterial({
  color: '#332619',
  flatShading: true
});

// Head
const head = new Mesh(new BoxGeometry(275, 325, 250), skinMat);
head.position.set(0, 160, 400);

const hairBack = new Mesh(new BoxGeometry(300, 140, 260), hairMat);
hairBack.position.set(0, 110, -10);

const hairFront = new Mesh(new BoxGeometry(285, 80, 30), hairMat);
hairFront.position.set(0, 140, 120);

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

head.add(hairBack);
head.add(hairFront);
head.add(eyebrowLeft);
head.add(eyebrowRight);
head.add(eyeLeft);
head.add(eyeRight);
head.add(lip);

// Body
const body = new Mesh(new BoxGeometry(250, 265, 125), shirtMat);
body.position.set(0, -200, 400);

const armLeft = new Mesh(new BoxGeometry(60, 125, 100), shirtMat);
armLeft.position.set(-160, 65, 0);

const armRight = armLeft.clone();
armRight.position.set(160, 65, 0);

const handLeft = new Mesh(new BoxGeometry(58, 175, 85), skinMat);
handLeft.position.set(0, -125, 0);
armLeft.add(handLeft);

const handRight = handLeft.clone();
handRight.position.set(0, -125, 0);
armRight.add(handRight);

const belt = new Mesh(new BoxGeometry(255, 25, 135), beltMat);
belt.position.set(0, -125, 0);

const beltClip = new Mesh(new BoxGeometry(35, 25, 10), beltClipMat);
beltClip.position.set(0, 0, 75);
belt.add(beltClip);

const legs = new Mesh(new BoxGeometry(200, 260, 100), legMat);
legs.position.set(0, -225, -10);

const legsGap = new Mesh(new BoxGeometry(10, 130, 5), legsGapMat);
legsGap.position.set(0, -260, 38);

const shoes = new Mesh(new BoxGeometry(205, 50, 125), shoesMat);
shoes.position.set(0, -375, 10);

armRight.name = 'upHand';

body.add(armLeft);
body.add(armRight);
body.add(belt);
body.add(legs);
body.add(legsGap);
body.add(shoes);

class Man extends Player {
  constructor(position) {
    super('Man', head.clone(), body.clone(), position);
  }

  pick() {
    super.pick();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = Math.PI;
    hand.rotation.z = -100;
    hand.position.x = 150;
    hand.position.y = 150;
  }

  reset() {
    super.reset();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = 0;
    hand.rotation.z = 0;
    hand.position.x = 160;
    hand.position.y = 65;
  }
}
