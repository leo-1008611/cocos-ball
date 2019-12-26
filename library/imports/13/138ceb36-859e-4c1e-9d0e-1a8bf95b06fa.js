"use strict";
cc._RF.push(module, '138ces2hZ5MHp0OGov5Wwb6', 'Star');
// scripts/Star.js

"use strict";

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
        // 星星和主角之间的距离小于 这个数值 时 触发事件  完成收集
        pickRadius: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},


    // 实例化对象池时， 自动调用 reuse 方法
    reuse: function reuse(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },
    unuse: function unuse() {
        // 因为回收时不执行任何操作，所以该方法可以不写
    },


    getPlayerDistance: function getPlayerDistance() {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间的距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function onPicked() {
        // 当星星被收集时，调用Game脚本中的接口，生成一个新的星星
        // this.game.spawnNewStar();
        // 然后销毁当前星星节点
        // this.node.destroy();
        var pos = this.node.getPosition();
        // 调用 Game 脚本的得分方法
        this.game.gainScore(pos);
        // 回收 对象池 内的star对象 生成新的星星
        this.game.despawnStar(this.node);
    },

    update: function update(dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        // console.log(this.getPlayerDistance(), this.pickRadius)
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
});

cc._RF.pop();