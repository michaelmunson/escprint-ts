

import readline from "readline";
import { isRawEscKey, isRawEscValue, parseTags, raw, parse } from "./raw.ts";
import { ReadlineOptions } from "./types.ts";

export default class esc {
    static get cursor(){
        return {
            up(n=1){
                process.stdout.write("\x1b["+n+"F");
                return this
            },
            down(n=1){
                process.stdout.write("\x1b["+n+"E");
                return this
            },
            right(n=1){
                process.stdout.write("\x1b["+n+"C");
                return this
            },
            left(n=1){
                process.stdout.write("\x1b["+n+"D");
                return this
            },
            hide(){
                process.stdout.write(raw.nocursor);
                return this
            },
            show(){
                process.stdout.write(raw.showcursor);
                return this
            },
            save(){
                process.stdout.write(raw.savecursor);
                return this
            },
            load(){
                process.stdout.write(raw.restorecursor);
                return this
            },
            top(){
                this.up(process.stdout.rows);
                return this
            },
            home(){
                process.stdout.write(raw.home);
                return this
            }
        }
    }
    static get screen(){
        return {
            save(){
                process.stdout.write(raw.savescreen);
                return esc;
            },
            del(){
                process.stdout.write(raw.delall);
                return esc;
            },
            load(){
                process.stdout.write(raw.restorescreen);
                return esc;
            },
        }
    }
    static get fg(){
        return {
            code(code:number){
                process.stdout.write(`\x1b[38;5;${code}m`);
                return esc;
            },
            rgb(r:number,g:number,b:number){
                process.stdout.write(`\x1b[38;2;${r};${g};${b}m`);
                return esc;
            }
        }
    }
    static get bg(){
        return {
            code(code:number){
                process.stdout.write(`\x1b[48;5;${code}m`);
                return esc;
            },
            rgb(r:number, g:number, b:number){
                process.stdout.write(`\x1b[48;2;${r};${g};${b}m`);
                return esc; 
            }
        }
    }
    static wrt(...messages:unknown[]){
        const toPrint:string[] = [];
        for (const message of messages){
            if (typeof message === "string"){
                toPrint.push(parseTags(message));
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
                toPrint.push(parseTags(message));
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
        for (const _ of rawEscs){
            const r = _.replaceAll('/',',').replaceAll(';',',').replaceAll(' ,',',').replaceAll(', ',',').replaceAll(' ',',');
            if (r.includes(',')){
                for (const sr of r.split(',')){
                    process.stdin.write(sr); 
                }
            }
            else if (isRawEscValue(r)){
                process.stdin.write(r);
            }
            else if (isRawEscKey(r)){
                process.stdin.write(raw[r]);
            }
        }
        return esc;
    }
    static delln(){
        process.stdout.write(raw.delln);
        return esc;
    }
    static delend(){
        process.stdout.write(raw.delend);
        return esc;
    }
    static delbeg(){
        process.stdout.write(raw.delbeg);
        return esc;
    }
    static delall(){
        process.stdout.write(raw.delall);
        return esc;
    }
    static clr(){
        esc.delall();
        return esc;
    }
    static delendln(){
        process.stdout.write(raw.delendln);
        return esc;
    }
    static delbegln(){
        process.stdout.write(raw.delbegln);
        return esc;
    }
    static delsaved(){
        process.stdout.write(raw.delsaved);
        return esc;
    }
    // readline
    static read(prompt:string="", readlineOptions?:ReadlineOptions) {
        const outStyle = readlineOptions?.outStyle ? parse(readlineOptions.outStyle) : raw.x;
        const query = parseTags(prompt+outStyle);
        
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true, 
                ...readlineOptions
            });
            rl.question(query, answer => {
                rl.close();
                esc.wrt(raw.x);
                resolve(answer);
            })
        });
    }
    static readpswd(prompt:string="", readlineOptions?:ReadlineOptions&{outChar?:string}){
        const outChar = (typeof readlineOptions?.outChar==="string") ? readlineOptions.outChar : "*"; 
        const outStyle = readlineOptions?.outStyle ? parse(readlineOptions.outStyle) : raw.x;
        const query = parseTags(prompt+outStyle);
        return new Promise((resolve, reject) => {
            const rl:any = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true, 
                ...readlineOptions
            });
            const stdin = process.openStdin();
            const dataHandler = (char:any) => {
                char = char + '';
                switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    stdin.pause();
                    break;
                default:
                    (process as any).stdout.clearLine();
                    readline.cursorTo(process.stdout, 0);
                    esc.wrt(raw.x)
                    process.stdout.write(query + Array(rl.line.length + 1).join(outChar));
                    break;
                }
            };
            process.stdin.on('data', dataHandler);
            rl.question(query, (value:any) => {
                rl.history = rl.history.slice(1);
                rl.close();
                process.stdin.removeListener('data', dataHandler);
                esc.wrt(raw.x);
                resolve(value);
            });
        })
    }
}

