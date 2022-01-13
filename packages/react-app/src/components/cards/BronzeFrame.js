import React from 'react';
import Frame from "../../enums/Frame";
import Position from "../../enums/Position";
import messi from "../../images/footballplayer/messi.jpeg";
import {BsFillLightningChargeFill} from "react-icons/bs";
import GameContract from "../../contractInteraction/GameContract";
import "../../css/bronzeFrame.css"
import FootballPlayerContract from "../../contractInteraction/FootballPlayerContract";

function BronzeFrame(props) {
    return (
        <div className="playerCard noselect" style={{backgroundImage: `url(${Frame.frameIdToString(props.player.frame)})`}}>
            <p className="card-info-name">&nbsp;</p>
            <p className="card-info-name">&nbsp;</p>
            <p className="card-info-name text-center player-position">{Position.positionIdToString(props.player.position)}</p>
            <p className="card-info-name player-score">{props.player.score}</p>
            <div className="player-image">
                <img src={messi} alt=""/>
            </div>
            <p className="card-info-name player-name">{FootballPlayerContract.getPlayersName(props.player)}</p>
            <div className="card-info-name player-info">
                <label htmlFor="file-bronze">XP&nbsp;</label>
                <progress id="file-bronze" max={GameContract.getXpRequireToLvlUp(props.player.score)}
                          value={props.player.xp}/>
            </div>
            <div className="card-info-name player-info">
                <label htmlFor="fileStamina-bronze"><BsFillLightningChargeFill
                    style={{color: 'yellow'}}/></label>
                <progress id="fileStamina-bronze" max="100" value={props.stamina}/>
            </div>
        </div>
    );
}

export default BronzeFrame;
