import React, {createRef, forwardRef, useState} from 'react'
import {
    Box,
    Divider,
    easing,
    Fade, FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Modal,
    Paper,
    Slide,
    Stack,
    Typography
} from '@mui/material'
import {darkModalNoFlex} from '../../../css/style'
import Button from '@mui/material/Button'
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import Web3 from "web3";
import Contract from "web3-eth-contract";
import {abis, addresses} from "@project/contracts";
import FootballPlayerContract from "../../../contractInteraction/FootballPlayerContract";
import Marketplace from "../../../contractInteraction/MarketplaceContract";
import {setTransaction} from "../../../features/gameSlice";
import GameContract from "../../../contractInteraction/GameContract";
import MarketplaceContract from "../../../contractInteraction/MarketplaceContract";


const InformationModal = ({open, onClose, frame, player, marketItem}) => {
    const {account, GBBalance} = useSelector(state => state.user)
    const [action, setAction] = useState(undefined)
    const ref = createRef()
    const informationRef = createRef()
    const [informationShown, setInformationShown] = useState(true)
    const sellForm = useForm({mode: 'onChange'})
    const dispatch = useDispatch()

    const chooseAction = (value) => {
        setAction(action === value ? undefined : value)
        if (value === undefined) {
        }
    }

    const cancelListing = () => {
        dispatch(setTransaction({transaction: Marketplace.getContract().methods.cancelListing(marketItem.itemId).send({from: account})}))
    }

    const trainPlayer = (trainingGroundId) => {
        dispatch(setTransaction({transaction: GameContract.getContract().methods.trainingGround(trainingGroundId, player.id).send({from: account})}))
    }

    const buyPlayer = async () => {
        //TODO check price in wei
        if (Web3.utils.toWei(GBBalance, 'ether') < marketItem.price) {
            return
        }

        let GBToken = new Contract(abis.erc20, addresses.GBTOKEN)
        let GBAllowance = await GBToken.methods.allowance(account, addresses.Marketplace).call()

        if (parseInt(GBAllowance) < marketItem.price) {
            let transaction = GBToken.methods.approve(addresses.Marketplace, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
            dispatch(setTransaction({transaction: transaction}))
            await transaction
        }
        dispatch(setTransaction({transaction: MarketplaceContract.getContract().methods.buyPlayer(marketItem.itemId, marketItem.price).send({from: account})}))
    }

    const InformationContent = (
        <Stack display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center"
               justifyContent="center" width="240px">
            <Typography variant="h6">Actions</Typography>
            <Divider flexItem color="primary"/>
            <Button hidden={marketItem !== undefined} onClick={() => chooseAction('level-up')} fullWidth color="primary"
                    variant="contained">Level
                Up</Button>
            <Button hidden={marketItem !== undefined} onClick={() => chooseAction('improve-frame')} fullWidth
                    color="primary" variant="contained">Improve
                Frame</Button>
            <Button hidden={marketItem !== undefined} onClick={() => chooseAction('train')} fullWidth color="primary"
                    variant="contained">Train</Button>
            <Button hidden={marketItem !== undefined} onClick={() => chooseAction('sell')} fullWidth color="secondary"
                    variant="contained"
                    my={4}>Sell</Button>
            <Button hidden={marketItem === undefined || marketItem.seller !== account}
                    onClick={() => chooseAction('sell')} fullWidth color="secondary" variant="contained"
                    my={4}>Change price</Button>
            <Button hidden={marketItem === undefined || marketItem.seller !== account} onClick={cancelListing} fullWidth
                    color="secondary" variant="contained"
                    my={4}>Cancel listing</Button>
            <Button hidden={marketItem === undefined || marketItem.seller === account} onClick={buyPlayer} fullWidth
                    color="secondary" variant="contained"
                    my={4}>Buy</Button>
            <Divider flexItem color="primary"/>
            <Button onClick={() => onClose()} fullWidth color="error" variant="outlined" my={4}>Close</Button>
        </Stack>
    )

    const listFootballPlayer = async (price) => {
        console.log(price)
        if (!price || parseInt(price) <= 0) {
            return
        }
        price = Web3.utils.toWei(price, 'ether')
        let BUSDTestnet = new Contract(abis.erc20, addresses.BUSDTestnet)
        if (!await FootballPlayerContract.isApprovedForAll(account)) {
            let transaction = FootballPlayerContract.getContract().methods.setApprovalForAll(addresses.Marketplace, true).send({from: account})
            dispatch(setTransaction({transaction: transaction}))
            await transaction
        }
        let busdAllowance = await BUSDTestnet.methods.allowance(account, addresses.Marketplace).call()
        if (parseInt(Web3.utils.fromWei(busdAllowance)) < parseInt(await Marketplace.getListingFees())) {
            let transaction = BUSDTestnet.methods.approve(addresses.Marketplace, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from: account})
            dispatch(setTransaction({transaction: transaction}))
            await transaction
        }
        dispatch(setTransaction({transaction: Marketplace.getContract().methods.listPlayer(player.id, price).send({from: account})}))
    }
    const changePrice = (price) => {
        price = Web3.utils.toWei(price, 'ether')
        dispatch(setTransaction({transaction: Marketplace.getContract().methods.changePrice(marketItem.itemId, price).send({from: account})}))
    }

    const LayoutContent = forwardRef(({children, name}, ref) => (
        <Stack ref={ref} display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center"
               justifyContent="center" width="240px">
            <Typography variant="h6">{name}</Typography>
            <Divider flexItem color="primary"/>
            {children}
            <Divider flexItem color="primary"/>
            <Button onClick={() => chooseAction(undefined)} fullWidth color="secondary"
                    variant="contained">Back</Button>
        </Stack>
    ))

    const LevelUpContent = forwardRef(({children}, ref) => (
        <LayoutContent name="Level Up" ref={ref}>
            <Button fullWidth color="primary" variant="contained">Confirm</Button>
        </LayoutContent>
    ))

    const ImproveFrameContent = forwardRef(({children}, ref) => (
        <LayoutContent name="Improve Frame" ref={ref}>
            <Button fullWidth color="primary" variant="contained">Confirm</Button>
        </LayoutContent>
    ))

    const TrainContent = forwardRef(({children}, ref) => (
        <LayoutContent name="Train" ref={ref}>
            <Button fullWidth color="primary" variant="contained">Confirm</Button>
        </LayoutContent>
    ))

    const SellContent = forwardRef(({children}, ref) => (
            <LayoutContent name="Sell" ref={ref}>
                <Input
                    error={sellForm.formState.errors.price !== undefined}
                    type="number"
                    name="price"
                    {...sellForm.register("price", {required: true, minLength: 1})}
                    fullWidth
                    startAdornment={<InputAdornment position="start">$GB</InputAdornment>}
                />
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                        onClick={() => {
                        marketItem === undefined ? listFootballPlayer(sellForm.getValues().price) : changePrice(sellForm.getValues().price)
                    }}
                >
                    Confirm
                </Button>
            </LayoutContent>
        )
    )


    return (
        <Modal
            closeAfterTransition
            open={open}
            onClose={onClose}
            BackdropProps={{
                timeout: 500,
            }}
            width={'600px'}
            height={'600px'}
        >
            <Fade in={open}>
                <Stack sx={darkModalNoFlex} spacing={4} display="flex" direction="row" justifyContent="space-around"
                       alignItems="center">
                    <Box width="240px">
                        {frame()}
                    </Box>
                    <Box ref={informationRef} width="240px" height={'400px'} overflow={'hidden'}>
                        <Slide
                            in={action === undefined && informationShown}
                            onExited={() => {
                                setInformationShown(false)
                            }}
                            container={informationRef.current}
                            direction="right"
                            mountOnEnter
                            unmountOnExit
                        >
                            {InformationContent}
                        </Slide>
                        {
                            [
                                ['level-up', <LevelUpContent ref={ref}/>],
                                ['improve-frame', <ImproveFrameContent ref={ref}/>],
                                ['train', <TrainContent ref={ref}/>],
                                ['sell', <SellContent ref={ref}/>]
                            ].map((a, i) => (
                                <Slide
                                    in={!informationShown && action === a[0]}
                                    onExited={() => {
                                        setInformationShown(true)
                                    }}
                                    container={informationRef.current}
                                    direction="left"
                                    mountOnEnter
                                    unmountOnExit
                                    key={i}
                                >
                                    {a[1]}
                                </Slide>
                            ))
                        }
                    </Box>

                </Stack>
            </Fade>
        </Modal>
    )
}

export default InformationModal
