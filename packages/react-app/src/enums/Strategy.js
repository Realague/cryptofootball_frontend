import Position from "./Position";

class Strategy {

    static four_four_two = new Strategy(0, '4 - 4 - 2', {
        [Position.Attacker.id]: 4,
        [Position.Midfielder.id]: 4,
        [Position.Defender.id]: 2,
        [Position.GoalKeeper.id]: 1,
    })
    static Strategies = [Strategy.four_four_two]

    constructor(id, name, composition) {
        this.id = id
        this.name = name
        this.composition = composition
    }
}

export default Strategy
