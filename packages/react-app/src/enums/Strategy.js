import Position from "./Position";

class Strategy {

    static four_four_one = new Strategy(0, '4 - 4 - 1', {
        [Position.Attacker.id]: 4,
        [Position.Midfielder.id]: 4,
        [Position.Defender.id]: 4   ,
        [Position.GoalKeeper.id]: 1,
    })
    static Strategies = [Strategy.four_four_one]

    constructor(id, name, composition) {
        this.id = id
        this.name = name
        this.composition = composition
    }
}

export default Strategy
