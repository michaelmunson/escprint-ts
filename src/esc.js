"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var readline_1 = require("readline");
var raw_1 = require("./raw");
var esc = /** @class */ (function () {
    function esc() {
    }
    Object.defineProperty(esc, "cursor", {
        get: function () {
            return {
                up: function (n) {
                    if (n === void 0) { n = 1; }
                    process.stdout.write("\x1b[" + n + "F");
                    return this;
                },
                down: function (n) {
                    if (n === void 0) { n = 1; }
                    process.stdout.write("\x1b[" + n + "E");
                    return this;
                },
                right: function (n) {
                    if (n === void 0) { n = 1; }
                    process.stdout.write("\x1b[" + n + "C");
                    return this;
                },
                left: function (n) {
                    if (n === void 0) { n = 1; }
                    process.stdout.write("\x1b[" + n + "D");
                    return this;
                },
                hide: function () {
                    process.stdout.write(raw_1.raw.nocursor);
                    return this;
                },
                show: function () {
                    process.stdout.write(raw_1.raw.showcursor);
                    return this;
                },
                save: function () {
                    process.stdout.write(raw_1.raw.savecursor);
                    return this;
                },
                load: function () {
                    process.stdout.write(raw_1.raw.restorecursor);
                    return this;
                },
                top: function () {
                    this.up(process.stdout.rows);
                    return this;
                },
                home: function () {
                    process.stdout.write(raw_1.raw.home);
                    return this;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(esc, "screen", {
        get: function () {
            return {
                save: function () {
                    process.stdout.write(raw_1.raw.savescreen);
                    return esc;
                },
                del: function () {
                    process.stdout.write(raw_1.raw.delall);
                    return esc;
                },
                load: function () {
                    process.stdout.write(raw_1.raw.restorescreen);
                    return esc;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(esc, "fg", {
        get: function () {
            return {
                code: function (code) {
                    process.stdout.write("\u001B[38;5;".concat(code, "m"));
                    return esc;
                },
                rgb: function (r, g, b) {
                    process.stdout.write("\u001B[38;2;".concat(r, ";").concat(g, ";").concat(b, "m"));
                    return esc;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(esc, "bg", {
        get: function () {
            return {
                code: function (code) {
                    process.stdout.write("\u001B[48;5;".concat(code, "m"));
                    return esc;
                },
                rgb: function (r, g, b) {
                    process.stdout.write("\u001B[48;2;".concat(r, ";").concat(g, ";").concat(b, "m"));
                    return esc;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    esc.wrt = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        var toPrint = [];
        for (var _a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
            var message = messages_1[_a];
            if (typeof message === "string") {
                toPrint.push((0, raw_1.parseTags)(message));
            }
            else {
                toPrint.push(JSON.stringify(message));
            }
        }
        for (var _b = 0, toPrint_1 = toPrint; _b < toPrint_1.length; _b++) {
            var p = toPrint_1[_b];
            process.stdin.write(p);
        }
        return esc;
    };
    esc.wrtln = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        esc.wrt.apply(esc, messages);
        process.stdin.write("\n");
        return esc;
    };
    esc.prt = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return esc.wrt.apply(esc, messages).x();
    };
    esc.prtln = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        return esc.wrtln.apply(esc, messages).x();
    };
    esc.log = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        var toPrint = [];
        for (var _a = 0, messages_2 = messages; _a < messages_2.length; _a++) {
            var message = messages_2[_a];
            if (typeof message === "string") {
                toPrint.push((0, raw_1.parseTags)(message));
            }
            else {
                toPrint.push(message);
            }
        }
        for (var _b = 0, toPrint_2 = toPrint; _b < toPrint_2.length; _b++) {
            var p = toPrint_2[_b];
            console.log(p);
        }
    };
    esc.startbuf = function () {
        process.stdin.write(raw_1.raw.altbuffer);
        return esc;
    };
    esc.endbuf = function () {
        process.stdin.write(raw_1.raw.disablealtbuffer);
        return esc;
    };
    esc.x = function () {
        process.stdin.write(raw_1.raw.reset);
        return esc;
    };
    esc.set = function () {
        var rawEscs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rawEscs[_i] = arguments[_i];
        }
        for (var _a = 0, rawEscs_1 = rawEscs; _a < rawEscs_1.length; _a++) {
            var _ = rawEscs_1[_a];
            var r = _.replaceAll('/', ',').replaceAll(';', ',').replaceAll(' ,', ',').replaceAll(', ', ',').replaceAll(' ', ',');
            if (r.includes(',')) {
                for (var _b = 0, _c = r.split(','); _b < _c.length; _b++) {
                    var sr = _c[_b];
                    process.stdin.write(sr);
                }
            }
            else if ((0, raw_1.isRawEscValue)(r)) {
                process.stdin.write(r);
            }
            else if ((0, raw_1.isRawEscKey)(r)) {
                process.stdin.write(raw_1.raw[r]);
            }
        }
        return esc;
    };
    esc.delln = function () {
        process.stdout.write(raw_1.raw.delln);
        return esc;
    };
    esc.delend = function () {
        process.stdout.write(raw_1.raw.delend);
        return esc;
    };
    esc.delbeg = function () {
        process.stdout.write(raw_1.raw.delbeg);
        return esc;
    };
    esc.delall = function () {
        process.stdout.write(raw_1.raw.delall);
        return esc;
    };
    esc.clr = function () {
        esc.delall();
        return esc;
    };
    esc.delendln = function () {
        process.stdout.write(raw_1.raw.delendln);
        return esc;
    };
    esc.delbegln = function () {
        process.stdout.write(raw_1.raw.delbegln);
        return esc;
    };
    esc.delsaved = function () {
        process.stdout.write(raw_1.raw.delsaved);
        return esc;
    };
    // readline
    esc.read = function (prompt, readlineOptions) {
        if (prompt === void 0) { prompt = ""; }
        var outStyle = (readlineOptions === null || readlineOptions === void 0 ? void 0 : readlineOptions.outStyle) ? (0, raw_1.parse)(readlineOptions.outStyle) : raw_1.raw.x;
        var query = (0, raw_1.parseTags)(prompt + outStyle);
        return new Promise(function (resolve, reject) {
            var rl = readline_1["default"].createInterface(__assign({ input: process.stdin, output: process.stdout, terminal: true }, readlineOptions));
            rl.question(query, function (answer) {
                rl.close();
                esc.wrt(raw_1.raw.x);
                resolve(answer);
            });
        });
    };
    esc.readpswd = function (prompt, readlineOptions) {
        if (prompt === void 0) { prompt = ""; }
        var outChar = (typeof (readlineOptions === null || readlineOptions === void 0 ? void 0 : readlineOptions.outChar) === "string") ? readlineOptions.outChar : "*";
        var outStyle = (readlineOptions === null || readlineOptions === void 0 ? void 0 : readlineOptions.outStyle) ? (0, raw_1.parse)(readlineOptions.outStyle) : raw_1.raw.x;
        var query = (0, raw_1.parseTags)(prompt + outStyle);
        return new Promise(function (resolve, reject) {
            var rl = readline_1["default"].createInterface(__assign({ input: process.stdin, output: process.stdout, terminal: true }, readlineOptions));
            var stdin = process.openStdin();
            var dataHandler = function (char) {
                char = char + '';
                switch (char) {
                    case '\n':
                    case '\r':
                    case '\u0004':
                        stdin.pause();
                        break;
                    default:
                        process.stdout.clearLine();
                        readline_1["default"].cursorTo(process.stdout, 0);
                        esc.wrt(raw_1.raw.x);
                        process.stdout.write(query + Array(rl.line.length + 1).join(outChar));
                        break;
                }
            };
            process.stdin.on('data', dataHandler);
            rl.question(query, function (value) {
                rl.history = rl.history.slice(1);
                rl.close();
                process.stdin.removeListener('data', dataHandler);
                esc.wrt(raw_1.raw.x);
                resolve(value);
            });
        });
    };
    return esc;
}());
exports["default"] = esc;
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
