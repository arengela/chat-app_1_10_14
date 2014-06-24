For online resources, I used:
stackoverflow.com
w3schools.com
raphaeljs.com

The libraries I used include:
jQuery
Raphael.js (including plugins like raphael.draggable and g.raphael)
Node.js

>>What I did:
I made a visual chatting application, where people can share pictures and diagrams, draw on them, and tag them them dots that begins a chat thread. 

>>Why it's interesting:
Often times, it's difficult to communicate through words alone, but when trying to communicate remotely, we have few options that allows for diagramming and annotation. This provides real-time sharing of visual information, as well as commenting on the visual information. For example, if you are chatting with a friend and giving directions about where to meet you, you can upload a map and draw the route. Or, you can share a diagram you drew, and people can comment on specific aspects of the diagram. 

>>How to use:
To start server, go to terminal, open folder, and type node chat_server.js.
Then, open index.html.
Other users can join if you are on the same ip address. Go to http://serverIPAddress:8888.
Right now, all users must enter at the same time, before any chats are started, otherwise, they will not be able to see the previous threads and errors can occur. 

If you want to set a background picture, click "Set Pic" and enter the URL of an image. 
If you want to comment on something, click "Edit Chats", which allows you to annotate the picture by clicking on any place of the board. You will be prompted to enter a title of this thread, and when a new chat is started, a sound will play. Each dot is a separate chat thread, which is red if it's new and unread, gray if red, and blue if it's the current thread you are reading, and each additional comment makes a gray marker indicating you've read the comment. If someone makes a comment on another thread, it will be a red marker, and turn gray when you've read it. To free draw, click on "Free Draw", and hold down mouse to draw on the board.

>>How it makes significant use of JavaScript:
I used mostly javascript to write the application, with node.js for the server, and raphael.js for making some of the shapes.

>>Problems I encountered:
Every input is sent in the form of a message, and then parsed on the client side to decide whether it's a chat, image, or drawing. There are probably more elegant ways to do this, but I could only figure out how to send messages. 

Additionally, I have not tested this with two computers, so I'm not sure what will happen if two people are entering information at the same time. 

