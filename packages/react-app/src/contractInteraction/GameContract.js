import {abis, addresses} from "@project/contracts";
import Contract from "web3-eth-contract";

let GContract;

function setProvider(provider, account) {
    Contract.setProvider(provider);
    GContract = new Contract(abis.game, addresses.Game, {from: account})
}

async function getClaimFee() {
    return await GContract.methods.getClaimFee().call();
}

async function getClaimCooldown() {
    return await GContract.methods.getClaimCooldown().call();
}

async function getRewards() {
    return await GContract.methods.getRewards().call();
}

async function isLevelUpOpen() {
    return await GContract.methods.levelUpOpen().call();
}

async function isTrainingOpen() {
    return await GContract.methods.trainingOpen().call();
}

async function isUpgradeFrameOpen() {
    return await GContract.methods.upgradeFrameOpen().call();
}

async function getRemainingClaimCooldown(account) {
    return await GContract.methods.getRemainingClaimCooldown().call();
}

function getCurrentStamina(playerId) {
    return GContract.methods.getCurrentStamina(playerId).call();
}

function getXpRequireToLvlUp(score) {
    return score * (score / 2);
}

async function getFootballTokenPrice() {
    return await GContract.methods.getFootballTokenPrice().call();
}

function getContract() {
    return GContract;
}

export default { getRewards, getClaimFee, getClaimCooldown, isLevelUpOpen, isTrainingOpen, isUpgradeFrameOpen, getRemainingClaimCooldown, getCurrentStamina, getXpRequireToLvlUp, setProvider, getFootballTokenPrice, getContract };