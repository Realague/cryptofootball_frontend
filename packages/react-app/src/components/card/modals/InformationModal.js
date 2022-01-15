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

const InformationModal = ({open, onClose, frame}) => {
    const [action, setAction] = useState(undefined)
    const ref = createRef()
    const informationRef = createRef()
    const [informationShown, setInformationShown] = useState(true)
    const sellForm = useForm({ mode: 'onChange' })

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
            <Button onClick={() => chooseAction('level-up')} fullWidth color="primary" variant="contained">Level
                Up</Button>
            <Button onClick={() => chooseAction('improve-frame')} fullWidth color="primary" variant="contained">Improve
                Frame</Button>
            <Button onClick={() => chooseAction('train')} fullWidth color="primary" variant="contained">Train</Button>
            <Button onClick={() => chooseAction('sell')} fullWidth color="secondary" variant="contained"
                    my={4}>Sell</Button>
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
                    {...sellForm.register("price", { required: true, minLength: 1})}
                    fullWidth
                    startAdornment={<InputAdornment position="start">$GB</InputAdornment>}
                />
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={() => { console.log(sellForm.getValues(), sellForm.formState.errors) }}
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
