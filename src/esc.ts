

import { Optional, EscConfig } from "./types";
import {raw, parse, isRawEscKey, isRawEscValue, RawEscKey} from "./raw";
import readline from "readline";

export default class esc {
    static get cursor(){
        return {
            up(n=1){
                process.stdout.write("\x1b["+n+"F");
            },
            down(n=1){
                process.stdout.write("\x1b["+n+"E")
            },
            right(n=1){
                process.stdout.write("\x1b["+n+"C")
            },
            left(n=1){
                process.stdout.write("\x1b["+n+"D")
            },
            hide(){
                process.stdout.write(raw.nocursor)
            },
            show(){
                process.stdout.write(raw.showcursor)
            },
            save(){
                process.stdout.write(raw.savecursor)
            },
            load(){
                process.stdout.write(raw.restorecursor)
            },
            top(){
                this.up(process.stdout.rows);
            },
            home(){
                process.stdout.write(raw.home)
            }
        }
    }
    static wrt(...messages:unknown[]){
        const toPrint:string[] = [];
        for (const message of messages){
            if (typeof message === "string"){
                toPrint.push(parse(message));
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
                toPrint.push(parse(message));
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
    // readline
    static read({input=process.stdin, output=process.stdout}) {
        const rl = readline.createInterface(input, output); 
        


        return rl;
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