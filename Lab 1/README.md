# Lab 1

[Github Repo](https://github.com/dturk0610/EE465)

## My Approach

- My first approach to complete this lab was to first copy over the code from the simple triangle from lecture 4 so that I can get basic graphics working on another html. After doing that I quickly recognized the next tasks which were the drawing of different shapes, different colors for the shapes and different rendering functions. Once noticing this I broke down the rest of my approach into the shapes and functionality I wanted to ensure the program was working correctly:

1. The Ellipse/Circle

    The first shape I wanted to tackle was the ellipse/circle. This was because I figured it would be the one that would take the most amount of time to debug and get working correctly. I was wrong, thankfull, and this shape came out very quickly. However in order to expand upon the different radii for the equations used (x = c cos(theta) + a; y = d sin(theta) + b) I wanted there to be a way for the user to manipulate these radii while in the web browser. So to do this I added 4 different sliders that I connected into the code such that the user could widen/flatten the ellipse as well as change the center of the ellipse as they wished. I then noticed the instruction for having "more than 5 vertices" which prompted me to make a 5th slider for the number of divisions used for the circle. Connecting this one in was very easy as well and provides a much more interesting experience for the user.

2. Square

    This shape was simple and I figured would be easy to add in for a shape option. This shape is off centered, however, to show how easy it is to make a square anywhere.

3. Random shape

    This shape took a little bit longer to ensure that it was rendered correctly in terms of making sure the shaped didn't look like a garbled mess. When trying to draw this shape though, I wanted to find a way to specifically click on a point so that I could more easily visualize how the shape was going to be rendered. This prompted me to look for a way to print out to the console, the exact coordinate on the canvas that was click with the mouse. This made me want to make one of my last shapes on the user could draw out themselves.

4. User drawn shape

    After quickly discovering an easy way to get the coordinates click on a canvas, I made an array that would save all positions clicked on the canvas itself. After clicking 3 or more times, all clicked positions become parts of the triangles to be drawn with the triangle fan function. This is another fun interactive feature that I added in just for fun. This one enables the user to create shapes of any size and with any number of sides.

5. Star

    At this point, I wanted to make yet another more complicated shape. One of the only two that I could think of was a star. For this one I copied the circle code and make the division number set to 10, 5 for each point, 5 for each valley. I made a variable for the begining angle offset and set that to 90 degrees (converted to radians for the sinusoidal functions) so that the first point would face straight up. After looping through all of the points, one issue became obvious to me. The issue of non-convex shapes and attempting to use the fan function. Since the fan function was attempting to start drawing at the tip of the stap, it would create a fan triangle across gaps that should have been there. I fixed this issue by rolling all indecies of the star down the array by one so that the first index was actually in the first valley in the star.

6. Pac-Man

    Just for fun again, I decided to use the circle code yet again with a new variable for the open mouth angle for pac-man. This one was very easy to do and I didn't reall run into any errors with this one.

- Every shape has a unique color and/or outline (the clicking shape has an outline to differentiate it from the rest of the shapes). Some are also purposfully drawn on top of others to show that the order of drawing these shapes does matter. In order to run/interact with this webpage, either pull this repo as a whole, or download the common folder and the lab folder separately, then double click on the [lab1.html](lab1.html) file.

- Something that may be noted is that in order to make different colors for each shape, instead of using a uniform or global type color variable, I simply used different fragment shaders for each shape. This was a very easy implementation for different colors. In a possible future version of this lab I may make two or three of the shapes use the same fragment shader, but different colors. Since this wasn't explicitly stated in the lab I figured my implementation would be fine as this was one of the most suggested way that I could find on colorizing multiple shapes.
