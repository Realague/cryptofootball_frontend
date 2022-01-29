/* eslint-disable */
import React, {createRef, forwardRef, useEffect, useState} from 'react'
import {
    Box,
    Divider,
    Fade, Grid,
    Input,
    InputAdornment,
    Modal,
    Slide, Slider,
    Stack,
    Typography, useMediaQuery
} from '@mui/material'
import {darkModalNoFlex} from '../../../css/style'
import Button from '@mui/material/Button'
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import footballHeroesService from '../../../services/FootballPlayerService'
import {Done} from "@mui/icons-material";
import {useTheme} from "@emotion/react";
import PlayerListItem from "../../../layout/teamDrawer/components/PlayerListItem";
import {addPlayerToTeam, removePlayerFromTeamById} from "../../../features/gameSlice";
import Strategy from "../../../enums/Strategy";


const InformationModal = ({open, onClose, frame, isInTeam, player, marketItem, mobile}) => {
    const {account, GBBalance, GBPrice} = useSelector(state => state.user)
    const {team} = useSelector(state => state.game)
    const [action, setAction] = useState(undefined)
    const [maxGBToConsume, setMaxGBToConsume] = useState(0)
    const xpPerDollar = 50
    const ref = createRef()
    const informationRef = createRef()
    const [informationShown, setInformationShown] = useState(true)
    const sellForm = useForm({mode: 'onChange'})
    const dispatch = useDispatch()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        setMaxGBToConsume(footballHeroesService.getMaxGbToConsumeForLvlUp(+GBPrice, +GBBalance, +xpPerDollar, +player.score, +player.xp))
    }, [])

    const chooseAction = (value) => {
        setAction(action === value ? undefined : value)
        if (value === undefined) {
        }
    }

    const InformationContent = (
        <Stack display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center"
               justifyContent="center" width="240px">
            <Typography variant="h6">Actions</Typography>
            <Divider flexItem color="primary"/>

            {
                isInTeam ?
                    <Button hidden={marketItem !== undefined}
                            onClick={() => dispatch(removePlayerFromTeamById(player.id))}
                            fullWidth
                            color="secondary"
                            variant="outlined"
                    >
                        Remove from team
                    </Button>
                    :
                <Button hidden={marketItem !== undefined}
                        onClick={() => {
                            dispatch(addPlayerToTeam(player))
                        }}
                        color="secondary"
                        fullWidth
                        disabled={
                            team.players.length === 11 ||
                            team.strategy === undefined ||
                            Strategy.Strategies.find(s => s.id === team.strategy).composition[player.position] <= team.players.filter(p => p.position === player.position).length
                        }
                        variant="outlined"
                >
                   Add to team
                </Button>
            }

            <Button hidden={marketItem !== undefined} disabled={+player.score === 100} onClick={() => chooseAction('level-up')} fullWidth color="primary"
                    variant="contained">Level
                Up</Button>
            <Button hidden={marketItem !== undefined} disabled={+player.frame === 4} onClick={() => chooseAction('improve-frame')} fullWidth
                    color="primary" variant="contained">Improve
                Frame</Button>
            <Button hidden={marketItem !== undefined} disabled={+player.stamina < 20} onClick={() => chooseAction('train')} fullWidth color="primary"
                    variant="contained">Train</Button>
            <Button hidden={marketItem !== undefined} onClick={() => chooseAction('sell')} fullWidth color="secondary"
                    variant="contained"
                    my={4}>Sell</Button>
            <Button hidden={marketItem === undefined || marketItem.seller !== account}
                    onClick={() => chooseAction('sell')} fullWidth color="secondary" variant="contained"
                    my={4}>Change price</Button>
            <Button hidden={marketItem === undefined || marketItem.seller !== account}
                    onClick={() => footballHeroesService.cancelListing(marketItem.itemId)} fullWidth
                    color="secondary" variant="contained"
                    my={4}>Cancel listing</Button>
            <Button hidden={marketItem === undefined || marketItem.seller === account}
                    onClick={() => footballHeroesService.buyPlayer(marketItem)} fullWidth
                    color="secondary" variant="contained"
                    my={4}>Buy</Button>
            <Divider flexItem color="primary"/>
            <Button onClick={() => onClose()} fullWidth color="error" variant="outlined" my={4}>Close</Button>
        </Stack>
    )

    const LayoutContent = forwardRef(({children, description, name, width = "240px"}, ref) => (
        <Stack ref={ref} display="flex" height={'100%'} spacing={2} flexDirection="column" alignItems="center"
               justifyContent="center" width={width}>
            <Typography variant="h6">{name}</Typography>
            {
                description !== undefined &&
                <Typography variant="caption">{description}</Typography>
            }
            <Divider flexItem color="primary"/>
            {children}
            <Divider flexItem color="primary"/>
            <Button onClick={() => chooseAction(undefined)} fullWidth color="secondary"
                    variant="contained">Back</Button>
        </Stack>
    ))

    const LevelUpContent = forwardRef(({children}, ref) => {
        const [sliderValue, setSliderValue] = useState(0)

        const handleBlur = () => {
            if (sliderValue < 1) {
                setSliderValue(1)
            } else if (sliderValue > maxGBToConsume) {
                setSliderValue(maxGBToConsume)
            }
        }

        const handleInputChange = (event) => {
            setSliderValue(event.target.value === '' ? '' : Number(event.target.value))
        }

        const handleSliderChange = (event, newValue) => {
            setSliderValue(newValue)
        }

        return (<LayoutContent name="Level Up" ref={ref}>
            <Typography id="input-slider" gutterBottom>
                GB Token to use
            </Typography>
            <Grid container spacing={2} alignItems="center" columns={10} px={1}>
                <Grid item xs={6}>
                    <Slider
                        value={typeof sliderValue === 'number' ? sliderValue : 1}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        max={maxGBToConsume}
                        min={1}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Input
                        value={sliderValue}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: maxGBToConsume,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
            <Stack spacing={2} alignItems="center">
                <Typography gutterBottom>
                    xp gained: {sliderValue * xpPerDollar / GBPrice}
                </Typography>
                <Typography gutterBottom>
                    lvl
                    gained: {footballHeroesService.calculateNewScore(sliderValue * xpPerDollar / GBPrice, player.xp, player.score) - player.score}
                </Typography>
            </Stack>
            <Button fullWidth color="primary" variant="contained"
                    onClick={() => footballHeroesService.payToLevelUp(player.id, sliderValue / GBPrice)}>Confirm</Button>
        </LayoutContent>)
    })

    const ImproveFrameContent = forwardRef(({children}, ref) => {
        const { collection } = useSelector(state => state.game)
        const compatiblePlayer = collection.filter(p =>
            p.imageId == player.imageId
            && p.rarity == player.rarity
            && p.frame == player.frame
            && p.position == player.position
            && p.id != player.id
            && p.isAvailable === true
        )

        return (
        <LayoutContent description="Selected player will be deleted" name="Improve Frame" width="100%" ref={ref}>
                <Stack spacing={1} height="200px" sx={{overflowY: 'scroll'}}>
                    {
                        compatiblePlayer.map(p =>(
                    <PlayerListItem
                        key={p.id}
                        player={p}
                        onClick={async () => {
                            await footballHeroesService.upgradeFrame(player.id, p.id)
                            chooseAction(undefined)
                        }}
                        icon={<Done/>}
                    />
                    ))
                    }
                </Stack>

        </LayoutContent>
    )})

    const TrainContent = forwardRef(({children}, ref) => (
        <LayoutContent name="Train" ref={ref}>
            {
                +player.currentStamina < 20 ?
                    <Typography variant="subtitle1" color="error" textAlign="center">This player doesn't have enough stamina to train.</Typography>
                    :
                    <>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={() => footballHeroesService.trainPlayer(0, player.id)}
                        >
                            Easy (xp and rewards x1)
                        </Button>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={() => footballHeroesService.trainPlayer(1, player.id)}
                        >
                            Medium (xp and rewards x1.5)
                        </Button>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={() => footballHeroesService.trainPlayer(2, player.id)}
                        >
                            Hard (xp and rewards x2)
                        </Button>
                    </>
            }
        </LayoutContent>
    ))

    const SellContent = forwardRef(({children}, ref) => (
            <LayoutContent name="Sell" ref={ref}>
                <Input
                    error={sellForm.formState.errors.price !== undefined}
                    type="number"
                    name="price"
                    {...sellForm.register('price', {required: true, minLength: 1})}
                    fullWidth
                    startAdornment={<InputAdornment position="start">$GB</InputAdornment>}
                />
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        marketItem === undefined ? footballHeroesService.listFootballPlayer(sellForm.getValues().price, player.id) : footballHeroesService.changePrice(sellForm.getValues().price, marketItem.itemId)
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
            width={mobile ? '95vw' : '800px'}
            height={'600px'}
        >
            <Fade in={open}>
                <Stack sx={darkModalNoFlex} spacing={4} display="flex" direction="row" justifyContent="space-around"
                       alignItems="center">
                    {
                        !mobile &&
                        <Box width="240px">
                            {frame()}
                        </Box>
                    }

                    <Box ref={informationRef} width={action === 'improve-frame' ? isMobile ? '240px' : '400px' : '240px'} height={'400px'} overflow={'hidden'}>
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
