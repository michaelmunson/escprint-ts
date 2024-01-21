"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.parseTags = exports.parse = exports.isRawEscValue = exports.isRawEscKey = exports.raw = void 0;
exports.raw = {
    "reset": "\x1b[0m",
    "x": "\x1b[0m",
    "bold": "\x1b[1m",
    "dim": "\x1b[2m",
    "blink": "\x1b[5m",
    "italic": "\x1b[3m",
    "i": "\x1b[3m",
    "underline": "\x1b[4m",
    "u": "\x1b[4m",
    "reverse": "\x1b[7m",
    "hidden": "\x1b[8m",
    "strike": "\x1b[9m",
    "strikethrough": "\x1b[9m",
    "delete": '\x1b[2K',
    "home": "\x1b[H",
    "request": "\x1b[6n",
    "upscroll": "\x1b[8",
    "savecursor": "\x1b[s",
    "restorecursor": "\x1b[u",
    "black": "\x1b[30m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "white": "\x1b[37m",
    "Black": "\x1b[90m",
    "Red": "\x1b[91m",
    "Green": "\x1b[92m",
    "Yellow": "\x1b[93m",
    "Blue": "\x1b[94m",
    "Magenta": "\x1b[95m",
    "Cyan": "\x1b[96m",
    "White": "\x1b[97m",
    "bgblack": "\x1b[40m",
    "bgred": "\x1b[41m",
    "bggreen": "\x1b[42m",
    "bgyellow": "\x1b[43m",
    "bgblue": "\x1b[44m",
    "bgmagenta": "\x1b[45m",
    "bgcyan": "\x1b[46m",
    "bgwhite": "\x1b[47m",
    "bgBlack": "\x1b[100m",
    "bgRed": "\x1b[101m",
    "bgGreen": "\x1b[102m",
    "bgYellow": "\x1b[103m",
    "bgBlue": "\x1b[104m",
    "bgMagenta": "\x1b[105m",
    "bgCyan": "\x1b[106m",
    "bgWhite": "\x1b[107m",
    // erase from cursor until end of screen
    "delend": "\x1b[J",
    // erase from cursor to beginning of screen
    "delbeg": "\x1b[1J",
    // erase entire screen
    "delall": "\x1b[2J",
    // erase saved lines
    "delsaved": "\x1b[3J",
    // erase from cursor to end of line
    "delendln": "\x1b[K0",
    // erase start of line to the cursor
    "delbegln": "\x1b[1K",
    // erase the entire line
    "delln": "\x1b[2K",
    "nocursor": "\x1b[?25l",
    "showcursor": "\x1b[?25h",
    "altbuffer": "\x1b[?1049h",
    "disablealtbuffer": "\x1b[?1049l",
    "savescreen": "\x1b[?47h",
    "restorescreen": "\x1b[?47l"
};
var isRawEscKey = function (str) {
    return str in exports.raw;
};
exports.isRawEscKey = isRawEscKey;
var isRawEscValue = function (str) { return Object.values(exports.raw).includes(str); };
exports.isRawEscValue = isRawEscValue;
var parser = {
    regex: {
        tag: /<([^<>]+)>/g,
        endTag: /<\/([^<>]+)>/g,
        tagWhiteSpace: /\s<([^<>]+)>\s/g
    },
    format: function (str) {
        return str
            .replaceAll('/', ',')
            .replaceAll(';', ',')
            .replaceAll(' ,', ',')
            .replaceAll(', ', ',')
            .replaceAll(' ', ',')
            .replaceAll("</> ", exports.raw.reset)
            .replaceAll("</>", exports.raw.reset);
    },
    matchStyles: function (str) {
        var tags = __spreadArray([], str.matchAll(this.regex.tag), true);
        var endTags = __spreadArray([], str.matchAll(this.regex.endTag), true);
        var tagWhiteSpace = __spreadArray([], str.matchAll(this.regex.tagWhiteSpace), true);
        return { tags: tags, endTags: endTags, tagWhiteSpace: tagWhiteSpace };
    },
    handleStyles: function (str, format) {
        if (format === void 0) { format = false; }
        if (typeof str !== "string") {
            return str;
        }
        // str = this.format(str);
        var _a = this.matchStyles(str), tags = _a.tags, endTags = _a.endTags, tagWhiteSpace = _a.tagWhiteSpace;
        if (format) {
            for (var _i = 0, tagWhiteSpace_1 = tagWhiteSpace; _i < tagWhiteSpace_1.length; _i++) {
                var tws = tagWhiteSpace_1[_i];
                var outer = tws[0], inner = tws[1];
                str = str.replace(outer, outer.trimEnd());
            }
        }
        for (var _b = 0, endTags_1 = endTags; _b < endTags_1.length; _b++) {
            var endTag = endTags_1[_b];
            var outer = endTag[0], inner = endTag[1];
            var styles = this.format(inner).split(",");
            var stylestr = exports.raw.reset;
            for (var _c = 0, styles_1 = styles; _c < styles_1.length; _c++) {
                var style = styles_1[_c];
                if ((0, exports.isRawEscKey)(style)) {
                    stylestr += exports.raw[style];
                }
            }
            str = str.replace(outer, stylestr);
        }
        for (var _d = 0, tags_1 = tags; _d < tags_1.length; _d++) {
            var tag = tags_1[_d];
            var outer = tag[0], inner = tag[1];
            var styles = this.format(inner).split(",");
            var stylestr = "";
            for (var _e = 0, styles_2 = styles; _e < styles_2.length; _e++) {
                var style = styles_2[_e];
                if ((0, exports.isRawEscKey)(style)) {
                    stylestr += exports.raw[style];
                }
            }
            str = str.replace(outer, stylestr);
        }
        return str;
    }
};
var parse = function (str) {
    if (Array.isArray(str)) {
        return (0, exports.parse)(str.join(","));
    }
    else {
        str = parser.format(str);
        return str.split(',').map(function (s) {
            if ((0, exports.isRawEscKey)(s)) {
                return exports.raw[s];
            }
            else if ((0, exports.isRawEscValue)(s)) {
                return s;
            }
            else {
                return "";
            }
        }).join("");
    }
};
exports.parse = parse;
var parseTags = function (str, format) {
    if (format === void 0) { format = false; }
    return parser.handleStyles(str, format);
};
exports.parseTags = parseTags;
