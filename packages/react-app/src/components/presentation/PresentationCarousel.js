import { Carousel } from 'react-bootstrap'
import football1 from '../../images/football-1.jpg'
import football3 from '../../images/football-3.jpg'
import React from 'react'

function PresentationCarousel() {
	return (
		<Carousel style={{ height: '500px' }}>
			<Carousel.Item>
				<img
					style={{
						height: '500px',
						objectFit: 'cover',
						width: '100%',
					}}
					src={football1}
					alt="First slide"
				/>
				<Carousel.Caption>
					<h3>The world is waiting for its hero</h3>
					<p>Arrive like a king, leave like a hero.</p>
					<a className="button" href="collection"><div className="link">Let's play now</div></a>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<img
					style={{
						height: '500px',
						objectFit: 'cover',
						width: '100%',
					}}
					src={football3}
					alt="Third slide"
				/>
				<Carousel.Caption>
					<h3>The world is waiting for its hero</h3>
					<p>Arrive like a king, leave like a hero.</p>
					<a className="button" href="collection"><div className="link">Let's play now</div></a>
				</Carousel.Caption>
			</Carousel.Item>
		</Carousel>
	)
}

export default PresentationCarousel
