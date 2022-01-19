import web3Contract from 'web3-eth-contract'
import {abis, addresses} from "@project/contracts";
import Web3 from "web3";
import {setTransaction} from "../features/gameSlice";
import {store} from "../store";

class FootballHeroesService {

    names = [[
        ["MENDY", "NAVAS"],
        ["COURTOIS", "DE GEA", "ALISSON"],
        ["LLORIS", "KAHN"],
        ["NEUER", "BUFFON", "CASILLAS"]
    ], [["MARQUINHOS", "ALABA", "VARANE", "HERNANDEZ"],
        ["SILVA", "HAKAMI", "PEPE", "PIQUE", "BONUCCI"],
        ["RAMOS", "MARCELO", "VAN DIJK", "ALVES", "HUMMELS", "LAHM"],
        ["CARLOS", "CAFU", "MALDINI", "PUYOL"]
    ], [["MAHREZ", "POGBA", "KOKE", "CASEMIRO", "FRED"],
        ["DE BRUYNE", "FERNANDES", "VERRATTI", "DI MARIA", "JORGINHO", "GERRARD"],
        ["MODRIC", "MULLER", "KANTE", "ERIKSEN", "XAVI"],
        ["ZIDANE", "PELE", "INIESTA", "MARADONA", "RONALDINHO", "PIRLO"]
    ], [["LUKAKU", "HAZARD", "WERNER", "CAVANI", "ICARDI", "JESUS", "GIROUD", "HULK"],
        ["SALAH", "KANE", "DZEKO", "VARDY", "ROBINHO", "ADRIANO"],
        ["NEYMAR", "MBAPPE", "LEWANDOWSKI", "BENZEMA", "HAALAND", "IBRAHIMOVIC"],
        ["MESSI", "RONALDO", "DROGBA", "HENRY", "RAUL"]
    ]]

    init(provider, address) {
        this.address = address
        this.provider = provider
        web3Contract.setProvider(provider)
        this.busdContract = new web3Contract(abis.erc20, addresses.BUSDTestnet, {
            from: address,
        })
        this.gbContract = new web3Contract(abis.erc20, addresses.GBTOKEN, {
            from: address,
        })
        this.footballPlayersContract = new web3Contract(abis.footballPlayer, addresses.FootballPlayers, {
            from: address,
        })
        this.storageContract = new web3Contract(abis.footballHeroesStorage, addresses.FootballHeroesStorage, {
            from: address,
        })
        this.gameContract = new web3Contract(abis.game, addresses.Game, {
            from: address,
        })
        this.marketplaceContract = new web3Contract(abis.marketplace, addresses.Marketplace, {
            from: address,
        })
    }

    async getGbBalance() {
        return await this.gbContract.methods.balanceOf(this.address).call()
    }

    async getBusdBalance() {
        return await this.busdContract.methods.balanceOf(this.address).call()
    }

    async getAllowances(consumer) {
        const busdAllowance = await this.getBusdAllowance(consumer)
        const gbAllowance = await this.getGbAllowance(consumer)
        return {busd: busdAllowance, gb: gbAllowance}
    }

    async getBusdAllowance(consumer) {
        return await this.busdContract.methods
            .allowance(this.address, consumer)
            .call();
    }

    async getGbAllowance(consumer) {
        return await this.gbContract.methods
            .allowance(this.address, consumer)
            .call()
    }

    async approveBusd(consumer,
                      amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    ) {
        let transaction = this.busdContract.methods.approve(consumer, amount).send()
        store.dispatch(setTransaction({transaction: transaction}))
        await transaction
    }

    async approveGb(consumer,
                    amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    ) {
        let transaction = this.gbContract.methods.approve(consumer, amount).send()
        store.dispatch(setTransaction({transaction: transaction}))
        await transaction
    }

    async approveFootballPlayer(consumer) {
        let transaction = this.footballPlayersContract.methods.setApprovalForAll(consumer, true).send()
        store.dispatch(setTransaction({transaction: transaction}))
        await transaction
    }

    async getFootballPlayerList() {
        return await this.storageContract.methods.getPlayers().call();
    }

