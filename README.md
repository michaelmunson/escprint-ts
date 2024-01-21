# escprint-ts

## Installation
`npm install escprint-ts --save-dev`

## Usage
```typescript
import esc from "escprint-ts";

const {prt} = esc;

// print "Hello World!" red and underlined
prt("<red,u>Hello World!");
```

```typescript
import esc from "escprint-ts";

const {read, readpswd} = esc;

const username = await read("<blue>Username: ", {
    outStyle: ['dim','italic']
});

const password = await readpswd("<red>Password: ", {
    outChar: "*",
    outStyle: "dim"
})
```
