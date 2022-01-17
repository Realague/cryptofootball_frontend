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

function getMaxGbToConsumeForLvlUp(gbPrice, gbBalance, xpPerDollar, score, xp) {
    if (score === 100) {
        return 0
    }
    let gbRequire = 0
    let tmp = 0
    do {
        gbRequire += tmp
        tmp = (getXpRequireToLvlUp(score) - xp) / xpPerDollar / gbPrice
        score++
        xp = 0
    } while (gbRequire < gbBalance && score <= 100)
    return gbRequire
}

function calculateNewScore(xpToAdd, currentXp, currentScore) {
    let newScore = currentScore
    while (xpToAdd > getXpRequireToLvlUp(newScore) - currentXp) {
        xpToAdd -= (getXpRequireToLvlUp(newScore) - currentXp)
        newScore++
        currentXp = 0
    }
    return newScore
}

function getContract() {
    return GContract;
}

export default { getRewards, getClaimFee, calculateNewScore, getClaimCooldown, isLevelUpOpen, getMaxGbToConsumeForLvlUp, isTrainingOpen, isUpgradeFrameOpen, getRemainingClaimCooldown, getCurrentStamina, getXpRequireToLvlUp, setProvider, getFootballTokenPrice, getContract };