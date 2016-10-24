# Člověče, nezlob se!

A simple board game implemented in JavaScript. What I don't like on this implementation:

- No model: To know where the pawns are, the program scans the DOM for class names. A better implementation would use a source of truth in JavaScript, not in the DOM.
- Several global variables, the ugliest one is `rolled`.
- No player selection: It's possible to edit the `players` variable to select the players but there's no UI for it.
