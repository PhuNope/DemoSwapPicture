import { _decorator, Button, Component, EventTouch, instantiate, Node, Prefab, Size, size, tween, UITransform, Vec2, Vec3, Event, Animation, sys } from 'cc';
import { Piece } from './Piece';
import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

const SizeGround = { col: 3, row: 3 };

@ccclass('GameController')
export class GameController extends Component {
    @property(Prefab)
    piecePrefab: Prefab = null;

    @property(Node)
    hintPic: Node = null;

    @property(Button)
    btnDownload: Button = null;

    @property(Node)
    playGround: Node = null;

    gridData: Node[][] = [];

    _isMoving: boolean = false;

    start() {
        this.initPieces();
    }

    initPieces() {
        let pieceWidth = this.playGround.getComponent(UITransform).contentSize.width / SizeGround.col;
        let pieceHeight = this.playGround.getComponent(UITransform).contentSize.height / SizeGround.row;

        for (let col = 0; col < SizeGround.col; col++) {
            this.gridData[col] = [];
            for (let row = 0; row < SizeGround.row; row++) {
                let piece = instantiate(this.piecePrefab);
                this.playGround.addChild(piece);

                piece.getComponent(UITransform).setContentSize(new Size(pieceWidth, pieceHeight));

                piece.position = new Vec3(pieceWidth * col, pieceHeight * row, 0);

                piece.getComponent(Piece)._correctPosition = new Vec2(col, row);

                piece.getComponent(Piece).setPicInit();

                piece.on(Node.EventType.TOUCH_END, this.onTouchEndPiece, this);

                this.gridData[col].push(piece);
            }
        }

        this.gridData.at(-1).at(-1).getComponent(Piece)._isBlank = true;
        this.gridData.at(-1).at(-1).getComponent(Piece).upDateBlank();

        this.gridData = this.shuffleArray2D(this.gridData);

        this.gridData.map((piecesRow) => {
            piecesRow.map((piece) => {
                piece.getComponent(Piece).setPosByCurrentPos();
            });
        });
    }

    shuffleArray2D(array: Node[][]): Node[][] {
        const newArray = [...array];

        // for (let i = newArray.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        // }

        // newArray.map((piecesRow, indexCol) => {
        //     piecesRow.map((piece, indexRow) => {
        //         piece.getComponent(Piece)._currentPosition = new Vec2(indexCol, indexRow);
        //     });
        // });

        // if (this.checkWin(newArray)) this.shuffleArray2D(newArray);

        // return newArray;

        for (let index = 0; index < 10; index++) {
            // Chọn ngẫu nhiên một vị trí trong ma trận
            const row: number = Math.floor(Math.random() * 3);
            const col: number = Math.floor(Math.random() * 3);

            // Kiểm tra và lấy danh sách vị trí lân cận
            const neighbors: [number, number][] = [];
            if (row > 0) {
                neighbors.push([row - 1, col]);  // Vị trí trên
            }
            if (row < 2) {
                neighbors.push([row + 1, col]);  // Vị trí dưới
            }
            if (col > 0) {
                neighbors.push([row, col - 1]);  // Vị trí trái
            }
            if (col < 2) {
                neighbors.push([row, col + 1]);  // Vị trí phải
            }

            // Nếu có ít nhất một vị trí lân cận
            if (neighbors.length > 0) {
                // Chọn ngẫu nhiên một vị trí lân cận
                const randomNeighbor: [number, number] = neighbors[Math.floor(Math.random() * neighbors.length)];
                const [newRow, newCol] = randomNeighbor;

                // Hoán đổi giá trị của hai vị trí
                const temp = newArray[row][col];
                newArray[row][col] = newArray[newRow][newCol];
                newArray[newRow][newCol] = temp;
            }

            newArray.map((piecesRow, indexCol) => {
                piecesRow.map((piece, indexRow) => {
                    piece.getComponent(Piece)._currentPosition = new Vec2(indexCol, indexRow);
                });
            });
        }


        return newArray;
    }

    onTouchEndPiece(event: EventTouch) {
        if (this._isMoving) return;

        let piece = event.currentTarget as Node;

        if (piece.getComponent(Piece)._isBlank) {
            AudioController.instance.playAudio('WRONG');

            return;
        }

        if (!this.checkPieceCanMove(piece)) {
            AudioController.instance.playAudio('WRONG');
        }

    }

