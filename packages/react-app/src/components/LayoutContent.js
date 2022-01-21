import React from 'react'
import { forwardRef } from 'react'
import { Box } from '@mui/material'

const LayoutContent = forwardRef(({ children }, ref) => (
	<Box ref={ref}>
		{children}
	</Box>
))

export default LayoutContent
