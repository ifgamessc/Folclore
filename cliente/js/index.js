import config from "./config.js";
import abertura from "./cena-abertura.js";
import sala from "./cena-sala.js"; 
import floresta from "./cena-floresta.js";
import fim_do_jogo from "./cena-fim-do-jogo.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    let iceServers;
    if (window.location.host === "ifsc.digital") {
      this.socket = io.connect({ path: "/ifgamessc/socket.io/"});
      iceServers = [
        {
          urls: "stun:ifsc.digital",
        },
        {
          urls: "turns:ifsc.digital",
          username: "adcipt",
          credential: "adcipt20231",
        },
      ];
    } else {
      this.socket = io();
      iceServers = [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ];
    }
    this.ice_servers = { iceServers };
    this.audio = document.querySelector("audio");
    this.socket.on("connect", () => {
      console.log("Conectado ao servidor para troca de mensagens.");
    });

    this.scene.add("abertura", abertura);
    this.scene.add("sala", sala);
    this.scene.add("floresta", floresta);
    this.scene.add("fim-do-jogo", fim_do_jogo);

    this.scene.start("abertura");
  }
}

window.onload = () => {
  window.game = new Game();
};