/*
    @staticmethod
    def cursor_up(n:int=1) -> None:
        process.stdout.write("\x1b["+n+"F")
        process.stdout.flush()

    @staticmethod
    def cursor_down(n:int=1) -> None:
        process.stdout.write("\x1b["+n+"E")
        process.stdout.flush()
    
    @staticmethod
    def cursor_left(n:int=1) -> None:
        process.stdout.write("\x1b["+n+"D")
        process.stdout.flush()

    @staticmethod
    def cursor_right(n:int=1) -> None:
        process.stdout.write("\x1b["+n+"C")
        process.stdout.flush()

    @staticmethod
    def erase_to_endln() -> None:
        process.stdout.write("\x1b[K")
        process.stdout.flush()

    @staticmethod
    def erase_screen() -> None:
        process.stdout.write("\x1b[2J")
        process.stdout.flush()

    @staticmethod
    def erase_line() -> None:
        process.stdout.write("\x1b[2K")
        process.stdout.flush()

    @staticmethod
    def erase_prev(n:int=1) -> None:
        if n > 1:
            for i in range(n):
                esc.cursor_up(1)
                esc.erase_line()
        else:
            esc.cursor_up(1)
            esc.erase_line()

    @staticmethod
    def hide_cursor() -> None:
        print(esc.nocursor, end="")

    @staticmethod
    def show_cursor() -> None:
        print(esc.showcursor, end="")

    @staticmethod
    def enable_alt_buffer() -> None:
        print(esc.altbuffer)
    
    @staticmethod
    def disable_alt_buffer() -> None:
        print(esc.disablealtbuffer)

    @staticmethod
    def save_cursor() -> None:
        print(esc.savecursor, end="")

    @staticmethod
    def save_cursor() -> None:
        print(esc.restorecursor, end="")

    @staticmethod
    def save_screen() -> None:
        print(esc.savescreen, end="")

    @staticmethod
    def restore_screen() -> None:
        print(esc.restorescreen, end="")

    @staticmethod
    def fg_code(code:int) -> None:
        print(f"\x1b[38;5;{code}m", end="")

    @staticmethod
    def bg_code(code:int) -> None:
        print(f"\x1b[48;5;{code}m", end="")
    
    @staticmethod
    def fg_rgb(r:int,g:int,b:int) -> None:
        print(f"\x1b[38;2;{r};{g};{b}m", end="")
    
    @staticmethod
    def bg_rgb(r:int,g:int,b:int) -> None:
        print(f"\x1b[48;2;{r};{g};{b}m", end="")

    @staticmethod
    def terminal_size() -> tuple:
        sz = os.get_terminal_size()
        TerminalSize = namedtuple("TerminalSize", ("x","y"))
        return TerminalSize(sz.columns, sz.lines)

    @staticmethod
    def cursor_to_top() -> None:
        height = esc.terminal_size().y
        esc.cursor_up(height)
    
    def cursor_home() -> None:
        print(esc.home, end="")

*/