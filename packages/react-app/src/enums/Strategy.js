import Position from "./Position";

class Strategy {

    static Strategies = []

    constructor(id, name, composition) {
        this.id = id
        this.name = name
        this.composition = composition
    }
}

export default Strategy
