# CutTris

Our minimalistic 2-player tetris game.

The name *CutTris* is an homage to our first project, 
[Cut Code](https://github.com/arjunk04/cut_code).

---

# Installation and Set-Up
## Pre-Requisites
- A computer with a display that has a resolution of at least 720p
- A functioning internet connection
- [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/en-US/firefox/new/)
	- Other browsers may not work
	- Please configure your browser to allow pop-ups (at least on the page that opens when CutTris launches)
- [Node.js and npm](https://nodejs.org/en/)
- [Python 3](https://www.python.org/downloads/) ***(very strongly recommended)***

## Installing Dependencies
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

This will create a file named .env that contains the port and IP address on which CutTris will be run.

Advanced users may customize their 
[delayed auto shift and auto repeat rate](https://harddrop.com/wiki/DAS) 
by opening the .env file in a text editor and adding the following lines to the bottom:
```
DAS={das}
ARR={arr}
```
Remember to replace {das} and {arr} with positive integer values.


# Running the Project
To locally run CutTris, navigate into the project directory through your command line and run the following:
```
npm run start
```

In the command-line, the program should output something like:
```
Listening on http://{ip}:{port}
```

Copy the url and open it in either Chrome or Firefox to launch CutTris.

If you are launching CutTris from the same machine that you're running the server, you may 
be able to connect to the application by opening [http://localhost:3000](http://localhost:300) in your browser.

# Playing the Game
## Basic Gameplay
This section requires a basic knowledge of the game Tetris. 
If you would like extra resources for this, we recommend reading through 
[this page on the tetris wiki](https://tetris.fandom.com/wiki/Gameplay_overview).

When you open up the tetris website, you will be greeted by two tetris boards.
The one on the left represents your board, and the one on the right represents 
your opponent. You will see a box on the left of your board; this box will display 
your currently held piece (starts off with no piece). You will also see a queue of the 
next five pieces that will be spawned.

When your opponent connects, they will be able to control their board and you will 
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

# Known Limitations
- The server can only handle one two-player game at a time
- There are no [wallkick style rotations](https://tetris.wiki/Super_Rotation_System#Wall_Kicks) for line pieces
- The game does not tell you how many lines you have cleared and how many more you need to clearn in order towin

# The Creators of CutTris
CutTris is a project created by Peter Timpane and Arjun Khanna.
If you have any questions, feel free to email either of us:
- Peter: [petert2022@headroyce.org](mailto:petert2022@headroyce.org)
- Arjun: [arjunk2022@headroyce.org](mailto:arjunk2022@headroyce.org)
