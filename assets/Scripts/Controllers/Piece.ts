import { _decorator, Component, Node, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Piece')
export class Piece extends Component {

    /**
     * col x row
     */
    _correctPosition: Vec2;

    /**
     * col x row
     */
    _currentPosition: Vec2;

    _isBlank = false;

    start() {

    }

    setPicInit() {
        let contentSize = this.node.getComponent(UITransform).contentSize;
        this.node.getChildByName("Pic").position = new Vec3(-contentSize.width * this._correctPosition.x, -contentSize.height * this._correctPosition.y, 0);
    }

    upDateBlank() {
        if (this._isBlank) {
            this.node.getChildByName("Pic").active = false;
        }
        else {
            this.node.getChildByName("Pic").active = true;
        }
    }

    setPosByCurrentPos() {
        let contentSize = this.node.getComponent(UITransform).contentSize;
        this.node.position = new Vec3(contentSize.width * this._currentPosition.x, contentSize.height * this._currentPosition.y, 0);
    }

    update(deltaTime: number) {

    }
}

