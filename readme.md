## Why Animaticss

I started this project with a few goals in mind.

Primarily, I wanted a tool to help me speed up implementation of frame animations in my web projects. One of my favourite things to do is adding a bit of delight to my projects, and a lot of times this happens through simple animations that trigger on hover or other user actions. I usually use frame animations for these, but sometimes getting the number of steps and the timings right can be annoying. This tool helps me with that.

A secondary goal was to push myself to launch a “product,” however small it may be. As I’m sure is the case with many of you, I’ve had a number of projects that, for one reason or another, has been either paused indefinitely or are stuck in development hell. I was hoping that, by reducing the scope of the project, I’d be able to really get it out the door. (If you’re reading this, I may have succeeded in some way!)

Finally, I wanted to bring this method to people’s attention. In a time when animations require so many dependencies, I think it’s important to remember all the cool things we can do with very simple HTML and CSS (plus some JavaScript if you’re feeling fancy).


## Frame animations in Animaticss

To preview and generate code for animations in Animaticcs, you’ll need one single image file containing all your animation frames displayed horizontally. I might look into adding the functionality to create these strips from individual images later, but for now you’ll have to do it via image editing software. (I think there’s some ways to do it via command line, too.)


## Why use frame animations?

Here are a few benefits of using frame animations on the web:

- Compared to animation libraries, it has zero dependencies. It can be accomplished with simple HTML and CSS, even for things like hover animations. Some more complex interactions will require a few lines of JavaScript, but that’s still way better than having to load libraries.
- Compared to GIFs, it’s much lighter in size and it gives you complete control over when the animation plays, like on hover or a button press.
- Compared to loading individual frame files, it requires no preloading and only needs one file.
- With some more complex code, you can even have multiple animations stored in a single PNG file. See an example here.

Things to keep in mind:

- Unless you’re using SVG files as your source image, the animation isn’t lossless and infinitely scalable. Do keep that in mind!
- Doing big and responsive animations isn’t impossible, but it can be quite tricky. Best to stick it to small elements like icons or logos.


## What I used for this project

In an effort to keep things simple and reduce dependencies, I decided to do everything bespoke in HTML, CSS, and JS. I’ll let you take a guess as to how many times I regretted that decision.