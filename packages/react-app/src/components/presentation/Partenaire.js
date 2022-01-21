import '../../css/partenaire.css'
import React from 'react'

function Partenaire() {
	return (
		<div style={{ clear: 'both' }} className="container-partenaire">
			<div className="partenaire-left">
				<a href="https://www.qries.com/">
					<img alt="Qries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/2560px-Binance_logo.svg.png">
					</img>
				</a>
			</div>

			<div className="partenaire-right">
				<a href="https://www.qries.com/">
					<img alt="Qries" src="https://www.savefuturecoin.com/assets/img/live-pancakeswap.png">
					</img>
				</a>
			</div>
		</div>
	)
}

export default Partenaire
