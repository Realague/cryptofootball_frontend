import React, {useEffect, useState} from 'react';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDefaultProvider} from "@ethersproject/providers";
import {Contract} from "@ethersproject/contracts";
import {abis, addresses} from "../contracts";
import {Button} from "./index";
import {useQuery} from "@apollo/react-hooks";
import useWeb3Modal from "../hooks/useWeb3Modal";
import GET_TRANSFERS from "../graphql/subgraph";
import {render} from "react-dom";
import AccountInfo from "./AccountInfo";

async function readOnChainData() {
    // Should replace with the end-user wallet, e.g. Metamask
    const defaultProvider = getDefaultProvider();
    // Create an instance of an ethers.js Contract
    // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
    const busdTestnet = new Contract(addresses.BUSDTestnet, abis.erc20, defaultProvider);
    // A pre-defined address that owns some CEAERC20 tokens
    const tokenBalance = await busdTestnet.balanceOf("0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C");
    console.log({tokenBalance: tokenBalance.toString()});
}

const chainId = 56;

const networkData =
    [{
        chainId: "0x38",
        chainName: "BSCMAINET",
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        nativeCurrency: {
            name: "BINANCE COIN",
            symbol: "BNB", decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com/"],
    }];

function WalletButton({provider, loadWeb3Modal, logoutOfWeb3Modal}) {
    const [account, setAccount] = useState("");
    const [rendered, setRendered] = useState("");

    useEffect(() => {

        async function fetchAccount() {
            try {
                if (!provider) {
                    return;
                }

                // Subscribe to accounts change
                provider.currentProvider.on("accountsChanged", (accounts: string[]) => {
                    console.log(accounts);
                    setAccount(accounts[0]);
                });

                // Subscribe to chainId change
                provider.currentProvider.on("chainChanged", (chainId: number) => {
                    console.log(chainId);
                    if (chainId !== networkData[0].chainId) {
                        console.log("Wrong chain")
                        window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: networkData
                        });
                    }
                });

                // Subscribe to provider connection
                provider.currentProvider.on("connect", (info: { chainId: number }) => {
                    if (info.chainId !== networkData[0].chainId) {
                        console.log("Wrong chain")
                        window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: networkData
                        });
                    } else {
                        fetchAccount();
                    }
                });

                // Subscribe to provider disconnection
                provider.currentProvider.on("disconnect", (error: { code: number; message: string }) => {
                    setAccount("");
                    setRendered("");
                    logoutOfWeb3Modal();
                    console.log(error);
                });

                let chainId = await provider.eth.getChainId();
                if (chainId !== chainId) {
                    console.log("Wrong chain")
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: networkData
                    });
                }

                const accounts = await provider.eth.getAccounts();
                setAccount(accounts[0]);
                setRendered(account.substring(0, 6) + "..." + account.substring(36));
            } catch (err) {
                setAccount("");
                setRendered("");
                console.error(err);
            }
        }

        fetchAccount();
    }, [account, provider, setAccount, setRendered]);

    return (
        <Button
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
        </Button>
    );
}


function Menu() {
    const {loading, error, data} = useQuery(GET_TRANSFERS);
    const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

    React.useEffect(() => {
        if (!loading && !error && data && data.transfers) {
            console.log({transfers: data.transfers});
        }
    }, [loading, error, data]);

    return (
        <div>
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Super Football</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#Collection">Collection</Nav.Link>
                                <Nav.Link href="#Train">Train</Nav.Link>
                                <Nav.Link href="#Match">Match</Nav.Link>
                                <Nav.Link href="#Marketplace">Marketplace</Nav.Link>
                                <Nav.Link href="#Staking">Staking</Nav.Link>
                                <Nav.Link href="#Claims">Claim tokens</Nav.Link>
                                <Nav.Link href="https://julien-delane.gitbook.io/footballheroes/">Whitepaper</Nav.Link>
                            </Nav>
                            <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>
                            <div>Buy token</div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </div>
    )
}

export default Menu;