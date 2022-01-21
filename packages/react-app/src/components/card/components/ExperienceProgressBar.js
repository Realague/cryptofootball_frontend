import * as React from 'react'
import { LinearProgress, linearProgressClasses } from '@mui/material'
import { styled } from '@mui/material/styles'

const ExperienceProgressBar = styled(LinearProgress)(({ theme }) => {
	return ({
		height: 10,
		width: '110px',
		borderRadius: 5,
		border: `1px solid ${theme.palette.primary.light}`,
		boxShadow: `0 0 3px ${theme.palette.primary.light}`,
		[`&.${linearProgressClasses.colorPrimary}`]: {
			backgroundColor: `darken(${theme.palette.primary.main}, 00%)`,
		},
		[`& .${linearProgressClasses.bar}`]: {
			borderRadius: 5,
			background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
		},
	})
})

export default ExperienceProgressBar
