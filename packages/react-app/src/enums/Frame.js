class Frame {
    static None = new Frame(0)
    static Bronze = new Frame(1)
    static Silver = new Frame(2)
    static Gold = new Frame(3)
    static Diamond = new Frame(4)

    constructor(id) {
        this.id = id;
    }

    static frameIdToString(id) {
        switch (parseInt(id)) {
            case 0:
                return "/frames/none.png"
            case 1:
                return "/frames/bronze.png"
            case 2:
                return "/frames/silver.png"
            case 3:
                return "/frames/gold.png"
            case 4:
                return "/frames/diamond.png"
            default:
                return "Unknown"
        }
    }
}

export default Frame