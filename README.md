# Neutralinojs image gallery viewer

## About 

A pretty decent but simple image viewer with the following features:
- Displays images in a directory or selected images
- Configurable image size ranging from 10%->100%, original or max available in current viewport
- Pretty low resource usage by not brutally loading all available images but uses pagination. Page size is configurable
- Fullscreen (kinda) by double clicking images
- Slideshow with configurable interval in seconds
- Random/sequential image loading during slideshow


## Roadmap
- Fix build process and dont load entire tailwind from cdn
- Split code into a proper class hiearchy and tryhard SOLID design pattern using DRY principles
- Directory to view should be possible to supply with arguments to the binary to enable OS integration, like right clicking a folder or starting from terminal in current folder or such
- After the above, fix desktop integration for at least gnome but preferably more OSes together with installer for the same
- Keyboard shortcuts
- Use storage to save previous configs
- Split configs into its own view or place in a tab
- Add my already written image tools: duplicate image finder, mask and pathing tool, color correction and histogram tools, stable diffusion prompt guided inpaiting, upscaling and face correction
- it should be possible to extend with a plugin system where plugins are loaded by selecting javascript "plugin" files to extend the with the above features (yea, right..)