    async getFootballPlayer(playerId) {
        return await this.storageContract.methods.getPlayer(playerId).call();
    }

    async getMintPrice() {
        return await this.footballPlayersContract.methods.mintPrice().call();
    }

    async getMintFees() {
        return await this.footballPlayersContract.methods.mintFees().call();
    }

    async isMintOpen() {
        return await this.footballPlayersContract.methods.mintOpen().call();
    }

    async marketplaceIsApproved() {
        return this.footballPlayersContract.methods.isApprovedForAll(this.address, addresses.Marketplace).call();
    }

    getPlayersName(player) {
        return this.names[player.position][player.rarity][player.imageId];
    }

    async getClaimFee() {
        return await this.gameContract.methods.getClaimFee().call();
    }

    async getClaimCooldown() {
        return await this.gameContract.methods.getClaimCooldown().call();
    }

    async getRewards() {
        return await this.gameContract.methods.getRewards().call();
    }

    async isLevelUpOpen() {
        return await this.gameContract.methods.levelUpOpen().call();
    }

    async isTrainingOpen() {
        return await this.gameContract.methods.trainingOpen().call();
    }

    async isUpgradeFrameOpen() {
        return await this.gameContract.methods.upgradeFrameOpen().call();
    }

    async getRemainingClaimCooldown() {
        return await this.gameContract.methods.getRemainingClaimCooldown().call();
    }

    getCurrentStamina(playerId) {
        return 0;
        return this.gameContract.methods.getCurrentStamina(playerId).call();
    }

    getXpRequireToLvlUp(score) {
        return score * (score / 2);
    }

    async getFootballTokenPrice() {
        return await this.gameContract.methods.getFootballTokenPrice().call();
    }

    getMaxGbToConsumeForLvlUp(gbPrice, gbBalance, xpPerDollar, score, xp) {
        if (score === 100) {
            return 0
        }
        let gbRequire = 0
        let tmp = 0
        do {
            gbRequire += tmp
            tmp = (this.getXpRequireToLvlUp(score) - xp) / xpPerDollar / gbPrice
            score++
            xp = 0
        } while (gbRequire < gbBalance && score <= 100)
        return gbRequire
    }

    calculateNewScore(xpToAdd, currentXp, currentScore) {
        let newScore = currentScore
        while (xpToAdd > this.getXpRequireToLvlUp(newScore) - currentXp) {
            xpToAdd -= (this.getXpRequireToLvlUp(newScore) - currentXp)
            newScore++
            currentXp = 0
        }
        return newScore
    }

    async getPlayerForSaleFiltered(frames, scoreMin, scoreMax, priceMin, priceMax, sold) {
        return await this.marketplaceContract.methods.getPlayerForSaleFiltered(frames, scoreMin, scoreMax, priceMin, priceMax, sold).call();
    }

    async getListedPlayerOfAddress() {
        return await this.marketplaceContract.methods.getListedPlayerOfAddress(false).call();
    }

    async getMarketItem(marketItemId) {
        return await this.marketplaceContract.methods.getMarketItem(marketItemId).call();
    }

    async getListingFees() {
        //return await MarketplaceContract.methods.listingFees().call();
        return 5;
    }

    async mint() {
        const userStore = store.getState().user
        const mintPrice = await this.getMintPrice()
        const mintFees = await this.getMintFees()

        if (parseInt(Web3.utils.toWei(userStore.BUSDBalance, 'ether')) < parseInt(mintFees) && parseInt(Web3.utils.toWei(userStore.GBBalance, 'ether')) < mintPrice * userStore.GBPrice) {
            return
        }
        let allowances = await this.getAllowances(addresses.FootballPlayers)
        if (parseInt(Web3.utils.fromWei(allowances.busd)) < parseInt(Web3.utils.fromWei(mintFees))) {
            await this.approveBusd(addresses.FootballPlayers)
        }
        if (parseInt(Web3.utils.fromWei(allowances.gb)) < Web3.utils.fromWei((mintPrice * userStore.GBPrice).toString())) {
            await this.approveGb(addresses.FootballPlayers)
        }
        store.dispatch(setTransaction({transaction: this.footballPlayersContract.methods.mintPlayer().send()}))
    }

