class Frame {
    static None = new Frame(0, 'None', {
        light: '#818181',
        main: '#818181',
        dark: '#818181',
    })
    static Bronze = new Frame(1, 'Bronze', {
        light: '#a05318',
        main: '#864514',
        dark: '#5a2e0d',
    })
    static Silver = new Frame(2, 'Silver')
    static Gold = new Frame(3, 'Gold')
    static Diamond = new Frame(4, 'Diamond')
    static TierList = [Frame.None, Frame.Bronze, Frame.Silver, Frame.Gold, Frame.Diamond]

    constructor(id, name) {
        this.id = id;
        this.name = name;
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
