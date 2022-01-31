import React, { useEffect, useState } from 'react'
import Card from '../../../components/card/Card'

const RandomPlayer = () => {
	const [fakePlayer, setFakePlayer] = useState({
		imageId: 1,
		frame: 1,
		rarity: 3,
		position: 3,
		score: 80,
	})

	const randomNumber = (max) => Math.floor(Math.random() * max)

	useEffect(() => {
		const timer = setInterval(() => {
			setFakePlayer({
				imageId: randomNumber(3),
				frame: randomNumber(4),
				rarity: randomNumber(3),
				position: randomNumber(4),
				score: randomNumber(100),
			})
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	return (
		<Card isNpc player={fakePlayer} />
	)
}

export default RandomPlayer