    async listFootballPlayer(price, playerId) {
        if (!price || parseInt(price) <= 0) {
            return
        }
        price = Web3.utils.toWei(price, 'ether')
        if (!await footballHeroesService.marketplaceIsApproved()) {
            await this.approveFootballPlayer(addresses.Marketplace)
        }
        let busdAllowance = await this.getBusdAllowance(addresses.Marketplace)
        if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(await this.getListingFees())) {
            await this.approveBusd(addresses.Marketplace)
        }
        store.dispatch(setTransaction({transaction: this.marketplaceContract.methods.listPlayer(playerId, price).send()}))
    }

    async changePrice(price, itemId) {
        price = Web3.utils.toWei(price, 'ether')
        store.dispatch(setTransaction({transaction: this.marketplaceContract.methods.changePrice(itemId, price).send()}))
    }

    async cancelListing(itemId) {
        store.dispatch(setTransaction({transaction: this.marketplaceContract.methods.cancelListing(itemId).send()}))
    }

    async trainPlayer(trainingGroundId, playerId) {
        store.dispatch(setTransaction({transaction: this.gameContract.methods.trainingGround(trainingGroundId, playerId).send()}))
    }

    async buyPlayer(marketItem) {
        //TODO check price in wei
        if (Web3.utils.toWei(store.getState().user.GBBalance, 'ether') < marketItem.price) {
            return
        }

        let GBAllowance = await this.getGbAllowance(addresses.Marketplace)
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < marketItem.price) {
            await footballHeroesService.approveGb(addresses.Marketplace)
        }
        store.dispatch(setTransaction({transaction: this.marketplaceContract.methods.buyPlayer(marketItem.itemId, marketItem.price).send()}))
    }

    async payToLevelUp(playerId, amount) {
        let GBAllowance = await this.getGbAllowance(addresses.Game)
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < amount * store.getState().user.GBPrice) {
            await footballHeroesService.approveGb(addresses.Game)
        }
        store.dispatch(setTransaction({transaction: this.gameContract.methods.payToLevelUp(playerId, amount).send()}))
    }

    async upgradeFrame(playerId, playerToBurn) {
        let BusdAllowance = await this.getBusdAllowance(addresses.Game)
        if (parseInt(Web3.utils.fromWei(BusdAllowance)) < 30) {
            await footballHeroesService.approveBusd(addresses.Game)
        }
        store.dispatch(setTransaction({transaction: this.gameContract.methods.upgradeFrame(playerId, playerToBurn).send()}))
    }

    async getCompositionList() {
        return await this.gameContract.methods.getCompositions.call()
    }

    async getComposition() {
        return await this.gameContract.methods.getComposition.call()
    }

    async getOpponentFootballTeam(id) {
        return await this.gameContract.methods.getOpponentTeam(id).call()
    }

    async getOpponentFootballTeams() {
        return await this.gameContract.methods.getOpponentTeams().call()
    }

    async refreshOpponentTeams() {
        let GBAllowance = await this.getGbAllowance(addresses.Game)
        let amount = await this.gameContract.methods.refreshOpponentsFee.call()
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < amount * store.getState().user.GBPrice) {
            await footballHeroesService.approveGb(addresses.Game)
        }
        await this.gameContract.methods.refreshOpponents().send()
    }

    async setPlayerTeam(composition, goalkeeper, defenders, midfielders, attackers) {
        store.dispatch(setTransaction({
            transaction: this.gameContract.methods.setPlayerTeam({
                composition: composition,
                goalkeeper: goalkeeper,
                defenders: defenders,
                midfielders: midfielders,
                attackers: attackers,
                currentMatchAvailable: 0,
                lastMatchPlayed: 0
            }).send()
        }))
    }

    async playMatch(opponentTeamId) {
        store.dispatch(setTransaction({transaction: this.gameContract.methods.playMatch(opponentTeamId).send()}))
    }
}

const footballHeroesService = new FootballHeroesService()

export default footballHeroesService
