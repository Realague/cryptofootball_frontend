import {abis, addresses} from "@project/contracts";
import Contract from "web3-eth-contract";

let FPContract;
let FootballHeroesStorage;

const names = [[
    ["MENDI", "NAVAS"],
    ["COURTOIS", "DE G E A", "ALISSON"],
    ["LORRIS", "KHAN"],
    ["NEUER", "BUFFON", "CASILLAS"]
], [["MARQUINHOS", "ALABA", "VARANE", "HERNANDEZ"],
    ["SILVA", "AKAMI", "PEPE", "PIQUE", "BONUCCI"],
    ["RAMOS", "MARCELO", "VAN DIJIK", "ALVES", "HULLMES", "LAHM"],
    ["CARLOS", "CAFU", "MALDINI", "PUYOL"]
], [["MAHREZ", "POKBA", "KOKE", "CASEMIRO", "FRED"],
    ["DE BRUYNE", "FERNANDES", "VERRATTI", "DI MARIA", "JORGINHO", "GERRARD"],
    ["MODIRC", "MULLER", "KANTE", "ERIKSEN", "XAVI"],
    ["ZIDANE", "PELE", "INIESTA", "MARADONA", "RONALDINHO", "PIERLO"]
], [["LUKAKU", "HAZARD", "WERNER", "CAVANI", "ICARDI", "JESUS", "GIROUD", "HULK"],
    ["SALAH", "KANE", "DZEKO", "VARDY", "ROBINHO", "ADRIANO"],
    ["NEYMAR", "MBAPPE", "LEWANDOWSKI", "BENZEMA", "HAANLAND", "IBRAHIMOVIC"],
    ["MESSI", "RONALDO", "DROGBA", "HENRY", "RAUL"]
]]

function setProvider(provider, account) {
    Contract.setProvider(provider);
    FPContract = new Contract(abis.footballPlayer, addresses.FootballPlayers, {from: account});
    FootballHeroesStorage = new Contract(abis.footballHeroesStorage, addresses.FootballHeroesStorage, {from: account});
}

async function getFootballPlayerList(account) {
    return await FootballHeroesStorage.methods.getPlayers().call({from: account});
}

async function getFootballPlayer(playerId) {
    return await FootballHeroesStorage.methods.getPlayer(playerId).call();
}

async function getMintPrice() {
    return await FPContract.methods.mintPrice().call();
}

async function getMintFees() {
    return await FPContract.methods.mintFees().call();
}

async function isMintOpen() {
    return await FPContract.methods.mintOpen().call();
}

function getContract() {
    return FPContract;
}

async function isApprovedForAll(account) {
    return FPContract.methods.isApprovedForAll(account, addresses.Marketplace).call();
}

function getPlayersName(player) {
    return names[player.position][player.rarity][player.imageId];
}

export default { getFootballPlayerList, getFootballPlayer, getMintPrice, getMintFees, isMintOpen, setProvider, getContract, isApprovedForAll, getPlayersName };