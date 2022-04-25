# Lab 4

[Github Repo](https://github.com/dturk0610/EE465)

## My Approach

Much of my approach for this lab was similar to that of the last lab. I utilized the same 3D engine that I have been continuously working on for the final project. The biggest difference is just that I needed to now add in the ability to texture an object. This was more difficult that I originally anticipated, but I was still able to get it all working. The first thing that I did was get my previous icosehedron into this scene. From here I needed to find a texture for it that I liked. After finding this I decided to start making sime minor changes to the architecture by making shaders be seperate in another js file rather than being in the html as it was starting to get a bit ridiculous to read. After getting these separated, I started to get the actual texturing working.

Getting the texture to work was a bit of a challenge admittedly. This was mostly because I was trying to develop between a Macbook and a windows machine. For some reason locally accessing a file just works in  safari, but on my windows in every browser I tried, I couldn't seem to get the cross-origin-resourcse-sharing to worl (CORS). After some tweaks I was able to get my windows machine to load a file using a local server, and I just needed to change this manually when going back to my mac. After this point I was ready to finalize the texute loading.

I used the image d20Texture.png for the texture as it helped to figure out the index issue of figuring out which indecies go where when loading the image on the object. Regardless, after messing around I was able to finally get the texture loading to work correctly and I then took it upon myself to add the feature in were it interacted with the scene's lighting the same as the previous lab. One thing to note is that many of the previous interactions from lab 4 are still present as I thought it would be interesting to allow the user to still turn the lights on and off to see the different effects it had on the die. So instead of using the previous controls for lab 3 to rotate the object, I just shifted them down the num row to 7-9.

In order to determine the exact cordinates of the texture for the object, I used a program called Asperite to open the png file and look at the coordinates. From there I was able to take the max coordinate values and divide the coordinate for a vertex by this max value to get it's texutre coordinate between 0 and 1 for gl to handle properly. In the very near future I plan to implement a obj file reading which will allow for a better experience when trying to get a new object in the scene.

While running a local server is not necessary, it can be considered useful. In order to do this, I installed node.js to both of my machines. By running:

``` cmd
    sudo npm install http-server -g
```

On my mac I was able to run an http server for the EE465 directory:

``` cmd
    http-server /PathToGithubRepo/EE465/Lab\ 5 -p 1337
```

After doing this I was able to connect to the server by putting in the url: localhost:1337/Lab%205/viewer.html. This allows for us to finally access things like the textures much easier rather than struggling with CORS. The important thing to note about this though is that the server is running in the EE465 directory. This is important since the common folder is used across all labs and therefore in the htmls is accessed by using the "../Common" which will only work if the parent directory of the labs is also viewable within the server. Just remember that once you are done using the server, ensure that you kill the process, otherwise the server will just continuously run in the background.

## Controls

### Movement

- W: Move forward based on where the player/user is looking
- A: Move left based on where the player/user is looking
- S: Move backward based on where the player/user is looking
- D: Move right based on where the player/user is looking

### View

- Click and drag with mouse: This is the main looking around functionality
- E: Look directly at the chair
- L: Turn off/on the specular lighting
- O: Turn off/on orthographic projection
- 1-6: Turn off/on corresponding light (1-3 for the 3 directional lights, 4-6 for the 3 point lights)
- 7: Rotate the D20 aroung the x-axis
- 8: Rotate the D20 aroung the y-axis
- 9: Rotate the D20 aroung the z-axis

## Requirements

1. Seeing the texture on the object when it loads

    - Pretty self explanitory, when the d20 loads we expect to see the designated texture to appear on it. This is the case and the d20 should have the texture on it, assuming you set up the server as stated above.

2. Seeing the texture on the entire object and being able to rotate with the same controls as in lab 3

    - As mention previously, I hope that this is slightly flexible as I shifted the usage keys from 1-3 to 7-9 so that the user can still toggle the lights in the scene with 1-6 to see how the lighting dynamically effects the die.

3. Discussing the controls and implementation in readme

    - Yeah, this readme should cover this as always. Above the requirements section is the controls section and all throughout there is descriptions on everything that changed for this lab to succeed.
