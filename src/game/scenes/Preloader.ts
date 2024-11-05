import Phaser from "phaser";
import { IGameDataParams } from "../../models/Phaser";

export type GameVoiceInfo = {
  id: string;
  name: string;
  avatar: string;
};
export const ObstacleNames = [
  "shiba",
  "appalled_girlfriend",
  "distracted_boyfriend",
  "harold",
  "meme_man",
  "pedro",
  "roll_safe",
  "wojack",
];

export default class Preloader extends Phaser.Scene {
  public params: IGameDataParams | null = null;
  constructor() {
    super("preloader");
  }

  init(data: IGameDataParams) {
    this.params = data;
  }

  // Create an off-screen canvas
  // canvas = document.createElement("canvas");
  // resize(img: HTMLImageElement) {
  //   const targetWidth = 46;
  //   const targetHeight = 46;
  //   const canvas = this.canvas;
  //   const ctx = canvas.getContext("2d");

  //   // Set initial size to original image size
  //   let width = img.width;
  //   let height = img.height;
  //   if (!ctx) return;
  //   // Resample in steps
  //   while (width > 2 * targetWidth && height > 2 * targetHeight) {
  //     width = Math.floor(width / 2);
  //     height = Math.floor(height / 2);

  //     // Resize the canvas to the new size
  //     canvas.width = width;
  //     canvas.height = height;

  //     // Draw the image onto the canvas
  //     ctx.drawImage(img, 0, 0, width, height);
  //   }

  //   // Now, do the final resize to the target dimensions
  //   canvas.width = targetWidth;
  //   canvas.height = targetHeight;

  //   // Set high quality for the final resize
  //   ctx.imageSmoothingEnabled = true;
  //   ctx.imageSmoothingQuality = "high";

  //   // Draw the image at the final size
  //   ctx.drawImage(img, 0, 0, 46, 46);

  //   // canvas.toBlob((blob) => {
  //   //     if (blob) {
  //   //         const blobUrl = URL.createObjectURL(blob);
  //   //         const img = new Image();
  //   //         img.src = blobUrl;
  //   //         img.crossOrigin = "anonymous";
  //   //         const texture = this.textures.addImage("resizedImage", img);
  //   //         this.add.image(100, 100, "resizedImage").setOrigin(0.5, 0.5);
  //   //     }
  //   // });

  //   // Pass the resized image data to the callback
  //   return canvas.toDataURL();
  // }
  preload() {
    // if (this.params) {
    //   this.load.image("background", this.params.backgroundPath);
    // }
  }

  create() {
    if (this.params) this.scene.start("game", this.params);
  }
}
