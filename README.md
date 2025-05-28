# Word Search
## Idea
Simple word search game in with german words where you can search and select words inside a grid and try to find all in the shortest amount of time.
It is made for school, but I slowly like it myself more and more. It won't be developed on at the and of the school year (July 2025). Until then I want to have following features:

## Current State
- [x] Timer
- [x] Word searching
- [x] cell conection (not fully happy yet)
- [ ] own configuration (sizes, words, color, etc.)
- [ ] Multiplayer over Websockets with Room number
etc.

Maybe more features will follow.

## Usability
As soon as you load the tab the timer starts. I don't like this approach very much, but it's the best one I have found yet. You can select the cells you think will form a word with the mouse.
You can also click and drag to add, but not to remove. I you have selections you don't like you can remove them with ESC. To generate a new run you can press 0. To toggle the word list at the bottom you can press 1. It will also be saved in localStorage for future.
If you found a word you can press SPACE oder ENTER and it will be highlighted and removed from the word list at the bottom.

