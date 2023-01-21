# Wordle solver

My attempts at programmatically generating good wordle guesses. To run:

1. Install NodeJS. Recommended route (even though this repo doesn't
   need a specific version of node):

    1. [Install `nvm`](https://github.com/nvm-sh/nvm)
    2. `nvm install node`

2. Install package deps:

```
npm install
```

3. Run `main`:

```
npm run main
```

Takes 20-30 sec to run on my 16GB chromebook (using the built-in Linux Development
Environment).

## Tests

```
npm run test
```

## Debugging with Chrome Dev Tools

Run either:

```
npm run mainDebug
npm run testDebug
```

In your browser open `chrome://inspect` and then click the "inspect" button that
will eventually appear. You may need to manually add `debugger` lines to the code
in order to pause after the sources have loaded.

## Misc commands

See `package.json` for more useful commands.


