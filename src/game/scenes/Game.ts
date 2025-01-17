import Phaser from "phaser";
import {
  getToneCurrentTime,
  marbleRaceOnlyInstrument,
  marbleRacePlayVocals,
} from "../../hooks/useTonejs";
import _ from "lodash";
import { GameVoiceInfo, ObstacleNames } from "./Preloader";
import { BodyType } from "matter";
import {
  duplicateArrayElemToN,
  getBeatsArray,
  createBeatsGroupWithInterval,
} from "../../helpers";
import { IGameDataParams } from "../../models/Phaser";
import { EventBus } from "../EventBus";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.throttledUpdate = _.throttle(this.throttledUpdate.bind(this), 10); // Throttle interval in milliseconds
  }
  public sky: Phaser.Physics.Matter.Image | undefined;
  public marbles: MatterJS.BodyType[] = [];
  public marblesImages: Phaser.GameObjects.Image[] = [];
  public marblesMasks: Phaser.GameObjects.Graphics[] = [];
  public isInstrumentPlaying: boolean = false;
  public autoScroll = true;
  public prevVoiceIdx = -1;
  public leftRotatableStars: Phaser.Physics.Matter.Sprite[] = [];
  public rightRotatableStars: Phaser.Physics.Matter.Sprite[] = [];
  public reduceSizeScreenOffset: number[] = [];
  public increaseSizeScreenOffset: number[] = [];
  public currentMarblesSizeIndices: { [key: string]: number } = {};
  public heightReducedIndices: number[] = [];
  public upDownMotionElems: {
    matter: Phaser.Physics.Matter.Image;
    startX: number;
    startY: number;
    maxTop: number;
    maxBottom: number;
    moveSpeed: number;
    direction: "left" | "right";
  }[] = [];
  public labels: Phaser.GameObjects.Text[] = [];
  public motionTimeForUpDownWard = 0;
  public crossRightRotation: Phaser.Physics.Matter.Sprite[] = [];
  public crossLeftRotation: Phaser.Physics.Matter.Sprite[] = [];
  public horizontalCrossRightRotation: Phaser.Physics.Matter.Sprite[] = [];
  public horizontalCrossLeftRotation: Phaser.Physics.Matter.Sprite[] = [];
  // public trails: { x: number; y: number }[][] = [];
  // public trailGraphics: Phaser.GameObjects.Graphics[] = [];
  // public trailsGroup: Phaser.GameObjects.Group[] = [];
  public trailLength: number = 0;
  public trailPoints: {
    x: number;
    y: number;
    angle: number;
    // size: number;
  }[][] = [];
  // public shape: any;
  public voices: GameVoiceInfo[] = [];
  public coverDocId: string = "";
  public musicStartOffset: number = 0;
  public selectedTracks: string[] = [];
  public noOfRaceTracks: number = 0;
  largeCircle: Phaser.Physics.Matter.Image | undefined;
  isRotating = true;
  baseAngle = 0;
  centerX = 0;
  centerY = 0;
  radius = 100;
  angleIncrement = (2 * Math.PI) / 5;
  countdownText: Phaser.GameObjects.Text | undefined;
  finishLineOffset: number = 0;
  marbleRadius = 23;
  background: Phaser.GameObjects.TileSprite | undefined;
  enableMotion: boolean = false;
  marbleTrailParticles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  isGameOver: boolean = false;
  winnerIdx: number = -1;
  isResultShown = false;
  damageMultipliyer: number = 1;
  level1Hammer: Phaser.GameObjects.Sprite | undefined;
  level2Hammer: Phaser.GameObjects.Sprite | undefined;
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  dpr: number = window.devicePixelRatio || 2;
  trailConfig = {
    speed: { min: -50, max: 50 },
    scale: {
      start: this.dpr,
      end: this.dpr * 0.5,
    },
    blendMode: "ADD",
    lifespan: 400,
    alpha: 0.5,
  };
  showObstacles: boolean = false;
  showRythmicPads: boolean = false;
  initialGravity: number = 0;
  perfectTapTime: number = 0;
  goodTapTime: number = 0;

  init(data: IGameDataParams) {
    // Sort the voices randomly
    this.voices = data.voices;
    // .sort(() => Math.random() - 0.5);
    this.coverDocId = data.coverDocId;
    this.musicStartOffset = data.musicStartOffset;
    this.showRythmicPads = data.showRythmicPads || false;
    if (this.showRythmicPads) {
      this.allTapTimings = getBeatsArray(
        this.coverDocId,
        this.musicStartOffset
      );
      if (this.allTapTimings.length === 0) this.showRythmicPads = false;
      else {
        this.circleShouldFillInMs =
          (this.allTapTimings[1] - this.allTapTimings[0]) * 3 * 1000;
        this.perfectTapTime = this.circleShouldFillInMs / 3 / 1000;
        this.goodTapTime = this.circleShouldFillInMs / 2 / 1000;
        this.showTapTimings = createBeatsGroupWithInterval(
          this.allTapTimings,
          this.beatsGroupLength,
          4,
          12
        );
      }
    }
    this.noOfRaceTracks = data.noOfRaceTracks || 5;
    this.selectedTracks = duplicateArrayElemToN(
      data.selectedTracks,
      this.noOfRaceTracks
    );
    this.enableMotion = data.enableMotion;
    this.canvasWidth = data.width;
    this.marbleRadius = (22 / 414) * this.canvasWidth * this.dpr;
    if (data.height) this.canvasHeight = data.height;
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.trailConfig.scale.end = data.trailEndSize;
    this.trailConfig.lifespan = data.trailsLifeSpace;
    this.trailConfig.alpha = data.trailsOpacity;
    this.dpr = window.devicePixelRatio || 2;
    this.showObstacles = data.showObstacles || false;
    this.initialGravity = data.gravityY || 0;
  }

  throttledUpdate(index: number, switchOld: boolean = true) {
    this.prevVoiceIdx = index;
    // Logic that should be throttled
    marbleRacePlayVocals(this.coverDocId, this.voices[index].id);
  }

  renderWeapons() {
    this.level1Hammer = this.add
      .sprite(
        (350 / 414) * this.canvasWidth * this.dpr,
        (550 / 414) * this.canvasWidth * this.dpr,
        "hammer_1"
      )
      .setScale((0.1 / 414) * this.canvasWidth * this.dpr)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        this.damageMultipliyer = 1;
      });

    this.level2Hammer = this.add
      .sprite(
        (350 / 414) * this.canvasWidth * this.dpr,
        (630 / 414) * this.canvasWidth * this.dpr,
        "hammer_2"
      )
      .setScale((0.1 / 414) * this.canvasWidth * this.dpr)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        this.damageMultipliyer = 1.5;
      });
  }

  createTextureMask = (
    xOffset: number,
    yOffset: number,
    baseSprite: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image
  ) => {
    // Create the texture sprite
    const textureSprite = this.add.sprite(xOffset, yOffset, "textureImage");
    textureSprite.setScale(this.dpr);

    // Use the base sprite's texture as a mask for the texture sprite
    const mask = new Phaser.Display.Masks.BitmapMask(this, baseSprite);
    textureSprite.setMask(mask);

    // Optionally, hide the base sprite if you only want to show the texture
    baseSprite.setVisible(false);
  };

  createCrossScreen = (
    startOffset: number,
    canvasWidth: number,
    miniShapes: any
  ) => {
    // TODO: Scale the sprite
    startOffset += 151;
    const l1CrossLeft = this.matter.add.sprite(
      18 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l1CrossLeft.setScale(this.dpr);
    this.crossRightRotation.push(l1CrossLeft);
    const l1CrossRight = this.matter.add.sprite(
      canvasWidth - 18 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l1CrossRight.setScale(this.dpr);
    this.crossLeftRotation.push(l1CrossRight);
    startOffset += 200 * this.dpr;
    const l2CrossLeft = this.matter.add.sprite(
      126 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l2CrossLeft.setScale(this.dpr);
    this.crossLeftRotation.push(l2CrossLeft);
    const l2CrossRight = this.matter.add.sprite(
      canvasWidth - 126 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l2CrossRight.setScale(this.dpr);
    this.crossRightRotation.push(l2CrossRight);
    startOffset += 200 * this.dpr;
    const l3CrossLeft = this.matter.add.sprite(
      18 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l3CrossLeft.setScale(this.dpr);
    this.crossRightRotation.push(l3CrossLeft);
    const l3CrossRight = this.matter.add.sprite(
      canvasWidth - 18 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l3CrossRight.setScale(this.dpr);
    this.crossLeftRotation.push(l3CrossRight);
    startOffset += 200 * this.dpr;
    const l4CrossLeft = this.matter.add.sprite(
      126 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l4CrossLeft.setScale(this.dpr);
    this.crossLeftRotation.push(l4CrossLeft);
    const l4CrossRight = this.matter.add.sprite(
      canvasWidth - 126 * this.dpr,
      startOffset,
      "02_cross",
      undefined,
      {
        shape: miniShapes["02"],
        isStatic: true,
      }
    );
    l4CrossRight.setScale(this.dpr);
    this.crossRightRotation.push(l4CrossRight);

    return startOffset + 500 * this.dpr;
  };
  createSeesawScreen = (
    xOffset: number,
    startOffset: number,
    prodShapes: any,
    miniShapes: any,
    obstaclesShapes: any
  ) => {
    const baseSprite = this.matter.add
      .sprite(xOffset, startOffset, "prod_texture_loaded_06", undefined, {
        shape: prodShapes["06"],
        isStatic: true,
      })
      .setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    const yOffset = startOffset + baseSprite.height / 2;
    baseSprite.setPosition(xOffset, yOffset);
    const seesawX = xOffset - 2;
    // 132 for 414 width
    // 110 for 344 width
    // FOrumula (132/414)*width + 30
    const seesawContraintY = -(132 / 414) * this.canvasWidth;
    const seesawY = yOffset + seesawContraintY;
    const seesaw = this.matter.add
      .sprite(seesawX, seesawY, "06b", undefined, {
        shape: miniShapes["06b"],
        // isStatic: true,
      })
      .setScale(this.dpr);
    const contraint = this.matter.constraint.create({
      bodyA: seesaw.body as BodyType,
      bodyB: baseSprite.body as BodyType,
      pointA: { x: 0, y: 0 },
      pointB: {
        x: -2,
        y: seesawContraintY * this.dpr,
      },
      stiffness: 1,
      length: 0,
    });
    if (this.showObstacles) {
      const randomObstaclePosition = _.sample([
        [this.centerX, seesawY - 200],
        [this.centerX - 100, seesawY],
        [this.centerX + 100, seesawY],
        [this.centerX, seesawY + 200],
        [this.centerX - 100, seesawY + 400],
        [this.centerX + 100, seesawY + 400],
      ]);

      const randomObstacle = _.sample(ObstacleNames);
      if (randomObstaclePosition && randomObstacle) {
        const target = this.matter.add
          .sprite(
            randomObstaclePosition[0],
            randomObstaclePosition[1],
            `obstacle_${randomObstacle}`,
            undefined,
            {
              shape:
                obstaclesShapes[randomObstacle as keyof typeof obstaclesShapes],
              friction: 0,
              frictionAir: 0,
              frictionStatic: 0,
            }
          )
          .setScale((0.17 / 414) * this.canvasWidth * this.dpr);
        target.setInteractive();
        target.on("pointerdown", (e: any) => {
          this.handleDamage(target, e);
        });
      }
    }
    this.matter.world.add(contraint);
    this.createTextureMask(seesawX, seesawY, seesaw);
    this.createTextureMask(xOffset, yOffset, baseSprite);
    return startOffset + baseSprite.height * this.dpr;
  };
  createCircleBlockers = (
    xOffset: number,
    startOffset: number,
    prodShapes: any
  ) => {
    const yOffset = startOffset + 833 / 2;
    const baseSprite = this.matter.add
      .sprite(xOffset, yOffset, "prod_texture_loaded_21", undefined, {
        shape: prodShapes["21"],
        isStatic: true,
      })
      .setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    this.createTextureMask(xOffset, yOffset, baseSprite);
    return startOffset + baseSprite.height * this.dpr;
  };
  createStarRotations = (_startOffset: number, miniShapes: any) => {
    // TODO: Scale the sprite
    // Stars
    const barWidth = 0;
    let startOffset = _startOffset + 250;
    // this.matter.add.sprite(
    //     barWidth / 2,
    //     startOffset + 270,
    //     "bar",
    //     undefined,
    //     {
    //         shape: miniShapes["bar"],
    //         isStatic: true,
    //     }
    // );
    // this.matter.add.sprite(487, startOffset + 270, "bar", undefined, {
    //     shape: miniShapes["bar"],
    //     isStatic: true,
    // });

    // First Row
    this.leftRotatableStars.push(
      this.matter.add
        .sprite(
          ((115 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale((1 / 414) * this.canvasWidth * this.dpr)
        .setAngle(35)
    );

    this.rightRotatableStars.push(
      this.matter.add
        .sprite(
          ((305 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale((1 / 414) * this.canvasWidth * this.dpr)
    );
    // Second Row
    startOffset += 165 * this.dpr;
    this.rightRotatableStars.push(
      this.matter.add
        .sprite(
          ((10 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale((1 / 414) * this.canvasWidth * this.dpr)
        .setAngle(5)
    );
    this.rightRotatableStars.push(
      this.matter.add
        .sprite(
          ((206 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale((1 / 414) * this.canvasWidth * this.dpr)
      // .setAngle()
    );
    this.leftRotatableStars.push(
      this.matter.add
        .sprite(
          ((400 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(35)
    );
    // Third Row
    startOffset += 180 * this.dpr;
    this.leftRotatableStars.push(
      this.matter.add
        .sprite(
          ((115 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(30)
    );
    this.rightRotatableStars.push(
      this.matter.add
        .sprite(
          ((305 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(5)
    );
    // Fourth Row
    startOffset += 160 * this.dpr;
    this.rightRotatableStars.push(
      this.matter.add
        .sprite(
          ((10 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(8)
    );
    this.leftRotatableStars.push(
      this.matter.add
        .sprite(
          ((210 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(30)
    );
    this.leftRotatableStars.push(
      this.matter.add
        .sprite(
          ((400 / 414) * this.canvasWidth + barWidth) * this.dpr,
          startOffset,
          "mini_star",
          undefined,
          {
            shape: miniShapes["14"],
            isStatic: true,
          }
        )
        .setScale(this.dpr)
        .setAngle(35)
    );
    return startOffset + 500 * this.dpr;
  };

  createStaticTriangles = (
    xOffset: number,
    startOffset: number,
    prodShapes: any,
    obstaclesShapes: any
  ) => {
    const yOffset = startOffset + 833 / 2;
    const baseSprite = this.matter.add
      .sprite(xOffset, yOffset, "prod_texture_loaded_03", undefined, {
        shape: prodShapes["03"],
        isStatic: true,
      })
      .setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    this.createTextureMask(xOffset, yOffset, baseSprite);
    if (this.showObstacles) {
      const randomObstaclePosition = _.sample([
        [100, startOffset],
        [350, startOffset],
        [this.centerX, startOffset + 200],
        [100, startOffset + 400],
        [400, startOffset + 400],
      ]);

      const randomObstacle = _.sample(ObstacleNames);
      if (randomObstaclePosition && randomObstacle) {
        const target = this.matter.add.sprite(
          randomObstaclePosition[0],
          randomObstaclePosition[1],
          `obstacle_${randomObstacle}`,
          undefined,
          {
            shape:
              obstaclesShapes[randomObstacle as keyof typeof obstaclesShapes],
            // angle: 124,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
          }
        );
        target.setScale((0.17 / 414) * this.canvasWidth * this.dpr);
        target.setInteractive();
        target.on("pointerdown", (e: any) => {
          this.handleDamage(target, e);
        });
      }
    }
    return startOffset + baseSprite.height * this.dpr;
  };

  handleDamage(target: Phaser.Physics.Matter.Sprite, e: any) {
    // Logic for handling damage
    console.log("Damage dealt to the target!");
    if (this.damageMultipliyer) {
      target.setScale(target.scale / (1.1 * this.damageMultipliyer));
      const particleConfig = {
        speed: { min: -50, max: 50 },
        scale: { start: 0.01, end: 0.1 },
        blendMode: "ADD",
        // lifespan: 400,
        alpha: 0.5,
        particleBringToTop: true,
      };
      const particle = this.add.particles(
        e.worldX,
        e.worldY,
        "whack",
        particleConfig
      );
      // Add an event listener to destroy the emitter after the particles' lifespan
      this.time.delayedCall(
        200,
        () => {
          // emitter.stop();
          particle.destroy(); // Destroys the particle manager and emitter
        },
        [],
        this
      );
      // Play sound
      if (this.damageMultipliyer === 1)
        this.sound.play("low_whack", { volume: 0.5 });
      else this.sound.play("high_whack", { volume: 0.5 });
    }
    if (target.scale <= 0.08) {
      target.destroy();
    }

    // // Example: reduce health, show effects, etc.
    // target.health = (target.health || 100) - 10; // Example: reduce health by 10
    // console.log("Target health:", target.health);

    // if (target.health <= 0) {
    //     console.log("Target destroyed!");
    //     target.destroy(); // Destroy the target if health is 0
    // }
  }

  createReduceSizeSlider = (
    xOffset: number,
    startOffset: number,
    prodShapes: any
  ) => {
    this.reduceSizeScreenOffset.push(startOffset - 400);
    const yOffset = startOffset + 833 / 2;
    const baseSprite = this.matter.add
      .sprite(xOffset + 3.5, yOffset, "prod_texture_loaded_16", undefined, {
        shape: prodShapes["16"],
        isStatic: true,
      })
      .setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    // .setScale(this.cameras.main.width / 414);
    this.createTextureMask(xOffset, yOffset, baseSprite);
    startOffset += baseSprite.height * this.dpr;
    this.increaseSizeScreenOffset.push(startOffset);
    startOffset += 300;
    return startOffset;
  };
  createStopperSlider = (
    xOffset: number,
    startOffset: number,
    prodShapes: any
  ) => {
    // TODO: Scale the sprite
    const yOffset = startOffset + 833 / 2;
    const baseSprite = this.matter.add.sprite(
      xOffset - 4,
      yOffset,
      "prod_texture_loaded_11",
      undefined,
      {
        shape: prodShapes["11"],
        isStatic: true,
      }
    );
    // .setScale(this.cameras.main.width / 414);
    // Motion parts
    this.upDownMotionElems.push(
      {
        matter: this.matter.add
          .image(318, startOffset + 122, "left_block", undefined, {
            isStatic: true,
          })
          .setScale(0.18, 0.18),
        startX: 315,
        startY: startOffset + 122,
        maxTop: 1,
        maxBottom: 38,
        moveSpeed: 0.1,
        direction: "right",
      }
      // .setAngle(7.1)
    );
    this.upDownMotionElems.push(
      {
        matter: this.matter.add
          .image(102.8, startOffset + 275, "right_block", undefined, {
            isStatic: true,
          })
          .setScale(0.18, 0.18),
        startX: 102.8,
        startY: startOffset + 275,
        maxTop: 1,
        maxBottom: 28,
        moveSpeed: 0.2,
        direction: "left",
      }
      // .setAngle(7.1)
    );
    this.upDownMotionElems.push(
      {
        matter: this.matter.add
          .image(314, startOffset + 418, "left_block", undefined, {
            isStatic: true,
          })
          .setScale(0.18, 0.18),
        startX: 314,
        startY: startOffset + 418,
        maxTop: 15,
        maxBottom: -18,
        moveSpeed: 0.15,
        direction: "right",
      }
      // .setAngle(7.1)
    );
    this.upDownMotionElems.push(
      {
        matter: this.matter.add
          .image(102.8, startOffset + 568, "right_block", undefined, {
            isStatic: true,
          })
          .setScale(0.18, 0.18),
        startX: 102.8,
        startY: startOffset + 568,
        maxTop: 1,
        maxBottom: 28,
        moveSpeed: 0.18,
        direction: "left",
      }
      // .setAngle(7.1)
    );
    this.upDownMotionElems.push(
      {
        matter: this.matter.add
          .image(314, startOffset + 713, "left_block", undefined, {
            isStatic: true,
          })
          .setScale(0.18, 0.18),
        startX: 314,
        startY: startOffset + 713,
        maxTop: 1,
        maxBottom: 28,
        moveSpeed: 0.1,
        direction: "right",
      }
      // .setAngle(7.1)
    );
    //TODO for the right & left blocks
    this.upDownMotionElems
      .map((e) => e.matter)
      .map((image) => this.createTextureMask(image.x, image.y, image));
    this.createTextureMask(baseSprite.x, baseSprite.y, baseSprite);
    return startOffset + 842;
  };
  createStaticCircles = (
    xOffset: number,
    startOffset: number,
    prodShapes: any,
    obstaclesShapes: any
  ) => {
    const baseSprite = this.matter.add
      .sprite(xOffset, startOffset, "prod_texture_loaded_01", undefined, {
        shape: prodShapes["01"],
        isStatic: true,
      })
      .setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    const yOffset = startOffset + baseSprite.height / 2;
    baseSprite.setPosition(baseSprite.x, yOffset);
    this.createTextureMask(xOffset, yOffset, baseSprite);
    if (this.showObstacles) {
      const randomObstaclePosition = _.sample([
        [150, startOffset],
        [350, startOffset],
        [150, startOffset + 300],
        [this.centerX, startOffset + 200],
        [390, startOffset + 200],
        [150, startOffset + 400],
        [350, startOffset + 400],
        [this.centerX, startOffset + 600],
      ]);
      const randomObstacle = _.sample(ObstacleNames);
      if (randomObstaclePosition && randomObstacle) {
        const target = this.matter.add.sprite(
          randomObstaclePosition[0],
          randomObstaclePosition[1],
          `obstacle_${randomObstacle}`,
          undefined,
          {
            shape:
              obstaclesShapes[randomObstacle as keyof typeof obstaclesShapes],
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
          }
        );
        target.setScale((0.17 / 414) * this.canvasWidth * this.dpr);
        target.setInteractive();
        target.on("pointerdown", (e: any) => {
          this.handleDamage(target, e);
        });
      }
    }
    return startOffset + baseSprite.height * this.dpr;
  };
  createZigzagSlider = (
    xOffset: number,
    startOffset: number,
    prodShapes: any,
    obstaclesShapes: any
  ) => {
    const baseSprite = this.matter.add.sprite(
      xOffset,
      startOffset,
      "prod_texture_loaded_07",
      undefined,
      {
        shape: prodShapes["07"],
        isStatic: true,
      }
    );
    baseSprite.setPosition(baseSprite.x, startOffset + baseSprite.height / 2);
    baseSprite.setScale(this.dpr * (this.canvasWidth / (512 - 100)));
    this.createTextureMask(
      xOffset,
      startOffset + baseSprite.height / 2,
      baseSprite
    );
    if (this.showObstacles) {
      const randomObstaclePosition = _.sample([
        [140, startOffset],
        [350, startOffset],
        [150, startOffset + 200],
        [350, startOffset + 200],
        [150, startOffset + 400],
        [350, startOffset + 400],
      ]);
      const randomObstacle = _.sample(ObstacleNames);
      if (randomObstaclePosition && randomObstacle) {
        const target = this.matter.add
          .sprite(
            randomObstaclePosition[0],
            randomObstaclePosition[1],
            `obstacle_${randomObstacle}`,
            undefined,
            {
              shape:
                obstaclesShapes[randomObstacle as keyof typeof obstaclesShapes],
              // angle: 124,
              friction: 0,
              frictionAir: 0,
              frictionStatic: 0,
            }
          )
          .setScale((0.17 / 414) * this.canvasWidth * this.dpr);
        target.setInteractive();
        target.on("pointerdown", (e: any) => {
          this.handleDamage(target, e);
        });
      }
    }
    return startOffset + baseSprite.height * this.dpr;
  };
  createMarbles = (marbleRadius: number, miniShapes: any) => {
    this.largeCircle = this.matter.add.sprite(
      this.centerX,
      this.centerY - 100,
      "wheel",
      undefined,
      {
        shape: miniShapes["wheel"],
        isStatic: true,
        frictionStatic: 1,
        friction: 1,
      }
    );
    // For Testing
    // this.largeCircle.setScale(0.1);
    // this.isRotating = false;
    this.largeCircle.setScale(
      (this.canvasWidth / this.largeCircle.width) * this.dpr
    );
    const xOffsetValues = [
      this.centerX - 46,
      this.centerX + 23,
      this.centerX,
      this.centerX + 23,
      this.centerX + 46,
    ];
    this.voices.map((v, i) => {
      this.currentMarblesSizeIndices[i.toString()] = 0;
      // const angle = i * this.angleIncrement;
      // const x = this.centerX + this.radius * Math.cos(angle);
      // const y = this.centerY + this.radius * Math.sin(angle);
      const circleBody = this.matter.add.circle(
        xOffsetValues[i],
        this.centerY,
        marbleRadius,
        {
          restitution: 0.4,
          // density: 0.02,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
          label: v.id,
        }
      );
      this.marbles.push(circleBody);
      this.marbleTrailParticles.push(
        this.add.particles(0, 0, "trail", {
          ...this.trailConfig,
          follow: circleBody.position,
        })
      );

      // circleBody.emitter = emitter;
      // this.trailsGroup.push(this.add.group());
      // this.trailGraphics.push(this.add.graphics());
      // this.trailPoints.push([]);
      // // Create an image and attach it to the circle body
      const circleImage = this.add
        .image(circleBody.position.x, circleBody.position.y, `resized_${v.id}`)
        .setDepth(1);
      circleImage.setDisplaySize(marbleRadius * 2, marbleRadius * 2);
      circleImage.setOrigin(0.5, 0.5);
      // Circle mask
      const maskShape = this.make.graphics();
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(marbleRadius, marbleRadius, marbleRadius);
      const mask = maskShape.createGeometryMask();

      // Apply the mask to the image
      circleImage.setMask(mask);
      this.marblesMasks.push(maskShape);

      this.marblesImages.push(circleImage);
      // Create label for each circle
      let label = this.add.text(
        circleImage.x,
        circleImage.y - 560,
        this.voices[i].name,
        {
          fontSize: "32px",
          color: "#ffffff",
          stroke: "#000",
          strokeThickness: 4,
        }
      );
      label.setDepth(1);
      this.labels.push(label);
    });
    this.countdownText = this.add
      .text(this.centerX, this.centerY - 100, "3", {
        fontSize: `${64 * this.dpr}px`,
        color: "#ffffff",
      })
      .setOrigin(0.5);
  };
  createHorizontalCrosses = (
    canvasWidth: number,
    _startOffset: number,
    miniShapes: any
  ) => {
    this.reduceSizeScreenOffset.push(_startOffset - 300);
    let startOffset = _startOffset + 200;
    let leftOffset = 20;
    let rightOffset = canvasWidth - 20;
    new Array(5).fill("").map(() => {
      this.horizontalCrossRightRotation.push(
        this.matter.add
          .sprite(leftOffset, startOffset, "02_cross", undefined, {
            shape: miniShapes["02"],
            isStatic: true,
          })
          .setScale((0.8 / 414) * this.canvasWidth * this.dpr)
      );
      leftOffset += (80 / 414) * this.canvasWidth * this.dpr;
    });
    startOffset += (250 / 414) * this.canvasWidth * this.dpr;
    new Array(5).fill("").map(() => {
      this.horizontalCrossLeftRotation.push(
        this.matter.add
          .sprite(rightOffset, startOffset, "02_cross", undefined, {
            shape: miniShapes["02"],
            isStatic: true,
          })
          .setScale((0.8 / 414) * this.canvasWidth * this.dpr)
      );
      rightOffset -= (80 / 414) * this.canvasWidth * this.dpr;
    });
    leftOffset = 20;
    startOffset += (250 / 414) * this.canvasWidth * this.dpr;
    new Array(5).fill("").map(() => {
      this.horizontalCrossRightRotation.push(
        this.matter.add
          .sprite(leftOffset, startOffset, "02_cross", undefined, {
            shape: miniShapes["02"],
            isStatic: true,
          })
          .setScale((0.8 / 414) * this.canvasWidth * this.dpr)
      );
      leftOffset += (80 / 414) * this.canvasWidth * this.dpr;
    });
    rightOffset = canvasWidth - 20;
    startOffset += (250 / 414) * this.canvasWidth * this.dpr;
    new Array(5).fill("").map(() => {
      this.horizontalCrossLeftRotation.push(
        this.matter.add
          .sprite(rightOffset, startOffset, "02_cross", undefined, {
            shape: miniShapes["02"],
            isStatic: true,
          })
          .setScale((0.8 / 414) * this.canvasWidth * this.dpr)
      );
      rightOffset -= (80 / 414) * this.canvasWidth * this.dpr;
    });
    this.increaseSizeScreenOffset.push(startOffset);
    return startOffset + 500 * this.dpr;
  };

  create() {
    console.log("Game Scene...");
    if (this.showObstacles) {
      this.sound.add("low_whack", { loop: false, volume: 0.5 });
      this.sound.add("high_whack", { loop: false, volume: 0.5 });
    }
    // Center the background image
    const centerX = this.cameras.main.width / 2;
    if (!this.enableMotion) {
      const centerY = this.cameras.main.height / 2;
      const bg = this.add
        .image(centerX, centerY, "background")
        .setScrollFactor(0);
      bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    } else {
      this.background = this.add
        .tileSprite(0, 0, 0, 0, "background")
        .setScrollFactor(0)
        .setOrigin(0, 0);
      this.background.setScale(
        (414 / this.background.width) * this.dpr,
        (736 / this.background.height) * this.dpr
      );
      this.add
        .image(this.centerX, this.centerY, "center_logo")
        .setDisplaySize(254, 84)
        .setScrollFactor(0);
    }

    const siteUrl = this.add
      .text(this.centerX, this.centerY, "marblerace.ai", {
        fontSize: `${24 * this.dpr}px`,
        color: "#ffffff",
        stroke: "rgba(0,0,0,0.5)",
        strokeThickness: 2,
      })
      .setScrollFactor(0);
    siteUrl.setPosition(siteUrl.x - siteUrl.width / 2, siteUrl.y + 100);
    // siteUrl.setScale(this.dpr);
    // siteUrl.setPosition(siteUrl.x - siteUrl.width / 2, siteUrl.y);
    // Enable camera scrolling
    const canvasWidth = this.cameras.main.width;

    var prodShapes = this.cache.json.get("prod_shapes");
    var miniShapes = this.cache.json.get("mini_shapes");
    var obstaclesShapes = this.cache.json.get("obstacles_shapes");

    let startOffset = 800 * this.dpr;
    const xOffset = this.centerX;
    // this.selectedTracks = ["06", "07", "03", "01", "16"];
    this.selectedTracks.map((trackNo) => {
      switch (trackNo) {
        case "01":
          startOffset = this.createStaticCircles(
            xOffset,
            startOffset,
            prodShapes,
            obstaclesShapes
          );
          break;
        case "02":
          startOffset = this.createCrossScreen(
            startOffset,
            canvasWidth,
            miniShapes
          );
          break;
        case "03":
          startOffset = this.createStaticTriangles(
            xOffset,
            startOffset,
            prodShapes,
            obstaclesShapes
          );
          break;
        case "06":
          startOffset = this.createSeesawScreen(
            xOffset,
            startOffset,
            prodShapes,
            miniShapes,
            obstaclesShapes
          );
          break;
        case "07":
          startOffset = this.createZigzagSlider(
            xOffset,
            startOffset,
            prodShapes,
            obstaclesShapes
          );
          break;
        case "11":
          startOffset = this.createStopperSlider(
            xOffset,
            startOffset,
            prodShapes
          );
          break;
        case "14":
          startOffset = this.createStarRotations(startOffset, miniShapes);
          break;
        case "16":
          startOffset = this.createReduceSizeSlider(
            xOffset,
            startOffset,
            prodShapes
          );
          break;
        case "21":
          startOffset = this.createCircleBlockers(
            xOffset,
            startOffset,
            prodShapes
          );
          break;
        case "22":
          startOffset = this.createHorizontalCrosses(
            canvasWidth,
            startOffset,
            miniShapes
          );
          break;
      }
    });
    const finishOffset = startOffset + 250;
    this.add.image(centerX, finishOffset, "finish_line").setScale(0.5);
    this.finishLineOffset = finishOffset;
    // .setDisplaySize(960, 40);
    this.cameras.main.setBounds(
      0,
      0,
      this.cameras.main.width,
      finishOffset + 250
    );
    this.matter.world.setBounds(
      0,
      0,
      this.cameras.main.width,
      finishOffset + 800
    );

    this.createMarbles(this.marbleRadius, miniShapes);
    this.crossLeftRotation.map((baseSprite) =>
      this.createTextureMask(baseSprite.x, baseSprite.y, baseSprite)
    );
    this.crossRightRotation.map((baseSprite) =>
      this.createTextureMask(baseSprite.x, baseSprite.y, baseSprite)
    );
    [...this.leftRotatableStars, ...this.rightRotatableStars].map(
      (baseSprite) =>
        this.createTextureMask(baseSprite.x, baseSprite.y, baseSprite)
    );
    [
      ...this.horizontalCrossLeftRotation,
      ...this.horizontalCrossRightRotation,
    ].map((baseSprite) =>
      this.createTextureMask(baseSprite.x, baseSprite.y, baseSprite)
    );

    let coundownValue = 3;
    // Start Countdown:
    const clock = this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        if (this.countdownText) {
          coundownValue--;
          if (coundownValue > 0) {
            this.countdownText.setText(coundownValue.toString());
          } else {
            this.countdownText.setText("Go!");
            console.log("Go!");
            // remove the large circle
            if (this.largeCircle?.body) {
              this.matter.world.remove(this.largeCircle.body, true);
              this.largeCircle.destroy();
              //     this.matter.world.remove(this.largeCircle);
            }
            this.isRotating = false;
            this.countdownText.destroy();
            clock.destroy();
            this.cameras.main.startFollow(this.marblesImages[1]);
          }
        }
      },
    });
    marbleRaceOnlyInstrument(this.coverDocId, 120, this.musicStartOffset).then(
      () => (this.isInstrumentPlaying = true)
    );
    if (this.showObstacles) this.renderWeapons();
    if (this.showRythmicPads) this.renderJoystickButtons();
  }
  showResult() {
    const labelContent = this.winnerIdx === 1 ? "You Win!" : "You Lose";
    const xpContent = this.winnerIdx === 1 ? "+500 XP" : "+0 XP";

    const label = this.add
      .text(this.centerX, this.centerY - 180, labelContent, {
        fontSize: `${64 * this.dpr}px`,
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setScrollFactor(0);
    label.setDepth(1);
    label.setPosition(label.x - label.width / 2, label.y - label.height / 2);
    const labelXp = this.add
      .text(this.centerX, this.centerY + 250, xpContent, {
        fontSize: `${52 * this.dpr}px`,
        color: "#573FC8",
        stroke: "#fff",
        strokeThickness: 4,
      })
      .setScrollFactor(0);
    // .setScale(this.dpr);
    labelXp.setDepth(1);
    labelXp.setPosition(
      labelXp.x - labelXp.width / 2,
      labelXp.y - labelXp.height / 2
    );
    EventBus.emit("game-over", this.winnerIdx === 1);
    this.isResultShown = true;
  }

  graphics: Phaser.GameObjects.Graphics | undefined;
  circle1: Phaser.GameObjects.Sprite | undefined;
  outlineCircle1: Phaser.GameObjects.Sprite | undefined;
  circle2: Phaser.GameObjects.Sprite | undefined;
  outlineCircle2: Phaser.GameObjects.Sprite | undefined;
  circle3: Phaser.GameObjects.Sprite | undefined;
  outlineCircle3: Phaser.GameObjects.Sprite | undefined;
  circle4: Phaser.GameObjects.Sprite | undefined;
  outlineCircle4: Phaser.GameObjects.Sprite | undefined;
  setIntervals: NodeJS.Timeout[] = [];
  setTimeouts: NodeJS.Timeout[] = [];
  tapTimings: number[] = [];
  allTapTimings: number[] = [];
  circleShouldFillInMs = 0;
  showTapTimings: number[] = [];
  currentTapIndex = 0;
  beatsGroupLength = 8;

  availableCircles: Phaser.GameObjects.Sprite[] = [];
  innerCircles: Phaser.GameObjects.Sprite[] = [];
  outlineCircles: Phaser.GameObjects.Sprite[] = [];

  resultLabel: Phaser.GameObjects.Text | undefined;
  tapScore: number = 0;
  isBoosted = false;

  buttonRadius = 40 * this.dpr;
  joystickHolder: Phaser.GameObjects.Container | undefined;
  joystickFrame: Phaser.GameObjects.Image | undefined;
  hasGroupPassed = true;

  renderJoystickButtons() {
    const frameHeight = this.cameras.main.height / 3;
    let circleYOffset =
      this.cameras.main.height / 2 + frameHeight - this.buttonRadius;
    // .image(0, 0, "joystick_frame")
    // .setDisplaySize(this.buttonRadius * 2, this.buttonRadius * 2);
    this.circle1 = this.add
      .sprite(this.cameras.main.width / 2 - 200, circleYOffset, "green_dot")
      .setDisplaySize(0, 0)
      .setScrollFactor(0);

    this.outlineCircle1 = this.add
      .sprite(
        this.cameras.main.width / 2 - 200,
        circleYOffset,
        "green_dot_outline"
      )
      .setScrollFactor(0)
      .setDisplaySize(this.buttonRadius * 2, this.buttonRadius * 2);
    this.circle2 = this.add
      .sprite(this.cameras.main.width / 2 + 200, circleYOffset, "green_dot")
      .setDisplaySize(0, 0)
      .setScrollFactor(0);

    this.outlineCircle2 = this.add
      .sprite(
        this.cameras.main.width / 2 + 200,
        circleYOffset,
        "green_dot_outline"
      )
      .setScrollFactor(0)
      .setDisplaySize(this.buttonRadius * 2, this.buttonRadius * 2);
    circleYOffset += this.buttonRadius * 2;
    this.circle3 = this.add
      .sprite(
        this.cameras.main.width / 2 - this.buttonRadius,
        circleYOffset,
        "green_dot"
      )
      .setDisplaySize(0, 0)
      .setScrollFactor(0);

    this.outlineCircle3 = this.add
      .sprite(
        this.cameras.main.width / 2 - this.buttonRadius,
        circleYOffset,
        "green_dot_outline"
      )
      .setScrollFactor(0)
      .setDisplaySize(this.buttonRadius * 2, this.buttonRadius * 2);
    this.circle4 = this.add
      .sprite(
        this.cameras.main.width / 2 + this.buttonRadius,
        circleYOffset,
        "green_dot"
      )
      .setDisplaySize(0, 0)
      .setScrollFactor(0);

    this.outlineCircle4 = this.add
      .sprite(
        this.cameras.main.width / 2 + this.buttonRadius,
        circleYOffset,
        "green_dot_outline"
      )
      .setScrollFactor(0)
      .setDisplaySize(this.buttonRadius * 2, this.buttonRadius * 2);
    this.availableCircles = [
      this.circle1,
      this.circle2,
      this.circle3,
      this.circle4,
    ];
    this.innerCircles = [
      this.circle1,
      this.circle2,
      this.circle3,
      this.circle4,
    ];
    this.outlineCircles = [
      this.outlineCircle1,
      this.outlineCircle2,
      this.outlineCircle3,
      this.outlineCircle4,
    ];
    const fxs = this.outlineCircles.map((c) => {
      c.preFX?.setPadding(32);
      return c.preFX?.addGlow(0xffffff, 0, 0, true, 0.1, 32);
    });
    this.tweens.add({
      targets: fxs,
      outerStrength: 10,
    });
    [...this.innerCircles, ...this.outlineCircles].map((c) => {
      c.setDepth(10);
      c.setAlpha(0);
    });
    this.events.on("destroy", () => {
      this.setTimeouts.map((timeout) => clearTimeout(timeout));
      this.setIntervals.map((interval) => clearInterval(interval));
    });
    this.joystickFrame = this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + frameHeight,
        "joystick_frame"
      )
      .setDepth(9)
      .setScrollFactor(0)
      .setDisplaySize(this.cameras.main.width, frameHeight)
      .setAlpha(0);
  }
  isJoystickButtonsShown = false;

  hideJoystickButtons() {
    this.isJoystickButtonsShown = false;
    this.innerCircles.map((c) => {
      c.setAlpha(0);
    });
    this.outlineCircles.map((c) => {
      c.setAlpha(0);
    });
    this.innerCircles.map((c) => {
      c.removeListener("pointerdown");
    });
    this.joystickFrame?.setTint(undefined);
    this.joystickFrame?.setAlpha(0);
  }
  showJoystickButtons() {
    this.isJoystickButtonsShown = true;
    this.hasGroupPassed = false;
    this.innerCircles.map((c) => {
      c.setAlpha(1);
    });
    this.outlineCircles.map((c) => {
      c.setAlpha(1);
    });
    this.joystickFrame?.setAlpha(1);
  }
  boostMultipler: number = 0;
  tapResultLabel: Phaser.GameObjects.Text | undefined;
  tapResultLabelTimer: NodeJS.Timeout | undefined;
  // update(time: number, delta: number): void {
  update(): void {
    if (this.showRythmicPads && this.isResultShown === false) {
      const currentTime = getToneCurrentTime();

      if (this.tapScore >= 40) {
        this.tapScore = 0;
        this.isBoosted = true;
        this.boostMultipler = this.marbles[1].velocity.y;
        this.marbleTrailParticles[1].setConfig({
          color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
          colorEase: "quad.out",
          lifespan: 2400,
          angle: { min: -100, max: -80 },
          scale: { start: 1, end: 0, ease: "sine.out" },
          speed: { min: 250, max: 350 },
          advance: 2000,
          blendMode: "ADD",
        });
        this.hideJoystickButtons();
        this.tapResultLabel?.destroy();
        this.tapResultLabel = this.add
          .text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "Boosted",
            {
              fontSize: `${42 * this.dpr}px`,
              color: "white",
              stroke: "rgba(0,0,0,1)",
              strokeThickness: 6,
              // backgroundColor: "rgba(0,0,0,1)",
            }
          )
          .setScrollFactor(0);
        this.tapResultLabel?.setPosition(
          this.tapResultLabel.x - this.tapResultLabel.width / 2,
          this.tapResultLabel.y - this.tapResultLabel.height / 2
        );
        if (this.tapResultLabelTimer) {
          clearTimeout(this.tapResultLabelTimer);
        }
        this.tapResultLabelTimer = setTimeout(() => {
          // this.matter.world.setGravity(0, this.initialGravity);
          this.tapResultLabel?.destroy();
        }, 2000);
      }
      const _currentTapIndex = this.currentTapIndex;
      const nextTapTiming =
        this.showTapTimings[_currentTapIndex] -
        this.circleShouldFillInMs / 1000;
      if (currentTime >= nextTapTiming) {
        // console.log("Current Tap Idx: ", _currentTapIndex);
        this.currentTapIndex++;
        if (!this.isBoosted) {
          this.showJoystickButtons();
          const circleToFill = _.sample(this.availableCircles);
          if (circleToFill) {
            this.availableCircles = this.availableCircles.filter(
              (c) => c !== circleToFill
            );
            circleToFill.setInteractive();
            circleToFill.once("pointerdown", () => {
              // Hide the Circle
              circleToFill.setDisplaySize(0, 0);
              circleToFill.setAlpha(0);
              // Add a Label at the center of the screen with scrollFactor 0
              const newCurrentTime = getToneCurrentTime();
              const expectedTapTime = this.showTapTimings[_currentTapIndex];
              const difference = expectedTapTime - newCurrentTime;
              const resultText =
                difference < this.perfectTapTime
                  ? "Perfect"
                  : difference < this.goodTapTime
                  ? "Good"
                  : "Miss";
              this.tapScore +=
                resultText === "Perfect" ? 10 : resultText === "Good" ? 5 : 0;
              // Set green/success tint to the joystick frame
              // green: #00ff00
              // red: #ff0000
              // yellow: #ffff00
              this.joystickFrame?.setTint(
                resultText === "Perfect"
                  ? 0xffff00
                  : resultText === "Good"
                  ? 0xffff00
                  : 0xff0000
              );
              this.tapResultLabel?.destroy();
              this.tapResultLabel = this.add
                .text(
                  this.cameras.main.width / 2,
                  this.cameras.main.height / 2,
                  resultText,
                  {
                    fontSize: `${42 * this.dpr}px`,
                    color:
                      resultText === "Perfect"
                        ? "green"
                        : resultText === "Good"
                        ? "yellow"
                        : "red",
                    stroke: "rgba(0,0,0,1)",
                    strokeThickness: 6,
                    // backgroundColor: "rgba(0,0,0,1)",
                  }
                )
                .setScrollFactor(0);
              this.tapResultLabel.setPosition(
                this.tapResultLabel.x - this.tapResultLabel.width / 2,
                this.tapResultLabel.y - this.tapResultLabel.height / 2
              );
              if (this.tapResultLabelTimer) {
                // this.joystickFrame?.setTint(undefined);
                clearTimeout(this.tapResultLabelTimer);
              }

              // Destroy the label after 1 second
              this.tapResultLabelTimer = setTimeout(() => {
                this.joystickFrame?.setTint(undefined);
                this.tapResultLabel?.destroy();
              }, 500);
              // circleToFill.removeInteractive();
              this.availableCircles.push(circleToFill);
            });
            // Gradually Increase the radius of the circle to be 80
            // Create a SetInterval
            const interval = setInterval(() => {
              if (circleToFill) {
                const radiuToIncreasePerMs =
                  this.buttonRadius / (this.circleShouldFillInMs / 10);

                circleToFill.setDisplaySize(
                  circleToFill.displayWidth + radiuToIncreasePerMs * 2,
                  circleToFill.displayHeight + radiuToIncreasePerMs * 2
                );
              }
            }, 10);
            this.setIntervals.push(interval);
            const timeout = setTimeout(() => {
              circleToFill.setDisplaySize(0, 0);
              this.availableCircles.push(circleToFill);
              circleToFill.removeInteractive();
              clearInterval(interval);
            }, this.circleShouldFillInMs);
            this.setTimeouts.push(timeout);
            // }
          }
        }
      }
      if (
        _currentTapIndex &&
        _currentTapIndex % this.beatsGroupLength === 0 &&
        this.hasGroupPassed === false
      ) {
        this.hasGroupPassed = true;
        // console.log("Group Passed");
        // this.marbleTrailParticles[0].setConfig({
        //     ...this.trailConfig,
        //     scale: this.marbleTrailParticles[0].scale,
        //     follow: this.marbles[0].position,
        // });
        // this.marbleTrailParticles[0].destroy();
        this.hideJoystickButtons();
      }
      if (
        this.isBoosted &&
        this.boostMultipler < 20 &&
        this.boostMultipler > 0
      ) {
        const userMarble = this.marbles[1]; // TODO: User chosen marble
        this.matter.body.setVelocity(userMarble, {
          x: userMarble.velocity.x,
          y: this.boostMultipler,
        });
        this.boostMultipler += 0.1;
      }
      if (this.isBoosted && this.boostMultipler >= 20 && this.hasGroupPassed) {
        this.isBoosted = false;
        this.boostMultipler = 0;
        this.marbleTrailParticles[1].destroy();
        this.marbleTrailParticles[1] = this.add
          .particles(0, 0, "trail", {
            ...this.trailConfig,
            follow: this.marbles[1].position,
          })
          .setDepth(0);
      }
    }
    if (this.showObstacles) {
      if (this.damageMultipliyer === 1) {
        // Highlight level 1 hammer
        this.level2Hammer?.setScale((0.1 / 414) * this.canvasWidth * this.dpr);
        this.level1Hammer?.setScale((0.2 / 414) * this.canvasWidth * this.dpr);
      } else if (this.damageMultipliyer === 1.5) {
        // Highlight level 2 hammer
        this.level1Hammer?.setScale((0.1 / 414) * this.canvasWidth * this.dpr);
        this.level2Hammer?.setScale((0.2 / 414) * this.canvasWidth * this.dpr);
      }
    }
    if (this.isGameOver && this.isResultShown === false) {
      // if (this.isResultShown) return;
      this.showResult();
    }
    // if (this.enableMotion && !this.isRotating)
    //     this.background.tilePositionX += 0.08;
    if (this.marbles.length) {
      if (this.isRotating) {
        // Update the base angle to create the circular motion
        this.baseAngle += 0.01; // Adjust this value to change the speed of rotation
        this.largeCircle?.setRotation(this.baseAngle);
        this.matter.body.setAngularVelocity(
          this.largeCircle?.body as BodyType,
          0.15
        );
      }
      // Optimize marble updates
      for (let i = 0; i < this.marbles.length; i++) {
        const voiceBody = this.marbles[i];
        const marbleImage = this.marblesImages[i];
        const marbleMask = this.marblesMasks[i];
        const label = this.labels[i];
        const currentCrossIndex = this.currentMarblesSizeIndices[i.toString()];

        // Update marble image position and rotation
        if (marbleImage) {
          marbleImage.setPosition(voiceBody.position.x, voiceBody.position.y);
          marbleImage.setRotation(voiceBody.angle);
        }

        // Update marble mask position
        if (marbleMask) {
          marbleMask.setPosition(
            voiceBody.position.x - voiceBody.circleRadius,
            voiceBody.position.y - voiceBody.circleRadius
          );
        }

        // Update label position
        if (label) {
          label.setPosition(
            voiceBody.position.x - label.width / 2,
            voiceBody.position.y - 60
          );
        }

        // Check for size changes
        const isHeightReduced = this.heightReducedIndices.includes(i);
        const y = voiceBody.position.y;

        if (
          isHeightReduced &&
          y > this.increaseSizeScreenOffset[currentCrossIndex]
        ) {
          // Increase size
          this.currentMarblesSizeIndices[i.toString()]++;
          this.matter.body.scale(voiceBody, 2, 2);
          if (marbleImage)
            marbleImage.setDisplaySize(
              this.marbleRadius * 2,
              this.marbleRadius * 2
            );
          if (marbleMask) marbleMask.scale = 1;
          this.heightReducedIndices = this.heightReducedIndices.filter(
            (idx) => idx !== i
          );
          this.marbleTrailParticles[i].setConfig(this.trailConfig);
        } else if (
          !isHeightReduced &&
          y > this.reduceSizeScreenOffset[currentCrossIndex] &&
          y < this.increaseSizeScreenOffset[currentCrossIndex]
        ) {
          // Reduce size
          this.heightReducedIndices.push(i);
          this.matter.body.scale(voiceBody, 0.5, 0.5);
          if (marbleImage)
            marbleImage.setDisplaySize(this.marbleRadius, this.marbleRadius);
          if (marbleMask) marbleMask.scale = 0.5;
          this.marbleTrailParticles[i].setConfig({
            ...this.trailConfig,
            scale: { start: 0.5, end: 0.01 },
          });
        }
      }
      // TODO: Optimized Code
      // this.crossRightRotation.map((c) => {
      //     c.setAngle(c.angle + 2);
      //     this.matter.body.setAngularVelocity(c.body as BodyType, 0.05);
      // });
      // this.crossLeftRotation.map((c) => {
      //     c.setAngle(c.angle - 2);
      //     this.matter.body.setAngularVelocity(c.body as BodyType, 0.05);
      // });
      if (this.isInstrumentPlaying && this.isRotating === false) {
        /*
        let largest = -Infinity;
        let secondLargest = -Infinity;
        let largestIndex = -1;
        let finishedPositions = [];
        let voicesPositions = [];

        for (let i = 0; i < this.marbles.length; i++) {
          const y = this.marbles[i].position.y;
          voicesPositions.push(y);
          if (y < this.finishLineOffset) {
            finishedPositions.push(y);
            if (y > largest) {
              secondLargest = largest;
              largest = y;
              largestIndex = i;
            } else if (y > secondLargest) {
              secondLargest = y;
            }
          }
        }
        */
        const unFinishedPositions = [];
        const finishedPositions = [];
        const voicesPositions = [];
        for (let i = 0; i < this.marbles.length; i++) {
          const y = this.marbles[i].position.y;
          voicesPositions.push(y);
          if (y < this.finishLineOffset) {
            unFinishedPositions.push(y);
          } else if (y > this.finishLineOffset) {
            finishedPositions.push(y);
          }
        }
        // Above is the refactored code
        // const voicesPositions = this.marbles.map((m) => m.position.y);
        // const unFinishedPositions = voicesPositions.filter(
        //   (y) => y < this.finishLineOffset
        // );
        // const finishedPositions = voicesPositions.filter(
        //   (y) => y > this.finishLineOffset
        // );

        if (this.winnerIdx === -1 && finishedPositions.length) {
          this.winnerIdx = voicesPositions.indexOf(finishedPositions[0]);
        }
        const largest = Math.max(...unFinishedPositions);
        const largestIndex = voicesPositions.findIndex((v) => v === largest);
        const secondLargest = Math.max(
          ...unFinishedPositions.filter((p) => p !== largest)
        );
        if (largestIndex === -1) {
          this.isGameOver = true;
          return;
        }
        if (
          this.prevVoiceIdx !== largestIndex &&
          largest > secondLargest + this.marbleRadius
        )
          this.throttledUpdate(largestIndex);
        // else if (secondLargest >= largest - this.marbleRadius * 2)
        //   this.throttledUpdate(secondLargestIndex, false);
        if (this.autoScroll) {
          // this.cameras.main.startFollow(this.marblesImages[0]);
          // this.cameras.main.scrollY = largest - 300 * this.dpr;
        }
      }

      // Optimised Code
      // let largest = -Infinity;
      // let secondLargest = -Infinity;
      // let index = -1;

      // for (let i = 0; i < this.marbles.length; i++) {
      //     const y = this.marbles[i].position.y;
      //     if (y < this.finishLineOffset) {
      //         if (y > largest) {
      //             secondLargest = largest;
      //             largest = y;
      //             index = i;
      //         } else if (y > secondLargest) {
      //             secondLargest = y;
      //         }
      //     }
      // }
      // TODO: Uncomment this
      // this.leftRotatableStars.map((rs) => rs.setAngle(rs.angle - 0.4));
      // this.rightRotatableStars.map((rs) => rs.setAngle(rs.angle + 0.4));
      // this.horizontalCrossRightRotation.map((rs) =>
      //     rs.setAngle(rs.angle + 2.5)
      // );
      // this.horizontalCrossLeftRotation.map((rs) =>
      //     rs.setAngle(rs.angle - 2.5)
      // );

      // Bars up/down motion
      // this.motionTimeForUpDownWard += delta;
      // this.upDownMotionElems.map(
      //     ({
      //         matter,
      //         startX,
      //         startY,
      //         moveSpeed,
      //         maxBottom,
      //         maxTop,
      //         direction,
      //     }) => {
      //         const amplitude = (maxBottom - maxTop) / 2;
      //         const offset = amplitude * Math.sin(time * (moveSpeed * 0.01));
      //         // // Calculate new y position using a sine wave for smooth up and down movement
      //         // const range = maxBottom - maxTop;
      //         // const midPoint = maxTop + range / 2;
      //         // Calculate the new position considering the angle
      //         if (direction === "right") {
      //             const newX =
      //                 startX + offset * Math.sin(Phaser.Math.DegToRad(7.1));
      //             const newY =
      //                 startY - offset * Math.cos(Phaser.Math.DegToRad(7.1));
      //             // Update the rectangle's y position using a sine wave
      //             matter.setPosition(newX, newY);
      //         } else {
      //             const newX =
      //                 startX + offset * Math.sin(Phaser.Math.DegToRad(-7.1));
      //             const newY =
      //                 startY - offset * Math.cos(Phaser.Math.DegToRad(-7.1));
      //             // Update the rectangle's y position using a sine wave
      //             matter.setPosition(newX, newY);
      //         }
      //     }
      // );
    }
  }
}
