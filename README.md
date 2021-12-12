# CutTris

Our minimalistic 2-player tetris game.

The name *CutTris* is an homage to our first project, 
[Cut Code](https://github.com/arjunk04/cut_code).

---

# Installation and Set-Up
## Pre-Requisites

To run Cut Code, you need a computer and a functioning internet connection.

You also need a browser (we strongly recommend Chrome or Firefox) and allow pop-ups.

Additionally, you need to install node.js and npm.

These can be downloaded on the [node js website](https://nodejs.org/en/).


Moreover, we strongly recommend that you install python 3, which can be downloaded on the
[python website](https://www.python.org/downloads/).

Advanced users may be able to install these using a package manager like homebrew or apt.

## Dependencies
Once node and npm are installed, you can install the project dependencies.

Through the commaned line, navigate into the project directory and run the following:
```
npm install
```

This should install the dependencies required

## Setting up the .env File
CutTris relies on a variety of environment variables stored in a .env file.

To make it easier to generate this file, we have provided a python script.
Simply open the command-line, navigate to the CutTris Folder, and run the following:
```
python3 generate_config.py
```

Then, follow the instructions on screen.

It will ask for four inputs, and you can leave each one blank to use default values.

# Running the Project
To locally run CutTris, navigate into the project directory through your command line and run the following:
```
npm run start
```

You should get a console output along the lines of:
```
Listening on http://{ip}:{port}
```

Open the url in a browser it gives you to launch CutTris.

# Playing the Game
## Basic Gameplay
This section requires a basic knowledge of the game Tetris. 
If you would like extra resources for this, we recommend reading through 
[this page on the tetris wiki](https://tetris.fandom.com/wiki/Gameplay_overview).

When you open up the tetris website, you will be greeted by two tetris boards.
The one on the left represents your board, and the one on the right represents 
your opponent. You will see a box on the left of your board; this box will display 
your currently held piece (starts off with no piece).

When your opponent connects, they will be abel to control their board and you will 
see their actions live.

The first user to clear 40 lines will win. Alternatively, a player
can lose prematurely if they go past the top-center of the board (i.e.
a newly spawned piece will clash with one of the already placed pieces).

Cut Code relies on alerts to tell you when you have won or lost, so please make 
sure your browswer allows that.

Once someone wins, the game automatically resets. If a user disconnects, the next user 
to connect will fill their spot. If both players disconnect, the spot of the player
that started the game will be filled first. 

*NOTE: The current version of CutTris only supports one 2-player game at a time.* 
*So, a third user that tries to connect during an active game will be unable to play* 
*unless one of the players drops.*

## Controls
- Hard Drop -- `[Space]`
- Soft Drop -- `[Down Arrow]`
- Move Piece Left -- `[Left Arrow]`
- Move Piece Right --`Right Arrow]`
- Rotate Piece Left -- `z`
- Rotate Piece Right -- `x`
- (Swap) Hold Piece -- `c`