    checkPieceCanMove(piece: Node): boolean {
        let currentPos = piece.getComponent(Piece)._currentPosition;
        //up
        if (this.gridData[currentPos.x]?.[currentPos.y + 1]) {
            let check = this.gridData[currentPos.x][currentPos.y + 1];

            if (check.getComponent(Piece)._isBlank) {
                this.swapPiece(piece, check, "up");
                return true;
            }
        }
        //down
        if (this.gridData[currentPos.x]?.[currentPos.y - 1]) {
            let check = this.gridData[currentPos.x][currentPos.y - 1];
            if (check.getComponent(Piece)._isBlank) {
                this.swapPiece(piece, check, "down");
                return true;
            }
        }
        //left
        if (this.gridData[currentPos.x - 1]?.[currentPos.y]) {
            let check = this.gridData[currentPos.x - 1][currentPos.y];
            if (check.getComponent(Piece)._isBlank) {
                this.swapPiece(piece, check, "left");
                return true;
            }
        }
        //right
        if (this.gridData[currentPos.x + 1]?.[currentPos.y]) {
            let check = this.gridData[currentPos.x + 1][currentPos.y];
            if (check.getComponent(Piece)._isBlank) {
                this.swapPiece(piece, check, "right");
                return true;
            }
        }

        return false;
    }

    swapPiece(piece: Node, pieceBlank: Node, typeSwap: "up" | "down" | "left" | "right") {
        this._isMoving = true;

        AudioController.instance.playAudio('SLIDE');

        tween(piece)
            .to(0.3, {
                position: pieceBlank.position
            })
            .call(() => {
                if (typeSwap == 'up') {
                    piece.getComponent(Piece)._currentPosition = piece.getComponent(Piece)._currentPosition.add2f(0, 1);
                    pieceBlank.getComponent(Piece)._currentPosition = pieceBlank.getComponent(Piece)._currentPosition.add2f(0, -1);
                }
                if (typeSwap == 'down') {
                    piece.getComponent(Piece)._currentPosition = piece.getComponent(Piece)._currentPosition.add2f(0, -1);
                    pieceBlank.getComponent(Piece)._currentPosition = pieceBlank.getComponent(Piece)._currentPosition.add2f(0, 1);
                }
                if (typeSwap == 'left') {
                    piece.getComponent(Piece)._currentPosition = piece.getComponent(Piece)._currentPosition.add2f(-1, 0);
                    pieceBlank.getComponent(Piece)._currentPosition = pieceBlank.getComponent(Piece)._currentPosition.add2f(1, 0);
                }
                if (typeSwap == 'right') {
                    piece.getComponent(Piece)._currentPosition = piece.getComponent(Piece)._currentPosition.add2f(1, 0);
                    pieceBlank.getComponent(Piece)._currentPosition = pieceBlank.getComponent(Piece)._currentPosition.add2f(-1, 0);
                }

                this.gridData[piece.getComponent(Piece)._currentPosition.x][piece.getComponent(Piece)._currentPosition.y] = piece;
                this.gridData[pieceBlank.getComponent(Piece)._currentPosition.x][pieceBlank.getComponent(Piece)._currentPosition.y] = pieceBlank;

                pieceBlank.getComponent(Piece).setPosByCurrentPos();

                if (!this.checkWin(this.gridData)) {
                    this._isMoving = false;
                } else {
                    this.showWin();
                }
            })
            .start();
    }

    checkWin(gridData: Node[][]): boolean {
        for (let col = 0; col < SizeGround.col; col++) {
            for (let row = 0; row < SizeGround.row; row++) {
                let correctPos = gridData[col][row].getComponent(Piece)._correctPosition;
                if (col != correctPos.x || row != correctPos.y) return false;
            }
        }

        return true;
    }

    showWin() {
        this.gridData.map((row) => {
            row.map((piece) => {
                piece.getComponent(Piece)._isBlank = false;
                piece.getComponent(Piece).upDateBlank();
            });
        });

        this.btnDownload.node.active = true;
    }

    onButtonHint() {
        AudioController.instance.playAudio('BUTTON');

        this.hintPic.getComponent(Animation).play("hint");
    }

    onButtonDownLoad() {
        AudioController.instance.playAudio('BUTTON');

        let url = "https://play.google.com/";
        if (sys.os == sys.OS.IOS) {
            url = "https://www.apple.com/vn/app-store/";
        }
        window.open(url, "_blank");
    }

    update(deltaTime: number) {

    }
}

