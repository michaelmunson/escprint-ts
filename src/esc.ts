import { Optional, EscConfig } from "./types";

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
    "del2end" : "\x1b[J",
    // erase from cursor to beginning of screen
    "del2beg" : "\x1b[1J",
    // erase entire screen
    "delall" : "\x1b[2J",
    // erase saved lines
    "delsaved" : "\x1b[3J",
    // erase from cursor to end of line
    "del2endln" : "\x1b[K0",
    // erase start of line to the cursor
    "del2startln" : "\x1b[1K",
    // erase the entire line
    "delln" : "\x1b[2K",
    "nocursor" : "\x1b[?25l",
    "showcursor" : "\x1b[?25h",
    "altbuffer" : "\x1b[?1049h",
    "disablealtbuffer" : "\x1b[?1049l",
    "savescreen" : "\x1b[?47h",
    "restorescreen" : "\x1b[?47l"
}
const isInRawEscKey = (str:string) : str is keyof RawEscKey => {
    return str in raw;
}
const isRawEscValue = (str:string) => Object.values(raw).includes(str);

export default class esc {
    static wrt(...messages:unknown[]){
        const toPrint:string[] = [];
        for (const message of messages){
            if (typeof message === "string"){
                toPrint.push(esc.parse(message));
            } else {
                toPrint.push(JSON.stringify(message));
            }
        }
        for (const p of toPrint){
            process.stdin.write(p);
        }
        return esc;
    }
    static wrtln(...messages:unknown[]){
        esc.wrt(...messages);
        process.stdin.write("\n");
        return esc; 
    }
    static prt(...messages:unknown[]){
        return esc.wrt(...messages).x();
    }
    static prtln(...messages:unknown[]){
        return esc.wrtln(...messages).x();
    }
    static log(...messages:unknown[]){
        const toPrint:unknown[] = [];
        for (const message of messages){
            if (typeof message === "string"){
                toPrint.push(esc.parse(message));
            } else {
                toPrint.push(message);
            }
        }
        for (const p of toPrint){
            console.log(p);
        }
    }
    static startbuf(){
        process.stdin.write(raw.altbuffer);
        return esc;
    }
    static endbuf(){
        process.stdin.write(raw.disablealtbuffer);
        return esc; 
    }
    static x(){
        process.stdin.write(raw.reset);
        return esc;
    }
    static set(...rawEscs:string[]){
        for (const r of rawEscs){
            if (isRawEscValue(r)){
                process.stdin.write(r);
            }
        }
        return esc;
    }
    static setprs(str:string){
        process.stdin.write(esc.parse(`<${str}>`));
        return esc;
    }
    private static parse(str:string){
        const parser = {
            regex: {
                tag: /<([^<>]+)>/g,
                endTag: /<\/([^<>]+)>/g,
                tagWhiteSpace: /\s<([^<>]+)>\s/g
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
        
                str = str.replaceAll("</> ",raw.reset).replaceAll("</>",raw.reset); 
        
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
                        if (isInRawEscKey(style)){
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
                        if (isInRawEscKey(style)){
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
}


/* 
export const X = esc.reset; 
export const RESET = esc.reset
export const BOLD = esc.bold
export const DIM = esc.dim
export const BLINK = esc.blink
export const ITALIC = esc.italic
export const I = esc.italic
export const UNDERLINE = esc.underline
export const U = UNDERLINE
export const REVERSE = esc.reverse
export const HIDDEN = esc.hidden
export const STRIKE = esc.strike
export const STRIKETHROUGH = esc.strikethrough
export const DELETE = esc.delete
export const HOME = esc.home
export const REQUEST = esc.request
export const UPSCROLL = esc.upscroll
export const SAVECURSOR = esc.savecursor
export const RESTORECURSOR = esc.restorecursor
export const BLACK = esc.black
export const RED = esc.red
export const GREEN = esc.green
export const YELLOW = esc.yellow
export const BLUE = esc.blue
export const MAGENTA = esc.magenta
export const CYAN = esc.cyan
export const WHITE = esc.white
export const XBLACK = esc.Black
export const XRED = esc.Red
export const XGREEN = esc.Green
export const XYELLOW = esc.Yellow
export const XBLUE = esc.Blue
export const XMAGENTA = esc.Magenta
export const XCYAN = esc.Cyan
export const XWHITE = esc.White
export const BBLACK = esc.bg.black
export const BRED = esc.bg.red
export const BGREEN = esc.bg.green
export const BYELLOW = esc.bg.yellow
export const BBLUE = esc.bg.blue
export const BMAGENTA = esc.bg.magenta
export const BCYAN = esc.bg.cyan
export const BWHITE = esc.bg.white
export const BXBLACK = esc.bg.Black
export const BXRED = esc.bg.Red
export const BXGREEN = esc.bg.Green
export const BXYELLOW = esc.bg.Yellow
export const BXBLUE = esc.bg.Blue
export const BXMAGENTA = esc.bg.Magenta
export const BXCYAN = esc.bg.Cyan
export const BXWHITE = esc.bg.White
export const DEL2END = esc.del2end
export const DEL2BEG = esc.del2beg
export const DELALL = esc.delall
export const DELSAVED = esc.delsaved
export const DEL2ENDLN = esc.del2endln
export const DEL2STARTLN = esc.del2startln
export const DELLN = esc.delln
export const NOCURSOR = esc.nocursor
export const SHOWCURSOR = esc.showcursor
export const ALTBUFFER = esc.altbuffer
export const DISABLEALTBUFFER = esc.disablealtbuffer
export const SAVESCREEN = esc.savescreen
export const RESTORESCREEN = esc.restorescreen
export default esc; 
*/