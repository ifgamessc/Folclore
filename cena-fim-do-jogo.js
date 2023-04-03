export default class fim_do_jogo extends Phaser.Scene {
    constructor() {
      super("fim-do-jogo");
    }
  
    preload() {
      this.load.image("ifsc-sj-2014", "./ifsc-sj-2014.png");
    }
  
    create() {
      this.imagem = this.add
        .image(400, 225, "ifsc-sj-2014")
        .setTint(0xff0000)
        .setInteractive()
        .on("pointerdown", () => {
          this.imagem.destroy();
          this.texto.destroy();
          this.game.scene.start("principal");
        });
  
      this.texto = this.add.text(490, 50, "Fim do jogo.", {
        fill: "#000000",
      });
    }
  
    upload() {}
  }