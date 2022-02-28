# Lab 2

[Github Repo](https://github.com/dturk0610/EE465)

## My Approach

This was another fairly straight forward lab for us in get interaction and animations working. In this lab there were 6 requirements which are all listed below.

Upon opening the HTML, the user will see a rotating shape that is also immediately moving to the right from the center of the canvas. The user can click on one of the four buttons are the bottom of the page:

- Increase speed, This button will increase the speed every time that it is clicked. This has no max, so the shape could easily fly off very quickly if pressed many times. This is done using a global space variable (moveAmount) that, in unison with the direction global variable, is used to send the updated translation matrix to the GPU to render the shape correctly. This global space variable is just incremented by .003.

- Decrease speed, this button doesn't allow the speed to become negative. If this were allowed then it would make the directional changes with the WASD keys seem wrong. moveAmount decreased by .003 until it reaches zero.

- Start Rotation, starts the roation of the shape in the exact orientation that it is in. The global space variable keepRotating is set to 1 which is used to multiply into the theta increase so that theta is inceased by the (rotate amount)*keepRotating.

- Stop Rotation, the exact opposite of above, stops the rotation in the exact orientation that it is in. Sets the keepRotating variable to 0 so that theta stops being increased.

Aside from these buttons, the user can interact if one of two different ways:

- Mouse Clicking, this will make the shape 'hop' right to where the mouse is location on the canvas. The version implemented in this version will make the exact center of the shape go to the precise point of the mouse. Previous versions would make it jump slightly above if the website was scrolled at all. In the translation matrix sent to the GPU, the offset amounts are updated to be the calculated position of where the mouse is. This offset amount is always saved in the variable dirOffset, which just represents each directions offset (this is a vec2 variable).

- WASD keys, These keys would change the direction of displacement of the object. If the object has zero velocity, its direction is still updated so that if the user reduces the speed to zero, changes the direction, then increases the speed again, the shape will move the desired changed direction. When updating the previously mention dirOffset variable, the direction the object is moving (saved in dir) is multiplied component-wise by the desired moveAmount and then added to the current dirOffset components. By pressing on W, this would set the dir value to vec2(0,1) which would make the shape start moving in the positive y direction. When pressing A, this dir value is changed to vec2(-1, 0), making the shape move in the negative x direction. S: vec2(0, -1), D: vec2(1, 0).

## Requirements

1. Animation with a polygon that has more than 4 verticies.

    - This was simple, I just made a pentagon for all of the animations re-using the circle generation from the first lab and just setting the divisions count to 5. The shape is always moving, with a couple exceptions. Due to the interaction given with the buttons at the bottom of the page, the user can choose to stop rotating the shape and to decrease the displacement speed until the shape stops moving.

2. Direction changes with WASD.

    - All direction changes work as intended. W for up, A for left, S for down, D for right.

3. Increase and decrease speed buttons.

    - Increase and decrease speed buttons work as intended. With the added bonus that the decrease speed button will not allow negative speeds.

4. Mouse click jumping.

    - Mouse click jumping is working as intended.

5. Start and stop rotate.

    - Both buttons exhibit desired effects on the shape. Allowing for the preservation of the rotation between the two states.

6. Readme documentation.

In order to run/interact with this webpage, either pull this repo as a whole, or download the [common](../Common/) folder and the [lab 2](../Lab%202/) folder separately, then double click on the [lab2.html](lab2.html) file.
