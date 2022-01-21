import React from 'react'
import '../../css/presentation.css'


function Presentation() {
	return (
		<div className="body" style={{ clear: 'both' }}>
			<div className="header">
				<h1>Play to earn NFT</h1>
				<h1>The best football game to make money</h1>

				<p>Recruit and train your football players to build the best football team.
                    Train them by taking penalties.
				</p>
			</div>
			<div className="row1-container">
				<div className="box box-down cyan">
					<h2>Recruit your players</h2>
					<p>Monitors activity to identify project roadblocks</p>
					<img src="https://assets.codepen.io/2301174/icon-supervisor.svg" alt=""/>
				</div>

				<div className="box red">
					<h2>Train your players</h2>
					<p>Scans our talent network to create the optimal team for your project</p>
					<img src="https://assets.codepen.io/2301174/icon-team-builder.svg" alt=""/>
				</div>

				<div className="box box-down blue">
					<h2>Boost your players</h2>
					<p>Uses data from past projects to provide better delivery estimates</p>
					<img src="https://assets.codepen.io/2301174/icon-calculator.svg" alt=""/>
				</div>
			</div>
			<div className="row2-container">
				<div className="box orange">
					<h2>Win tokens</h2>
					<p>Regularly evaluates our talent to ensure quality</p>
					<img src="https://assets.codepen.io/2301174/icon-karma.svg" alt=""/>
				</div>
			</div>

		</div>
	)
}

export default Presentation
