
export type RawEscKey = typeof raw;
export const raw = {
    "reset" : "\x1b[0m",
    "x" : "\x1b[0m",
    "bold" : "\x1b[1m",
    "dim" : "\x1b[2m",
    "blink" : "\x1b[5m",
    "italic" : "\x1b[3m",
    "i" : "\x1b[3m",
    "underline" : "\x1b[4m",
    "u" : "\x1b[4m",
    "reverse" : "\x1b[7m",
    "hidden" : "\x1b[8m",
    "strike" : "\x1b[9m",
    "strikethrough" : "\x1b[9m",
    "delete" : '\x1b[2K',
    "home" : "\x1b[H",
    "request" : "\x1b[6n",
    "upscroll" : "\x1b[8",
    "savecursor" : "\x1b[s",
    "restorecursor" : "\x1b[u",
    "black" : "\x1b[30m",
    "red" : "\x1b[31m",
    "green" : "\x1b[32m",
    "yellow" : "\x1b[33m",
    "blue" : "\x1b[34m",
    "magenta" : "\x1b[35m",
    "cyan" : "\x1b[36m",
    "white" : "\x1b[37m",
    "Black" : "\x1b[90m",
    "Red" : "\x1b[91m",
    "Green" : "\x1b[92m",
    "Yellow" : "\x1b[93m",
    "Blue" : "\x1b[94m",
    "Magenta" : "\x1b[95m",
    "Cyan" : "\x1b[96m",
    "White" : "\x1b[97m",
    "bgblack" : "\x1b[40m",
    "bgred" : "\x1b[41m",
    "bggreen" : "\x1b[42m",
    "bgyellow" : "\x1b[43m",
    "bgblue" : "\x1b[44m",
    "bgmagenta" : "\x1b[45m",
    "bgcyan" : "\x1b[46m",
    "bgwhite" : "\x1b[47m",
    "bgBlack" : "\x1b[100m",
    "bgRed" : "\x1b[101m",
    "bgGreen" : "\x1b[102m",
    "bgYellow" : "\x1b[103m",
    "bgBlue" : "\x1b[104m",
    "bgMagenta" : "\x1b[105m",
    "bgCyan" : "\x1b[106m",
    "bgWhite" : "\x1b[107m",
    // erase from cursor until end of screen
    "delend" : "\x1b[J",
    // erase from cursor to beginning of screen
    "delbeg" : "\x1b[1J",
    // erase entire screen
    "delall" : "\x1b[2J",
    // erase saved lines
    "delsaved" : "\x1b[3J",
    // erase from cursor to end of line
    "delendln" : "\x1b[K0",
    // erase start of line to the cursor
    "delbegln" : "\x1b[1K",
    // erase the entire line
    "delln" : "\x1b[2K",
    "nocursor" : "\x1b[?25l",
    "showcursor" : "\x1b[?25h",
    "altbuffer" : "\x1b[?1049h",
    "disablealtbuffer" : "\x1b[?1049l",
    "savescreen" : "\x1b[?47h",
    "restorescreen" : "\x1b[?47l"
}

export const isRawEscKey = (str:string) : str is keyof RawEscKey => {
    return str in raw;
}
export const isRawEscValue = (str:string) => Object.values(raw).includes(str);

export const parse = (str:string) => {
    const parser = {
        regex: {
            tag: /<([^<>]+)>/g,
            endTag: /<\/([^<>]+)>/g,
            tagWhiteSpace: /\s<([^<>]+)>\s/g
        },
        format(str:string){
            return str
                    .replaceAll('/',',')
                    .replaceAll(';',',')
                    .replaceAll(' ,',',')
                    .replaceAll(', ',',')
                    .replaceAll(' ',',')
                    .replaceAll("</> ",raw.reset)
                    .replaceAll("</>",raw.reset);
        },
        matchStyles(str:string){
            const tags = [...str.matchAll(this.regex.tag)];
            const endTags = [...str.matchAll(this.regex.endTag)];
            const tagWhiteSpace = [...str.matchAll(this.regex.tagWhiteSpace)]; 
            return {tags, endTags, tagWhiteSpace}; 
        },
        handleStyles(str:string){
            if (typeof str !== "string"){
                return str; 
            }
    
            str = this.format(str);
    
            const {tags, endTags, tagWhiteSpace} = this.matchStyles(str); 
    
            for (const tws of tagWhiteSpace){
                const [outer,inner] = tws;
                str = str.replace(outer,outer.trimEnd());
            }
            
            for (const endTag of endTags){
                const [outer,inner] = endTag;
                const styles = inner.split(",");
                let stylestr = raw.reset;
                for (const style of styles){
                    if (isRawEscKey(style)){
                        stylestr += raw[style];
                    }
                }
                str = str.replace(outer,stylestr);
            }
    
            for (const tag of tags){
                const [outer,inner] = tag; 
                const styles = inner.split(","); 
                let stylestr = "";
                for (const style of styles){
                    if (isRawEscKey(style)){
                        stylestr += raw[style];
                    }
                }
                str = str.replace(outer,stylestr); 
            }
    
            return str; 
        }
    }
    return parser.handleStyles(str);
}