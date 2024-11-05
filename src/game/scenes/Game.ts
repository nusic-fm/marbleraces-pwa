import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    console.log("Game Scene...");
  }
  update(time: number, delta: number): void {
    //
  }
}
