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
    Typography
} from '@mui/material'
import {darkModalNoFlex} from '../../../css/style'
import Button from '@mui/material/Button'
import {useForm} from 'react-hook-form'
import {useSelector} from 'react-redux'
import footballHeroesService from '../../../services/FootballPlayerService'


const InformationModal = ({open, onClose, frame, player, marketItem}) => {
    const {account, GBBalance, GBPrice} = useSelector(state => state.user)
    const [action, setAction] = useState(undefined)
    const [maxGBToConsume, setMaxGBToConsume] = useState(0)
    const xpPerDollar = 50
    const ref = createRef()
    const informationRef = createRef()
    const [informationShown, setInformationShown] = useState(true)
    const sellForm = useForm({mode: 'onChange'})

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
