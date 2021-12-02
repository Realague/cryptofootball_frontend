import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import gameAbi from "./abis/game.json";
import marketplaceAbi from "./abis/marketplace.json";
import footballPlayersAbi from "./abis/footballPlayer.json";

const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  marketplace: marketplaceAbi,
  game: gameAbi,
  footballPlayer: footballPlayersAbi
};

export default abis;
