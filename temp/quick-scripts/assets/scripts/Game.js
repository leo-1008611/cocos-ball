(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '963caIgFwtKb79Q4hWXop42', 'Game', __filename);
// scripts/Game.js

'use strict';

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角的行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // 游戏开始按钮节点
        btnNode: {
            default: null,
            type: cc.Node
        },
        // 游戏结束 label 节点
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        // score label 得分引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 得分动画
        animRootPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {
        // 获取地面的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 停止update以及其他计时器
        this.enabled = false;
        // 生成一个新的星星
        // this.spawnNewStar();
        // 初始化得分
        // this.score = 0
        // currentStar 存储新生成的星星对象 currentStarX用于存储它的x坐标
        this.currentStar = null;
        this.currentAnimRoot = null;
        // 对象池实例
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreAnim');
    },

    // 游戏开始
    onStartGame: function onStartGame() {
        // 生成星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 游戏开始
        this.enabled = true;
        // 设置显示隐藏 开始按钮 和 gameover
        this.btnNode.x = 3000;
        // 更新 主角 初始化位置 和 移动速度
        this.player.getComponent('Player').startMoveAt(cc.v2(0, this.groundY));
        // gameOver节点
        this.gameOverNode.active = false;
    },
    // 游戏结束
    gameOver: function gameOver() {
        this.currentStar.destroy(); // 游戏结束时 销毁屏幕上的星星
        this.gameOverNode.active = true;
        this.btnNode.x = 0;
        this.player.getComponent('Player').enabled = false;
        this.player.stopAllActions(); // 停止主角运动
        // cc.director.loadScene('game');
    },
    // 星星
    spawnNewStar: function spawnNewStar() {
        var newStar = null;
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this);
        } else {
            // instantiate 克隆指定的任意对象或Prefab节点
            newStar = cc.instantiate(this.starPrefab);
            // 将game 注入到 star 脚本中
            newStar.getComponent('Star').reuse(this);
        }
        // 将新增的节点添加到 Canvas 节点下面
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        this.node.addChild(newStar);
        // 在星星组件上暂存 Game 对象的引用 便于 写 碰撞
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

        this.currentStar = newStar;
    },

    // 生成动画
    spawnAnimRoot: function spawnAnimRoot() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get(this);
        } else {
            fx = cc.instantiate(this.animRootPrefab);
            fx.getComponent('ScoreAnim').reuse(this);
        }
        return fx;
    },
    gainScore: function gainScore(pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放特效
        this.currentAnimRoot = this.spawnAnimRoot();
        this.node.addChild(this.currentAnimRoot);
        this.currentAnimRoot.setPosition(pos);
        this.currentAnimRoot.getComponent(cc.Animation).play('score_pop');
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    // 销毁 对象池 star
    despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },


    // 销毁 对象池 score 得分
    despawnAnimRoot: function despawnAnimRoot() {
        this.scorePool.put(this.currentAnimRoot);
    },


    // 随机位置
    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的Y坐标
        // getComponent 方法可以得到该节点上挂载的组件引用
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 的 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    },
    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        