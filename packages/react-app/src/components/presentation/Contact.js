import React from 'react'
import '../../css/contact.css'

function Contact() {
	return (
		<div style={{ clear: 'both' }}>
			<h3 className="title-contact">Join our community</h3>
			<div id="container">
				<div id="left">
					<a href="https://www.qries.com/">
						<img alt="Qries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1024px-Telegram_2019_Logo.svg.png">
						</img>
					</a>
				</div>
				<div id="right">
					<a href="https://www.qries.com/">
						<img alt="Qries" src="https://logodownload.org/wp-content/uploads/2017/11/discord-logo-4-1.png">
						</img>
					</a>
				</div>
				<div id="center">
					<a href="https://www.qries.com/">
						<img alt="Qries" src="https://www.danoneinstitute.org/wp-content/uploads/2020/06/logo-rond-twitter.png">
						</img>
					</a>
				</div>
			</div>
		</div>
	)
}

export default Contact
