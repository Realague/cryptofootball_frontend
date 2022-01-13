class Position {
    static GoalKeeper = new Position(0, "GK")
    static Defender = new Position(1, "DE")
    static Midfielder = new Position(2, "MID")
    static Attacker = new Position(3, "AT")

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static positionIdToString(id) {
        switch (parseInt(id)) {
            case 0:
                return "GK"
            case 1:
                return "DE"
            case 2:
                return "MID"
            case 3:
                return "AT"
            default:
                return "Unknown"
        }
    }
}

export default Position