class Frame {
    static None = new Frame(0, 'None', {
        light: '#4c4c4c',
        main: '#818181',
        dark: '#818181',
    })
    static Bronze = new Frame(1, 'Bronze', {
        light: '#a05318',
        main: '#864514',
        dark: '#5a2e0d',
    })
    static Silver = new Frame(2, 'Silver', {
        light: '#cdcdcd',
        main: '#c3c3c3',
        dark: '#c3c3c3',
    })
    static Gold = new Frame(3, 'Gold', {
        light: '#ffee52',
        main: '#e9d600',
        dark: '#e9d600',
    })
    static Diamond = new Frame(4, 'Diamond', {
        light: '#2fc8e0',
        main: '#2cb4ca',
        dark: '#2cb4ca',
    })
    static TierList = [Frame.None, Frame.Bronze, Frame.Silver, Frame.Gold, Frame.Diamond]

    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
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
