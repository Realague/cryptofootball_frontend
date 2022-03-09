import React, { useEffect, useState } from 'react'
import Card from '../../../components/card/Card'
import footballHeroesService from '../../../services/FootballPlayerService'

const RandomPlayer = ({ tier = undefined }) => {
	const [fakePlayer, setFakePlayer] = useState({
		imageId: 1,
		frame: tier === undefined ? 1 : tier,
		rarity: 3,
		position: 3,
		score: 80,
	})

	const randomNumber = (max) => Math.floor(Math.random() * max)

	useEffect(() => {
		const timer = setInterval(() => {
			let fakePlayer = {
				imageId: 0,
				frame: tier === undefined ? randomNumber(4) : tier,
				rarity: randomNumber(2),
				position: randomNumber(3),
				score: randomNumber(100),
			}

			fakePlayer.imageId = randomNumber(footballHeroesService.names[fakePlayer.position][fakePlayer.position].length - 1)
			setFakePlayer(fakePlayer)
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	return (
		<Card isNpc player={fakePlayer} />
	)
}

export default RandomPlayer
