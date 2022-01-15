import * as React from 'react';
import {LinearProgress, linearProgressClasses} from "@mui/material";
import { styled } from '@mui/material/styles';

const StaminaProgressBar = styled(LinearProgress)(({ theme }) => {
    return ({
        height: 10,
        width: "110px",
        borderRadius: 5,
        border: `1px solid ${theme.palette.secondary.light}`,
        boxShadow: `0 0 3px ${theme.palette.secondary.light}`,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: `darken(${theme.palette.secondary.main}, 00%)`,
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            background: `linear-gradient(90deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.light} 100%)`,
        },
    })
})

export default StaminaProgressBar
