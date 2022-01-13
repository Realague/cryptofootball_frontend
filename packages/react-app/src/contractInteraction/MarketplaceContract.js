import {abis, addresses} from "@project/contracts";
import Contract from "web3-eth-contract";

let MarketplaceContract;

function setProvider(provider, account) {
    Contract.setProvider(provider);
    MarketplaceContract = new Contract(abis.marketplace, addresses.Marketplace, {from: account})
}

async function getPlayerForSaleFiltered(frames, scoreMin, scoreMax, priceMin, priceMax, sold) {
    return await MarketplaceContract.methods.getPlayerForSaleFiltered(frames, scoreMin, scoreMax, priceMin, priceMax, sold).call();
}

async function getListedPlayerOfAddress() {
    return await MarketplaceContract.methods.getListedPlayerOfAddress(false).call();
}

async function getMarketItem(marketItemId) {
    return await MarketplaceContract.methods.getMarketItem(marketItemId).call();
}

async function getListingFees() {
    //return await MarketplaceContract.methods.listingFees().call();
    return 5;
}

function getContract() {
    return MarketplaceContract;
}


export default { getPlayerForSaleFiltered, getMarketItem, setProvider, getContract, getListedPlayerOfAddress, getListingFees };