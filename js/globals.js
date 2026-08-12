// globals.js
const Colors = {
    get(name) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--color-${name}`)
            .trim();
    },
    get bgPage()          { return this.get('bg-page'); },
    get bgCard()          { return this.get('bg-card'); },
    get text()            { return this.get('text'); },
    get bodyText()        { return this.get('body-text'); },
    get accent()          { return this.get('accent'); },
    get accentDim()       { return this.get('accent-dim'); },
    get hover()           { return this.get('hover'); },
    get shadow()          { return this.get('shadow'); },
    get inlineCodeText()  { return this.get('inline-code-text'); },
    get inlineCodeBg()    { return this.get('inline-code-bg'); },
    get formEntry()       { return this.get('form-entry'); },
};