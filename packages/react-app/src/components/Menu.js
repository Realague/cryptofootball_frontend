import React, {useEffect, useState} from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {abis, addresses} from "@project/contracts";
import {BButton} from "./index";
import useWeb3Modal from "../hooks/useWeb3Modal";
import {connect, useDispatch} from 'react-redux'
import Web3 from "web3";
import GameContract from "../contractInteraction/GameContract";
import FootballPlayerContract from "../contractInteraction/FootballPlayerContract";
import MarketplaceContract from "../contractInteraction/MarketplaceContract";
import ProjectLogo from "../images/projectLogo.jpg"
const CHAIN_ID = 0x61;
const Contract = require('web3-eth-contract');

const networkData =
    [{
        chainId: "0x61",
        chainName: "BSCTESTNET",
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        nativeCurrency: {
            name: "BINANCE COIN",
            symbol: "BNB", decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.bscscan.com/"],
    }];

function WalletButton({provider, loadWeb3Modal, logoutOfWeb3Modal}) {
    const [rendered, setRendered] = useState("");
    const dispatch = useDispatch();

    function saveLoginInfos(account) {
        const action = {
            type: 'LOGIN',
            account: account
        };
        dispatch(action);
    }

    function saveAccountInfo(GBPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId) {
        const action = {
            type: 'ACCOUNTINFO',
            GBPrice: GBPrice,
            rewards: rewards,
            claimFee: claimFee,
            GBBalance: GBBalance,
            BUSDBalance: BUSDBalance,
            playersId: playersId
        };
        dispatch(action);
    }

    async function readOnChainData(account) {
        let contract = new Contract(abis.erc20, addresses.BUSDTestnet);
        let BUSDBalance = await contract.methods.balanceOf(account).call();
        BUSDBalance = Web3.utils.fromWei(BUSDBalance);
        contract = new Contract(abis.erc20, addresses.GBTOKEN);
        let GBBalance = await contract.methods.balanceOf(account).call();
        GBBalance = Web3.utils.fromWei(GBBalance);
        let GBPrice = await GameContract.getFootballTokenPrice();
        let claimFee = await GameContract.getClaimFee(account);
        let rewards = await GameContract.getRewards(account);
        let playersId = await FootballPlayerContract.getFootballPlayerList(account);
        saveAccountInfo(GBPrice, rewards, claimFee, GBBalance, BUSDBalance, playersId);
    }

    useEffect(() => {

        async function fetchAccount() {
            try {
                if (!provider) {
                    return;
                }
                if (GameContract.getContract()) {
                    return;
                }

                const accounts = await provider.eth.getAccounts();
                Contract.setProvider(provider, accounts[0]);
                GameContract.setProvider(provider, accounts[0]);
                FootballPlayerContract.setProvider(provider, accounts[0]);
                MarketplaceContract.setProvider(provider, accounts[0]);

                // Subscribe to accounts change
                provider.currentProvider.on("accountsChanged", (accounts) => {
                    saveLoginInfos(accounts[0]);
                    readOnChainData(accounts[0]);
                    setRendered(accounts[0].substring(0, 6) + "..." + accounts[0].substring(36));
                });

                // Subscribe to chainId change
                provider.currentProvider.on("chainChanged", (chainId) => {
                    console.log(chainId);
                    if (chainId !== networkData[0].chainId) {
                        window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: networkData
                        });
                    }
                });
                
                let chainId = await provider.eth.getChainId();
                if (CHAIN_ID !== chainId) {
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: networkData
                    });
                }

                setRendered(accounts[0].substring(0, 6) + "..." + accounts[0].substring(36));
                saveLoginInfos(accounts[0]);
                readOnChainData(accounts[0]);
            } catch (err) {
                setRendered("");
                logoutOfWeb3Modal();
                console.error(err);
            }
        }

        fetchAccount();
    }, [provider, setRendered]);

    return (
        <BButton
            onClick={() => {
                if (!provider) {
                    loadWeb3Modal();
                } else {
                    logoutOfWeb3Modal();
                }
            }}
        >
            {rendered === "" && "Connect Wallet"}
            {rendered !== "" && rendered}
        </BButton>
    );
}

function Menu(props) {
    const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    return (
        <div>
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/collection">
                            <img src={ProjectLogo} alt="" className="nav-logo" style={{borderRadius: 100, float: "inline-start"}}/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/collection">Collection</Nav.Link>
                                <Nav.Link href="/match">Match</Nav.Link>
                                <Nav.Link href="/marketplace">Marketplace</Nav.Link>
                                <Nav.Link href="/claims">Claim tokens</Nav.Link>
                                <Nav.Link href="https://footballheroes.gitbook.io/footballheroes/">Whitepaper</Nav.Link>
                            </Nav>
                            <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal}
                                          logoutOfWeb3Modal={logoutOfWeb3Modal}/>
                            <div className="noselect">{"gggggg"}</div>
                            <Button variant="secondary">GB: ${parseFloat(props.GBPrice).toFixed(2)}</Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    GBPrice: state.pReducer.GBPrice
});

export default connect(mapStateToProps)(Menu);
