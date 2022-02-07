import React from 'react'
import PresentationCarousel from './PresentationCarousel'
import Presentation from './Presentation'
import Contact from './Contact'
import Partenaire from './Partenaire'
import { Stack } from '@mui/material'

function PresentationPage() {
	return (
		<Stack>
			<PresentationCarousel/>
			<Contact/>
			<Presentation/>
			<Partenaire/>
		</Stack>
	)
}

export default PresentationPage
