# Lab 4

[Github Repo](https://github.com/dturk0610/EE465)

## My Approach

Oh boy, if you aren't already, you might want to sit down for this. This entire discussion of this lab will be broken up into a few sections. One of the first sections has to deal with the [3D Engine](engine.md) that I am creating. The next key feature/component that will be discussed is the underlying math and [classes](objAndClass.md) (programming objects) that were used/implemented. Finally the approach to this lab itself. The first two approaches can be found in their respective locations (linked any time either are mentioned) while this lab's approach will be detailed in full below.

## [3D Engine](engine.md) approach

The [3D Engine](engine.md) that I wanted to implement is constantly being adapted as I am adding in new features. The idea behind this [engine](engine.md) is that I wanted to have something that was very adaptable. Adaptable to the point that it would be easy enough to implement feautures such as a drag and drop of obj files or something similar. At the very least I wanted to make it so that a developer (as of right now me specifically) would be able to add new objects into the scene with as minmal lines of code as possible. More about the [engine](engine.md) specifically can be found [here](engine.md). This information will hopefully update more as I update the project and my future labs as a whole. The separation of this approach from the lab's approach will allow me to update these approach files separately so that I can reuse them in the other labs/projects that use the same [3D engine](engine.md).

## Math/class objects approach

What is meant by this approach is simply that new objects and classes were implemented into all of this code. This was namely done for easy of access to variables and to reduce weird issues that I was having with the [MV](../Common/MV.js) objects from the [MV](../Common/MV.js) code in the [Common](../Common/) folder. Another reasoning to this was due to my interest in implementing a very useful class called quaternions. More about this class will be dicussed in full here, as well as all of the other useful classes and objects that I used to fully implement this engine. This information will hopefully update more as I update the project and my future labs as a whole. The separation of this approach from the lab's approach will allow me to update these approach files separately so that I can reuse them in the other labs/projects that use the same 3D engine.

## Lab specific approach

For me, this lab served as a way to get modular lighting situations and object rendering working as I prepare and develop for the final game project for the end of the semester. Knowing that I needed to create an interactive 3D scene for that final project, I wanted to make this scene as interactive and adaptable as possible too. Because of this, the aforementioned approaches are fitting to have came first for this lab.

After working on the viewing/lighting code that was given during class, the first major challenge that I wanted to overcome was to get something to view in the scene (as the chair object had not been released yet). To do this I used the Quad class that is mentioned in the class/objects approach. After populating the scene with these quads, I needed to get the perspective camera working. This took a bunch of trouble shooting and comparing what I had to a similar scene using the [Unity Game engine](https://unity.com). After I got this working (this rendering process is outlined in the engine approach), I then needed to get types of lighting working.

The first lighting type I wanted to add in is called directional lighting. This type of light source can be best understood as a bright light source that acts as ambient type of light that affects all objects in the scene with the same angle. A good example of this would be our sun. The sun is a very bright light source that is placed far enough away from Earth such that all light that comes from it hits one large portion of the surface at the same angle.  
