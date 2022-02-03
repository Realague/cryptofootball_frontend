import web3Contract from 'web3-eth-contract'
import {abis, addresses} from "@project/contracts";
import Web3 from "web3";
import {setTransaction, setTransactionState} from "../features/settingsSlice";
import {store} from "../store";
import Position from "../enums/Position";
import {fetchData, resetTeam} from "../features/gameSlice";

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
        return await this.gameContract.methods.getClaimCooldown().call()
    }

    claimRewards() {
        store.dispatch({transaction: this.gameContract.methods.claimReward().send()})
    }

    async getRewards() {
        return await this.gameContract.methods.getRewards().call()
    }

    async getGBExactPrice() {
        return await this.footballPlayersContract.methods.getExactPrice().call()
    }

    async isLevelUpOpen() {
        return await this.footballPlayersContract.methods.levelUpOpen().call()
    }

    async isMintOpen() {
        return await this.footballPlayersContract.methods.mintOpen().call()
    }

    async isMarketplaceOpen() {
        return await this.marketplaceContract.methods.marketplaceOpen().call()
    }

    async isTrainingOpen() {
        return await this.gameContract.methods.trainingOpen().call()
    }

    async isFootballMatchOpen() {
        return await this.gameContract.methods.isMatchOpen().call()
    }

    async isUpgradeFrameOpen() {
        return await this.footballPlayersContract.methods.upgradeFrameOpen().call()
    }

    async footballPlayerIsApproved(consumer) {
        return await this.footballPlayersContract.methods.isApprovedForAll(this.address, consumer).call()
    }

    async getRemainingClaimCooldown() {
        return await this.gameContract.methods.getRemainingClaimCooldown().call();
    }

    getCurrentStamina(playerId) {
        return this.gameContract.methods.getCurrentStamina(playerId).call();
    }

    getXpRequireToLvlUp(score) {
        return score * (score / 3);
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
        return await this.marketplaceContract.methods.listingFees().call();
    }

    async mint() {
        try {
            const userStore = store.getState().user
            store.dispatch(setTransactionState(true))
            const result = await Promise.all([this.getMintPrice(), this.getMintFees()])
            if (parseInt(Web3.utils.toWei(userStore.BUSDBalance, 'ether')) < parseInt(result[1]) && parseInt(Web3.utils.toWei(userStore.GBBalance, 'ether')) < result[0] * userStore.GBPrice) {
                return
            }
            let allowances = await this.getAllowances(addresses.FootballPlayers)
            if (parseInt(Web3.utils.fromWei(allowances.busd)) < parseInt(Web3.utils.fromWei(result[1]))) {
                await this.approveBusd(addresses.FootballPlayers)
            }
            if (parseInt(Web3.utils.fromWei(allowances.gb)) < Web3.utils.fromWei((result[0] * userStore.GBPrice).toString())) {
                await this.approveGb(addresses.FootballPlayers)
            }
            store.dispatch(setTransaction({transaction: this.footballPlayersContract.methods.mintPlayer().send()}))
        } catch (e) {
            throw e
        } finally {
            store.dispatch(setTransactionState(false))
        }
      }

    async mintTeam(composition) {
        try {
            store.dispatch(setTransactionState(true))
            const userStore = store.getState().user
            const result = await Promise.all([this.getMintPrice(), this.getMintFees()])
            if (parseInt(Web3.utils.toWei(userStore.BUSDBalance, 'ether')) < parseInt(result[1]) && parseInt(Web3.utils.toWei(userStore.GBBalance, 'ether')) < result[0] * userStore.GBPrice) {
                return
            }
            let allowances = await this.getAllowances(addresses.FootballPlayers)
            if (parseInt(Web3.utils.fromWei(allowances.busd)) < parseInt(Web3.utils.fromWei(result[1]))) {
                await this.approveBusd(addresses.FootballPlayers)
            }
            if (parseInt(Web3.utils.fromWei(allowances.gb)) < Web3.utils.fromWei((result[0] * userStore.GBPrice).toString())) {
                await this.approveGb(addresses.FootballPlayers)
            }
            store.dispatch(setTransaction({transaction: this.footballPlayersContract.methods.mintTeam(composition, addresses.Game).send()}))
        } catch (e) {
            throw e
        } finally {
            store.dispatch(setTransactionState(false))
        }
     }

    async listFootballPlayer(price, playerId) {
        if (!price || parseInt(price) <= 0) {
            return
        }
        price = Web3.utils.toWei(price, 'ether')
        if (!await this.marketplaceIsApproved()) {
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

    async trainPlayer(trainingGroundId, playerId, useAllStamina = false) {
        store.dispatch(setTransaction({transaction: this.gameContract.methods.trainingGround(trainingGroundId, playerId, useAllStamina).send()}))
    }

    async buyPlayer(marketItem) {
        //TODO check price in wei
        if (Web3.utils.toWei(store.getState().user.GBBalance, 'ether') < marketItem.price) {
            return
        }

        let GBAllowance = await this.getGbAllowance(addresses.Marketplace)
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < marketItem.price) {
            await this.approveGb(addresses.Marketplace)
        }
        store.dispatch(setTransaction({transaction: this.marketplaceContract.methods.buyPlayer(marketItem.itemId, marketItem.price).send()}))
    }

    async payToLevelUp(playerId, amount) {
        let GBAllowance = await this.getGbAllowance(addresses.FootballPlayers)
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < amount * store.getState().user.GBPrice) {
            await this.approveGb(addresses.FootballPlayers)
        }
        store.dispatch(setTransaction({transaction: this.footballPlayersContract.methods.payToLevelUp(playerId, amount).send()}))
    }

    async upgradeFrame(playerId, playerToBurn) {
        try {
            store.dispatch(setTransactionState(true))
            const result = await Promise.all([
                this.getBusdAllowance(addresses.FootballPlayers),
                this.getGbAllowance(addresses.FootballPlayers),
                this.footballPlayerIsApproved(addresses.FootballPlayers)
            ])
            let BusdAllowance = result[0]
            if (parseInt(Web3.utils.fromWei(BusdAllowance)) < 30) {
                await this.approveBusd(addresses.FootballPlayers)
            }
            //TODO check  real amount
            let GBAllowance = result[1]
            if (parseInt(Web3.utils.fromWei(GBAllowance)) < 30 * store.getState().user.GBPrice) {
                await this.approveGb(addresses.FootballPlayers)
            }
            let isApproved = result[3]
            if (!isApproved) {
                await this.approveFootballPlayer(addresses.FootballPlayers)
            }
            store.dispatch(setTransaction({transaction: this.footballPlayersContract.methods.upgradeFrame(playerId, playerToBurn).send()}))
        } catch (e) {
            throw e
        } finally {
            store.dispatch(setTransactionState(false))
        }
      }

    async getCompositionList() {
        return await this.gameContract.methods.getCompositions().call()
    }

    async getComposition(id) {
        return await this.gameContract.methods.getComposition(id).call()
    }

    async getPlayerTeam() {
        return await this.gameContract.methods.getPlayerTeam().call()
    }

    async getOpponentFootballTeam(id) {
        return await this.gameContract.methods.getOpponentTeam(id).call()
    }

    async getOpponentFootballTeams() {
        return await this.gameContract.methods.getOpponentTeams().call()
    }

    async getOpponentPlayer(id) {
        return await this.gameContract.methods.getOpponentPlayer(id).call()
    }

    async convertPlayersIdToComposition(team) {
        if (team.players.length !== 11) {
            return undefined
        }
        const composition = {
            goalkeeper: undefined,
            defenders: [],
            midfielders: [],
            attackers: [],
        }

        for (const p of team.players) {
            switch (+p.position) {
                case Position.Attacker.id:
                    composition.attackers.push({ ...(await this.getFootballPlayer(+p.id)) })
                    break
                case Position.Midfielder.id:
                    composition.midfielders.push({ ...(await this.getFootballPlayer(+p.id)) })
                    break
                case Position.Defender.id:
                    composition.defenders.push({ ...(await this.getFootballPlayer(+p.id)) })
                    break
                case Position.GoalKeeper.id:
                    composition.goalkeeper = { ...(await this.getFootballPlayer(+p.id)) }
                    break
            }
        }
        return composition
    }

    async populateComposition(composition) {
        const compo = {
            goalkeeper: undefined,
            defenders: [],
            midfielders: [],
            attackers: [],
        }
        console.log(composition)
        for (const key of ['defenders', 'midfielders', 'attackers']) {
            compo[key] = composition[key].map(async pId => await footballHeroesService.getFootballPlayer(pId))
        }
        compo.goalkeeper = await footballHeroesService.getFootballPlayer(composition.goalkeeper)
        return compo
    }

    async resetTeam() {
        store.dispatch(setTransaction({
            name: 'resetTeam',
            transaction: this.gameContract.methods.resetTeam().send()
        }))
    }

    async refreshOpponentTeams() {
        let GBAllowance = await this.getGbAllowance(addresses.Game)
        let amount = await this.gameContract.methods.refreshOpponentsFee.call()
        if (parseInt(Web3.utils.fromWei(GBAllowance)) < amount * store.getState().user.GBPrice) {
            await this.approveGb(addresses.Game)
        }
        await this.gameContract.methods.refreshOpponents().send()
    }

    async setPlayerTeam(composition, goalkeeper, defenders, midfielders, attackers) {
        console.log({
            composition: composition,
            goalkeeper: goalkeeper,
            defenders: defenders,
            midfielders: midfielders,
            attackers: attackers,
            currentMatchAvailable: 0,
            lastMatchPlayed: 0
        })
        store.dispatch(setTransaction({
            transaction: this.gameContract.methods.setPlayerTeam([
                composition,
                goalkeeper,
                attackers,
                midfielders,
                defenders,
                0,
                0
            ]).send()
        }))
    }

    async playMatch(opponentTeamId) {
        store.dispatch(setTransaction({transaction: this.gameContract.methods.playMatch(opponentTeamId).send()}))
    }
}

let footballHeroesService = new FootballHeroesService()

export default footballHeroesService
