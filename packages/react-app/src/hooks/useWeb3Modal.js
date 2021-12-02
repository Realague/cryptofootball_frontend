import {Web3Provider} from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {useCallback, useEffect, useState} from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";

const NETWORK = "binance";

function useWeb3Modal(config = {}) {
    const [provider, setProvider] = useState();
    const [autoLoaded, setAutoLoaded] = useState(false);
    const {autoLoad = true, network = NETWORK} = config;

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    56: 'https://bsc-dataseed.binance.org/',
                },
                network: 'binance',
                chainId: 56
            }
        }
    };

    const web3Modal = new Web3Modal({
        network,
        cacheProvider: true, // optional
        providerOptions // required
    });

    // Open wallet selection modal.
    const loadWeb3Modal = useCallback(async () => {
        const newProvider = await web3Modal.connect();
        setProvider(new Web3(newProvider));
    }, [web3Modal]);

    const logoutOfWeb3Modal = useCallback(
        async function () {
            await web3Modal.clearCachedProvider();
            window.location.reload();
        },
        [web3Modal],
    );

    // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
    useEffect(() => {
        if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
            loadWeb3Modal();
            setAutoLoaded(true);
        }
    }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

    return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
