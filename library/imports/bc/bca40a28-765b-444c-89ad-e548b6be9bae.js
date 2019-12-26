"use strict";
cc._RF.push(module, 'bca40oodltETImt5Ui2vpuu', 'ScoreAnim');
// scripts/ScoreAnim.js

"use strict";

cc.Class({
    extends: cc.Component,

    reuse: function reuse(game) {
        this.game = game;
    },
    despawn: function despawn() {
        this.game.despawnAnimRoot();
    }
});

cc._RF.pop();