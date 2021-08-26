import { PositionInterface } from "../inerfaces";

function distance(from: PositionInterface, to: PositionInterface) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
}

function vector(from: PositionInterface, to: PositionInterface) {
    return {
        x: to.x - from.x,
        y: to.y - from.y
    }
}

function vectorAngle(from: PositionInterface, to: PositionInterface) {
    const vec = vector(from, to);
    let addPI = false;
    const rootVector: PositionInterface = {
        x: 1,
        y: 0
    }
    if (vec.x < 0 && vec.y < 0) {
        vec.x = -vec.x;
        vec.y = -vec.y;
        addPI = true;
    }
    if (vec.x > 0 && vec.y < 0) {
        vec.x = -vec.x;
        vec.y = -vec.y;
        addPI = true;
    }
    const cosin =
        ((vec.x * rootVector.x) + (vec.y * rootVector.y)) /
        (Math.sqrt(((Math.pow(vec.x, 2) + Math.pow(vec.y, 2))) * Math.sqrt(Math.pow(rootVector.x, 2) + Math.pow(rootVector.y, 2))));
    let angle = Math.acos(cosin);
    if (addPI) {
        angle += Math.PI;
    }
    return angle;
}

function move(object: Phaser.Physics.Matter.Sprite, from: PositionInterface, to: PositionInterface, speed: number, isStop: boolean, callback?: Function) {
    if (isStop) {
        return;
    }
    if (typeof object == 'undefined') {
        isStop = true;
        return;
    }
    if (from.x == to.x && from.y == from.y) {
        return;
    }

    const angle = vectorAngle(from, to);
    const dx = Math.cos(angle) * speed / 60.0;
    const dy = Math.sin(angle) * speed / 60.0;
    const distanceDelta = Math.sqrt(dx * dx + dy * dy);
    try {
        if (distance({
            x: object.x,
            y: object.y
        }, to) <= distanceDelta + 1) {
            object.setPosition(to.x, to.y);
            object.setPosition(to.x, to.y);
            isStop = true;
            if (callback) {
                callback();
            }
            return;
        }

        object.x += dx;
        object.y += dy;
    }
    catch (e) {
        isStop = true;
    }
}

export {
    distance,
    vector,
    vectorAngle,
    move
}