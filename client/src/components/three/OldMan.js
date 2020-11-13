import { MeshLambertMaterial, Mesh, BoxGeometry } from 'three';
import { Player } from './Player';

export { OldMan };

const blackMat = new MeshLambertMaterial({
  color: '#242626',
  flatShading: true
});

const skinMat = new MeshLambertMaterial({
  color: '#e0bea5',
  flatShading: true
});

const shirtMat = new MeshLambertMaterial({
  color: '#00723f',
  flatShading: true
});

const whiteMat = new MeshLambertMaterial({
  color: 'white',
  flatShading: true
});

const hairMat = new MeshLambertMaterial({
  color: '#7c7f80',
  flatShading: true
});

const legsGapMat = new MeshLambertMaterial({
  color: '#141414',
  flatShading: true
});

const shoesMat = new MeshLambertMaterial({
  color: '#585858',
  flatShading: true
});

// Head
const head = new Mesh(new BoxGeometry(300, 350, 280), skinMat);
head.position.set(0, 160, 400);

const hairBack = new Mesh(new BoxGeometry(310, 140, 280), hairMat);
hairBack.position.set(0, 110, -10);

const hairFront = new Mesh(new BoxGeometry(310, 80, 30), hairMat);
hairFront.position.set(0, 140, 150);

const glassLeft = new Mesh(new BoxGeometry(100, 78, 10), whiteMat);
glassLeft.position.set(-80, 4, 160);

const glassRight = glassLeft.clone();
glassRight.position.set(80, 4, 160);

const glassMiddle = new Mesh(new BoxGeometry(40, 10, 10), blackMat);
glassMiddle.position.set(0, 5, 155);

const retinaLeft = new Mesh(new BoxGeometry(25, 25, 5), blackMat);
retinaLeft.position.set(-80, 5, 168);

const retinaRight = retinaLeft.clone();
retinaRight.position.set(80, 5, 168);

const beard = new Mesh(new BoxGeometry(140, 130, 10), hairMat);
beard.position.set(0, -140, 160);

const mouth = new Mesh(new BoxGeometry(90, 60, 50), skinMat);
mouth.position.set(0, -130, 155);

const lip = new Mesh(new BoxGeometry(40, 20, 50), blackMat);
lip.position.set(0, -120, 162);

head.add(hairBack);
head.add(hairFront);
head.add(glassMiddle);
head.add(glassLeft);
head.add(glassRight);
head.add(retinaLeft);
head.add(retinaRight);
head.add(beard);
head.add(mouth);
head.add(lip);

// Body
const body = new Mesh(new BoxGeometry(275, 250, 150), shirtMat);
body.position.set(0, -220, 400);

const leftSuspender = new Mesh(new BoxGeometry(15, 255, 155), blackMat);
leftSuspender.position.set(-75, 0, 0);

const rightSuspender = leftSuspender.clone();
rightSuspender.position.set(75, 0, 0);

const armLeft = new Mesh(new BoxGeometry(60, 250, 100), shirtMat);
armLeft.position.set(-160, 0, 0);

const armRight = armLeft.clone();
armRight.position.set(160, 0, 0);

const handLeft = new Mesh(new BoxGeometry(60, 50, 50), skinMat);
handLeft.position.set(0, -150, 0);

const handRight = handLeft.clone();
handRight.position.set(0, -150, 0);

const legs = new Mesh(new BoxGeometry(200, 260, 100), blackMat);
legs.position.set(0, -200, -10);

const legsGap = new Mesh(new BoxGeometry(10, 130, 5), legsGapMat);
legsGap.position.set(0, -280, 38);

const shoes = new Mesh(new BoxGeometry(205, 50, 175), shoesMat);
shoes.position.set(0, -350, 25);

armLeft.add(handLeft);
armRight.add(handRight);

armLeft.name = 'upHand';

body.add(rightSuspender);
body.add(leftSuspender);
body.add(armLeft);
body.add(armRight);
body.add(legs);
body.add(legsGap);
body.add(shoes);

class OldMan extends Player {
  constructor(position) {
    super('OldMan', head.clone(), body.clone(), position);
  }

  pick() {
    super.pick();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = Math.PI;
    hand.rotation.z = 100;
    hand.position.x = -190;
    hand.position.y = 150;
  }

  reset() {
    super.reset();
    const hand = this.body.getObjectByName('upHand');
    hand.rotation.x = 0;
    hand.rotation.z = 0;
    hand.position.x = -160;
    hand.position.y = 0;
  }
}
