'use strict';

(() => {
  class GBOARD{
    constructor() {
      // 要素を取得
      this.containerLine = document.getElementById('container-line');
      this.containerTile = document.getElementById('container-tile');
      this.getTileNumText0 = document.getElementById('getTileNumText0');
      this.getTileNumText1 = document.getElementById('getTileNumText1');
      this.normalModeText = document.getElementById('normalModeText');
      this.waitButton = document.getElementById('waitButton');
      this.modeChangeButton = document.getElementById('modeChangeButton');
      this.editModeText = document.getElementById('editModeText');
      this.undoButton = document.getElementById('undoButton');
      this.redoButton = document.getElementById('redoButton');
      
      this.TILE_SIZE = 5;
      this.DOT_INTERVAL = 80;
      this.DOT_SIZE = 20;
      this.LINE_WIDTH = 15;
      this.colorName = ["blue", "red"];
      
      this.defaultLineOpacity = 0.04;
      this.defaultTileOpacity = 0.01;
      this.drawLineOpacity = 0.3;
      this.drawTileOpacity = 0.8;
      this.notPlyOpacity = 0.4;
      
      // 初期設定 

      this.ply = 0; // 0: first player, 1: second player
      this.mode = 0; // 0: normal mode, 1: edit mode
      this.getTileNum0 = 0;
      this.getTileNum1 = 0;

      this.getTileNumText0.innerText = "first player: 0";
      this.getTileNumText1.innerText = "second player: 0";

      this.normalModeText.style.opacity = 1;
      this.waitButton.disabled = false;
      this.modeChangeButton.innerText = "normal → edit";
      this.editModeText.style.opacity = 0.3;
      this.undoButton.disabled = true;
      this.redoButton.disabled = true;

      this.Hline = Array(this.TILE_SIZE * (this.TILE_SIZE + 1));
      for (let row = 0; row < (this.TILE_SIZE+1); row++) {
        for (let col = 0; col < this.TILE_SIZE; col++) {
          const e = document.getElementById('Hline' + this.int2alphabet(col) + row);
          this.defaultStyle(e, col, row, "Hline");
          this.Hline[this.sub2idx(col, row, "Hline")] = e;
        }
      }

      this.Vline = Array(this.TILE_SIZE * (this.TILE_SIZE + 1));
      for (let row = 0; row < this.TILE_SIZE; row++) {
        for (let col = 0; col < (this.TILE_SIZE+1); col++) {
          const e = document.getElementById('Vline' + this.int2alphabet(col) + row);
          this.defaultStyle(e, col, row, "Vline");
          this.Vline[this.sub2idx(col, row, "Vline")] = e;
        }
      }

      this.tile = Array(this.TILE_SIZE ** 2);
      for (let row = 0; row < this.TILE_SIZE; row++) {
        for (let col = 0; col < this.TILE_SIZE; col++) {
          const e = document.getElementById('tile' + this.int2alphabet(col) + row);
          this.defaultStyle(e, col, row, "tile");
          this.tile[this.sub2idx(col, row, "tile")] = e;
        }
      }

      // 線をクリックしたときの制御
      for (let idx=0; idx < this.Hline.length; idx++) {
        this.Hline[idx].addEventListener('click', () => {
          if (this.isExist(idx, "Hline")) {return;}
          this.draw(idx, "Hline")
          console.log(this.getLog(idx, "Hline"));
          const getTileNum = this.isAnyClosed(idx, "Hline");
          if (getTileNum) {
            this.addGetTileNum(getTileNum)
            return;
          };
          this.ply = this.inversion(this.ply);
          this.plyChange();
        });
      }

      for (let idx=0; idx < this.Vline.length; idx++) {
        this.Vline[idx].addEventListener('click', () => {
          if (this.isExist(idx, "Vline")) {return;}
          this.draw(idx, "Vline");
          console.log(this.getLog(idx, "Vline"));
          const getTileNum = this.isAnyClosed(idx, "Vline");
          if (getTileNum) {
            this.addGetTileNum(getTileNum)
            return;
          };
          this.ply = this.inversion(this.ply);
          this.plyChange();
        });
      }

      // Buttonをクリックしたときの制御

      this.waitButton.addEventListener('click', () => {

      });

      this.modeChangeButton.addEventListener('click', () => {
        if (this.mode === 0) { // editModeに変更
          console.log(this.mode);
          this.mode = this.inversion(this.mode);
          this.normalModeText.style.opacity = 0.3;
          this.waitButton.disabled = true;
          this.modeChangeButton.innerText = "edit → normal";
          this.editModeText.style.opacity = 1;
          this.undoButton.disabled = false;
          this.redoButton.disabled = false;
        } else if (this.mode === 1) { // normalModeに変更
          this.mode = this.inversion(this.mode);
          this.normalModeText.style.opacity = 1;
          this.waitButton.disabled = false;
          this.modeChangeButton.innerText = "normal → edit";
          this.editModeText.style.opacity = 0.3;
          this.undoButton.disabled = true;
          this.redoButton.disabled = true;
        } else {
          console.log("error10");
        }
      });

      this.undoButton.addEventListener('click', () => {

      });

      this.redoButton.addEventListener('click', () => {

      });
    }

    getLog(idx, object) {
      let col;
      let row;
      [col, row] = this.idx2sub(idx, object);
      if (object === "Hline") {
        return this.ply+"h"+this.int2alphabet(col)+(row+1);
      } else if (object === "Vline") {
        return this.ply+"v"+this.int2alphabet(col)+(row+1);
      } else {
        console.log("error8");
      }
    }

    plyChange() {
      if (this.ply === 0) {
        this.getTileNumText0.style.fontWeight = "bold";
        this.getTileNumText0.style.opacity = 1;
        this.getTileNumText1.style.fontWeight = "normal";
        this.getTileNumText1.style.opacity = this.notPlyOpacity;
      } else if (this.ply === 1) {
        this.getTileNumText1.style.fontWeight = "bold";
        this.getTileNumText1.style.opacity = 1;
        this.getTileNumText0.style.fontWeight = "normal";
        this.getTileNumText0.style.opacity = this.notPlyOpacity;
      } else {
        console.log("error9");
      }
    }

    addGetTileNum(getTileNum) {
      if (this.ply === 0) {
        this.getTileNum0 += getTileNum;
        this.getTileNumText0.innerText = "first player: " + this.getTileNum0;
      } else if (this.ply === 1) {
        this.getTileNum1 += getTileNum;
        this.getTileNumText1.innerText = "second player: " + this.getTileNum1;
      }
    }

    isAnyClosed(idx, object) { // 囲んだ数を返す、囲まれたタイルは色を付ける
      let col;
      let row;
      let getTileNum = 0;
      if (object === "Hline") {
        [col, row] = this.idx2sub(idx, "Hline");
        if (row === 0) { // 最下線
          if (this.isClosed(col, row, "U")) {
          this.draw(this.sub2idx(col, row, "tile"), "tile")
          getTileNum ++
          }
        }
        else if (row === this.TILE_SIZE) { // 最上線
          if (this.isClosed(col, row, "D")) {
            this.draw(this.sub2idx(col, row-1, "tile"), "tile")
            getTileNum ++;
          }
        } else {
          if (this.isClosed(col, row, "U")) {
            this.draw(this.sub2idx(col, row, "tile"), "tile")
            getTileNum ++;
          }
          if (this.isClosed(col, row, "D")) {
            this.draw(this.sub2idx(col, row-1, "tile"), "tile")
            getTileNum ++;
          }

        }
      } else if (object === "Vline") {
        [col, row] = this.idx2sub(idx, "Vline");
        if (col === this.TILE_SIZE) { // 最右線 
          if (this.isClosed(col, row, "L")) {
            this.draw(this.sub2idx(col-1, row, "tile"), "tile")
            getTileNum ++;
          }
        } else if (col === 0) { // 最左線
          if (this.isClosed(col, row, "R")) {
            this.draw(this.sub2idx(col, row, "tile"), "tile")
            getTileNum ++;
          }
        } else {
          if (this.isClosed(col, row, "L")) {
            this.draw(this.sub2idx(col-1, row, "tile"), "tile")
            getTileNum ++;
          }
          if (this.isClosed(col, row, "R")) {
            this.draw(this.sub2idx(col, row, "tile"), "tile")
            getTileNum ++
          }
        }
      }
      return getTileNum;
    }

    isClosed(col, row, direction) {
      if (direction == "U") {
        return ![
          this.Hline[this.sub2idx(col, row+1, "Hline")].style.backgroundColor,
          this.Vline[this.sub2idx(col, row, "Vline")].style.backgroundColor,
          this.Vline[this.sub2idx(col+1, row, "Vline")].style.backgroundColor,
        ].includes("black");
      } else if (direction == "D") {
        return ![
          this.Hline[this.sub2idx(col, row-1, "Hline")].style.backgroundColor,
          this.Vline[this.sub2idx(col, row-1, "Vline")].style.backgroundColor,
          this.Vline[this.sub2idx(col+1, row-1, "Vline")].style.backgroundColor,
        ].includes("black");
      } else if (direction == "L") {
        return ![
          this.Vline[this.sub2idx(col-1, row, "Vline")].style.backgroundColor,
          this.Hline[this.sub2idx(col-1, row, "Hline")].style.backgroundColor,
          this.Hline[this.sub2idx(col-1, row+1, "Hline")].style.backgroundColor,
        ].includes("black");
      } else if (direction == "R") {
        return ![
          this.Vline[this.sub2idx(col+1, row, "Vline")].style.backgroundColor,
          this.Hline[this.sub2idx(col, row, "Hline")].style.backgroundColor,
          this.Hline[this.sub2idx(col, row+1, "Hline")].style.backgroundColor,
        ].includes("black");
      } else {
        console.log("error6");
      }
    }

    sub2idx(col, row, object) {
      if (object === "Hline") {
        return row * this.TILE_SIZE + col;
      } else if (object === "Vline") {
        return row * (this.TILE_SIZE+1) + col;
      } else if (object === "tile") {
        return row * this.TILE_SIZE + col;
      } else {
        console.log("error7");
      }
    }

    idx2sub(idx, object) {
      if (object === "Hline") {
        return [idx % this.TILE_SIZE, Math.floor(idx / this.TILE_SIZE)];
      } else if (object === "Vline") {
        return [idx % (this.TILE_SIZE+1), Math.floor(idx / (this.TILE_SIZE+1))];
      } else if (object === "tile") {
        return [idx % this.TILE_SIZE, Math.floor(idx / this.TILE_SIZE)];
      } else {
        console.log("error5");
      }
    }

    defaultStyle(e, col, row, object) {
      e.style.backgroundColor = "black";
      if (object === "Hline") {
        e.style.left = col * this.DOT_INTERVAL + this.DOT_INTERVAL/2 - this.LINE_WIDTH/2 + "px";
        e.style.top = (this.TILE_SIZE- row) * this.DOT_INTERVAL + this.DOT_INTERVAL/2 - this.LINE_WIDTH/2 + "px";
        e.style.opacity = this.defaultLineOpacity;
      } else if (object === "Vline") {
        e.style.left = col * this.DOT_INTERVAL + this.DOT_INTERVAL/2 - this.LINE_WIDTH/2 + "px";
        e.style.top = (this.TILE_SIZE - row - 1) * this.DOT_INTERVAL + this.DOT_INTERVAL/2 - this.LINE_WIDTH/2 + "px";
        e.style.opacity = this.defaultLineOpacity;
      } else if (object === "tile") {
        e.style.left = col * this.DOT_INTERVAL + this.DOT_INTERVAL/2 + this.LINE_WIDTH/2 + "px";
        e.style.top = (this.TILE_SIZE - row - 1) * this.DOT_INTERVAL + this.DOT_INTERVAL/2 + this.LINE_WIDTH/2 + "px";
        e.style.opacity = this.defaultTileOpacity;
      } else {
        console.log("error4");
      }
    }

    draw(idx, object) {
      if (object === "Hline") {
        this.Hline[idx].style.opacity = this.drawLineOpacity;
        if (this.ply === 0) {
          this.Hline[idx].style.backgroundColor = "blue";
        } else {
          this.Hline[idx].style.backgroundColor = "red";
        }
      } else if (object === "Vline") {
        this.Vline[idx].style.opacity = this.drawLineOpacity;
        if (this.ply === 0) {
          this.Vline[idx].style.backgroundColor = "blue";
        } else {
          this.Vline[idx].style.backgroundColor = "red";
        }
      } else if (object === "tile"){
        this.tile[idx].style.opacity = this.drawTileOpacity;
        if (this.ply === 0) {
          this.tile[idx].style.backgroundColor = "blue";
        } else {
          this.tile[idx].style.backgroundColor = "red";
        }
      } else {
        console.log("error2")
      }

    }

    isExist(idx, object) {
      if (object === "Hline") {
        return this.Hline[idx].style.backgroundColor !== "black";
      } else if (object === "Vline") {
        return this.Vline[idx].style.backgroundColor !== "black";
      } else {
        console.log("error3");
      }
    }

    int2alphabet(int) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return alphabet[int];
    }

    inversion(bool) {
      if (bool === 1) {
        return 0;
      } else if (bool === 0) {
        return 1;
      } else {
        console.log("error1")
      }
    }
    
  }

  const canvas = document.querySelector('canvas');

  if (typeof canvas.getContext === 'undifined') {
    return;
  }

  new GBOARD(canvas);

})();


