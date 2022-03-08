# Lab 3

[Github Repo](https://github.com/dturk0610/EE465)

## My Approach

This lab served as an introduction to 3D transformations using matrix math. The topics explored and showcased are rotations using Euler angels (though I may explore the possibility of using quaternions sometime soon), translation-or movement-using basic offsetting and finally scaling. Each of these matricies will be shown below in the order that they appear in the code. On top of this, their execution order will also be the same.

Scale Matrix:

``` Javascript
 mat 4x4{[ scaleX,      0,      0, 0 ],
         [      0, scaleY,      0, 0 ],
         [      0,      0, scaleZ, 0 ],
         [      0,      0,      0, 1 ]};
```

Rot X Matrix:

``` Javascript
mat 4x4{[  Cos(thetaX), Sin(thetaX), 0, 0 ],
        [ -Sin(thetaX), Cos(thetaX), 0, 0 ],
        [            0,           0, 1, 0 ],
        [            0,           0, 0, 1 ]};
```

Rot Y Matrix:

``` Javascript
mat 4x4{[  Cos(thetaY), 0, Sin(thetaY), 0 ],
        [            0, 1,           0, 0 ],
        [ -Sin(thetaY), 0, Cos(thetaY), 0 ],
        [            0, 0,           0, 1 ]};
```

Rot Z Matrix:

``` Javascript
mat 4x4{[ 1,            0,           0, 0 ],
        [ 0,  Cos(thetaZ), Sin(thetaZ), 0 ],
        [ 0, -Sin(thetaZ), Cos(thetaZ), 0 ],
        [ 0,            0,           0, 1 ]};
```

The above rotation matricies can be combined into one large one simply by multiplying them together.

Translation Matrix:

``` Javascript
 mat 4x4{[ 1, 0, 0, moveX ],
         [ 0, 1, 0, moveY ],
         [ 0, 0, 1, moveZ ],
         [ 0, 0, 0,     1 ]};
```

The order in which these multiplications happen is: Scale, Rotation, Translate or SRT. These trhee matricies multiplied like this represent the transformation matrix that is applied to the object and its points. The reason for the order to be SRT is due to incorrect scalling and rotating of the obejct if it is translated first. All matrix mutiplication happening on the point occurs on the gpu rather than the cpu (in the shader not the .js file). This means that we pass our shader the matricies seperately,the scale matrix, then the full rotation matrix and finally the translation matrix.

As for the control of each of these matricies, the user can manipulate the transform of the prism by using a sequence of keys:

- Scale

    1. Y or U - These keys will grow or shrink the object in its original x-axis respectively
    2. H or J - These keys will grow or shrink the object in its original y-axis respectively
    3. N or M - These keys will grow or shrink the object in its original z-axis respectively

- Rotation

    1. Num-row key 1 - will increase the x-axis Euler rotation
    2. Num-row key 2 - will increase the y-axis Euler rotation
    3. Num-row key 3 - will increase the z-axis Euler rotation

- Translation

    1. Left, Right Arrows - Will translate the object to the left or right on the screen (-x and +x respectively)
    2. Up, Down Arrows - Will translate the object up or down on the screen (+y and -y respectively)
    3. F or B - will translate the object forward or backward into the screen. Where forward is deeper into the screen and backward is out of the screen (+z and -z respectively). One thing to keep in mind for this specific translation is that the user will not really notice it happenening until the object falls out of the viewport range. This is because this object isn't taking into account a perspective camera, but instead is being rendered as if an orthographic camera is being used. This clamps the z-axis so it makes it much more difficult for us to interpret depth.

## Requirements

1. Non-Cuboid polyhedron

    - This restriction was to help us understand the vertex mapping and triangle face mapping of the shapes we use. While a slightly more complex shape my be used, and will be soon, currently implemented is a simple parallel-piped prism of a parallelogram. - This has been updated, instead the currently implemented possibilities include a icosahedron, a not-quite-icosohedron and a octahedron. Each of course would need to have their respective section uncommented and the other commented back out.

2. Each vertex has a different color and each face interpolated between the vertex.

    - Since this code was based off the in-class code for transformation in a 3D space, this was already implemented for the shape and therefore the shape clearly shows interpolated colors between each vertex. Also, no vertex has the same color.

3. Rotations

    - All three Euler angle rotations are working as expected and by messing with the rotations through the 1-3 keys, the user can actually confirm this by falling into gimbal lock. The fastest way to see this visually is by rotating the object 90 degrees on the z axis, then rotate the object 270 degrees on the y axis. After doing this, rotating on the x or z axis will rotate the object nearly identically (if the angels are exact, then they will rotate identically). This is a side effect of using Euler angles and is able to be circumnavigated by using quaternions

4. Scaling

    - All three axis were chosen for scaling. By looking at the controls stated above one can see how to do this. One thing to keep in mind is that the scaling happens to the object based on its original axis set, so when the object is rotated to show 3 sides of the shape, an effect on the shape can be observed easily.

5. Translation

    - Once again, all three axis were chosen with the main idea focused on the X and Y axis due to the arrow keys being visually identical to the movements of the object. However, the z movement was implemented with F and B for forward and back.

6. Composition of transformations

    - All transformations are fully realized in the vertex shader due to the ease of access to multiplication with the * in glsl. However, all rotation matricies are combined in the js file using the mult functions. These are done in the ZYX order.

7. Discussion of order of composition and amount of transformation

    - While the order has already been stated (SRT - Scale, Rotate, Translate), the amount increase of each of these is identical. This can be seen in the handleInput function in the script. Where, dependent on input, the respective value is increased by this offset value, which at the time of writing this is .05.

8. Discussion of implementation and key choices

    - Both have clearly been met as the key choices are mentioned above. The only keys that had mostly arbitrary selection were the scaling keys as these were largely selected on a whim. However, one thing to note is that these keys are in a paired order going down the keyboard.

In order to run/interact with this webpage, either pull this repo as a whole, or download the [common](../Common/) folder and the [lab 3](../Lab%203/) folder separately, then double click on the [lab3.html](lab3.html) file.
