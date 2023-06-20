export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
  }

  preload() {
    this.load.tilemapTiledJSON(
      "mapa-floresta",
      "./assetsdef/mapa-floresta.json"
    );

    this.load.image("terreno", "./assetsdef/A2.png");
    this.load.image("fundo", "./assetsdef/fundo-floresta.png");

    this.load.spritesheet("player1", "./assetsdef/p1teste.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player2", "./assetsdef/p2teste.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("cristal", "./assets/cristal.png", {
      frameWidth: 32,
      frameHeight: 56,
    });

    this.load.spritesheet("cima", "./assetsdef/botaocima.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("esquerda", "./assetsdef/botaoesquerda.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("direita", "./assetsdef/botaodireita.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("tela-cheia", "./assetsdef/tela-cheia.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.audio("musica-fundo", "./assetsdef/");
    this.load.audio("", "./assetsdef/");
    this.load.audio("", "./assetsdef/");
  }

  create() {
    this.trilha = this.sound.add("musica-fundo");
    this.trilha.loop = true;
    this.trilha.play();

    this.mapa_floresta = this.make.tilemap({
      key: "mapa-floresta",
    });

    this.tileset_floresta_terreno =
      this.mapa_floresta.addTilesetImage("terreno", "terreno");

    this.tileset_floresta_fundo =
      this.mapa_floresta.addTilesetImage("fundo", "fundo");

    this.terreno = this.mapa_principal_terreo.createLayer(
      "terreno",
      this.tileset_principal_terreo_terreno,
      0,
      0
    );

    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.local = "player1";
      this.jogador_1 = this.physics.add.sprite(300, 225, this.local);
      this.remoto = "player2";
      this.jogador_2 = this.add.sprite(600, 225, this.remoto);
    } else {
      this.remoto = "player1";
      this.jogador_2 = this.add.sprite(300, 225, this.remoto);
      this.local = "player2";
      this.jogador_1 = this.physics.add.sprite(600, 225, this.local);
      
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          console.log(stream);

          this.game.localConnection = new RTCPeerConnection(
            this.game.ice_servers
          );

          stream
            .getTracks()
            .forEach((track) =>
              this.game.localConnection.addTrack(track, stream)
            );

          this.game.localConnection.onicecandidate = ({ candidate }) => {
            candidate &&
              this.game.socket.emit("candidate", this.game.sala, candidate);
          };

          this.game.localConnection.ontrack = ({ streams: [stream] }) => {
            this.game.audio.srcObject = stream;
          };

          this.game.localConnection
            .createOffer()
            .then((offer) =>
              this.game.localConnection.setLocalDescription(offer)
            )
            .then(() => {
              this.game.socket.emit(
                "offer",
                this.game.sala,
                this.game.localConnection.localDescription
              );
            });

          this.game.midias = stream;
        })
        .catch((error) => console.log(error));
    }
    
    this.game.socket.on("offer", (description) => {
      this.game.remoteConnection = new RTCPeerConnection(this.game.ice_servers);

      this.game.midias
        .getTracks()
        .forEach((track) =>
          this.game.remoteConnection.addTrack(track, this.game.midias)
        );

      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
          this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      let midias = this.game.midias;
      this.game.remoteConnection.ontrack = ({ streams: [midias] }) => {
        this.game.audio.srcObject = this.game.midias;
      };

      this.game.remoteConnection
        .setRemoteDescription(description)
        .then(() => this.game.remoteConnection.createAnswer())
        .then((answer) =>
          this.game.remoteConnection.setLocalDescription(answer)
        )
        .then(() => {
          this.game.socket.emit(
            "answer",
            this.game.sala,
            this.game.remoteConnection.localDescription
          );
        });
    });

    this.game.socket.on("answer", (description) => {
      this.game.localConnection.setRemoteDescription(description);
    });

    this.game.socket.on("candidate", (candidate) => {
      let conn = this.game.localConnection || this.game.remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });
    
    this.anims.create({
      key: "jogador-parado",
      frames: this.anims.generateFrameNumbers(this.local, {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
    });

    this.anims.create({
      key: "jogador-cima",
      frames: this.anims.generateFrameNumbers(this.local, {
        start: 64,
        end: 79,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "jogador-baixo",
      frames: this.anims.generateFrameNumbers(this.local, {
        start: 0,
        end: 15,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "jogador-esquerda",
      frames: this.anims.generateFrameNumbers(this.local, {
        start: 96,
        end: 111,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "jogador-direita",
      frames: this.anims.generateFrameNumbers(this.local, {
        start: 32,
        end: 47,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.cristal = this.physics.add.sprite(700, 300, "cristal");

    this.anims.create({
      key: "cristal-brilhando",
      frames: this.anims.generateFrameNumbers("cristal", {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.cristal.anims.play("cristal-brilhando");

    this.ARCas = this.mapa_principal_terreo.createLayer(
      "ARCas",
      this.tileset_principal_terreo_ARCas,
      0,
      0
    );

    this.cima = this.add
      .sprite(120, 330, "cima", 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.cima.setFrame(1);
        this.jogador_1.setVelocityY(-200);
        this.jogador_1.anims.play("jogador-cima");
      })
      .on("pointerup", () => {
        this.cima.setFrame(0);
        this.jogador_1.setVelocityY(0);
        this.jogador_1.anims.play("jogador-parado");
      })
      .setScrollFactor(0);

    this.baixo = this.add
      .sprite(120, 400, "baixo", 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.baixo.setFrame(1);
        this.jogador_1.setVelocityY(200);
        this.jogador_1.anims.play("jogador-baixo");
      })
      .on("pointerup", () => {
        this.baixo.setFrame(0);
        this.jogador_1.setVelocityY(0);
        this.jogador_1.anims.play("jogador-parado");
      })
      .setScrollFactor(0);

    this.esquerda = this.add
      .sprite(50, 400, "esquerda", 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.esquerda.setFrame(1);
        this.jogador_1.setVelocityX(-200);
        this.jogador_1.anims.play("jogador-esquerda");
      })
      .on("pointerup", () => {
        this.esquerda.setFrame(0);
        this.jogador_1.setVelocityX(0);
        this.jogador_1.anims.play("jogador-parado");
      })
      .setScrollFactor(0);

    this.direita = this.add
      .sprite(190, 400, "direita", 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.direita.setFrame(1);
        this.jogador_1.setVelocityX(200);
        this.jogador_1.anims.play("jogador-direita");
      })
      .on("pointerup", () => {
        this.direita.setFrame(0);
        this.jogador_1.setVelocityX(0);
        this.jogador_1.anims.play("jogador-parado");
      })
      .setScrollFactor(0);

    this.tela_cheia = this.add
      .sprite(750, 50, "tela-cheia", 0)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scale.isFullscreen) {
          this.tela_cheia.setFrame(0);
          this.scale.stopFullscreen();
        } else {
          this.tela_cheia.setFrame(1);
          this.scale.startFullscreen();
        }
      })
      .setScrollFactor(0);

    this.terreno.setCollisionByProperty({ collides: true });
    this.ARCas.setCollisionByProperty({ collides: true });

    this.physics.add.collider(
      this.jogador_1,
      this.terreno,
      this.colidir_mapa,
      null,
      this
    );

    this.physics.add.collider(
      this.jogador_1,
      this.ARCas,
      this.colidir_mapa,
      null,
      this
    );

    this.jogador_1.setCollideWorldBounds(true);
    this.cameras.main.setBounds(0, 0, 960, 960);
    this.physics.world.setBounds(0, 0, 960, 960);
    this.cameras.main.startFollow(this.jogador_1);

    this.physics.add.collider(
      this.jogador_1,
      this.cristal,
      this.coletar_cristal,
      null,
      this
    );

    this.metal_som = this.sound.add("metal-som");
    this.cristal_som = this.sound.add("cristal-som");

    this.game.socket.on("estado-notificar", ({ frame, x, y }) => {
      this.jogador_2.setFrame(frame);
      this.jogador_2.x = x;
      this.jogador_2.y = y;
    });

    this.game.socket.on("artefatos-notificar", (artefatos) => {
      if (artefatos.cristal) {
        this.cristal.disableBody(true, true);
      }
    });
  }

  update() {
    let frame;
    try {
      frame = this.jogador_1.anims.getFrameName();
    } catch (e) {
      frame = 0;
    }
    this.game.socket.emit("estado-publicar", this.game.sala, {
      frame: frame,
      x: this.jogador_1.body.x + 32,
      y: this.jogador_1.body.y + 32,
    });
  }

  colidir_mapa() {
    this.cameras.main.shake(100, 0.01);
    if (window.navigator.vibrate) {
      window.navigator.vibrate([100]);
    }
    this.metal_som.play();
  }

  coletar_cristal() {
    this.cristal.disableBody(true, true);
    this.cristal_som.play();
    this.game.socket.emit("artefatos-publicar", this.game.sala, {
      cristal: true,
    });
  }
}
