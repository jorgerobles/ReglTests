WebGLImageFilter
==========

#### Fast image filters for Browsers with WebGL support ####

MIT License

Demo: [phoboslab.org/log/2013/11/webgl-image-filter](http://phoboslab.org/log/2013/11/fast-image-filters-with-webgl)

Construct a chain of image filters and apply them to an Image or Canvas element. All filters are executed by WebGL Shaders which makes them pretty fast.

Please also have a look at the excellent [glfx.js](https://github.com/evanw/glfx.js) by @evanw.


### Usage ###

```javascript
// Synopsis: create the filter object, add filters to it and apply
// it to an image

// Example:
try {
	var filter = new WebGLImageFilter();
}
catch( err ) {
	// Handle browsers that don't support WebGL
}

filter.addFilter('hue', 180);
filter.addFilter('negative');
filter.addFilter('blur', 7);
var filteredImage = filter.apply(inputImage);

// The 'filteredImage' is a canvas element. You can draw it on a 2D canvas
// or just add it to your DOM

// Use .reset() to clear the current filter chain. This is faster than creating a new
// WebGLImageFilter instance
filter.reset();
```

### Filters ###

#### Main filters ####
- `colorMatrix( matrix )` apply a the 5x5 color matrix (`Array[20]`), similar to Flash's ColorMatrixFilter
- `convolution( matrix )` apply a 3x3 convolution matrix (`Array[9]`)
- `blur( size )` blur with size in pixels

#### Presets using the main filters ####
- `brightness( amount )` change brightness. `1` increases the it two fold, `-1` halfes it
- `saturation( amount )` change saturation. `1` increases the it two fold, `-1` halfes it
- `contrast( amount )` change contrast. `1` increases the it two fold, `-1` halfes it
- `negative()` invert colors
- `hue( rotation )` rotate the hue, values are `0-360`
- `desaturate()` desaturate the image by all channels equally
- `desaturateLuminance()` desaturate the image taking the natural luminace of each channel into acocunt
- `sepia()` sepia colors
- `brownie()` vintage colors
- `vintagePinhole()` vintage colors
- `kodachrome()` vintage colors
- `technicolor()` vintage colors
- `detectEdges()` detect edges
- `sobelX()` detect edges using a horizontal sobel operator
- `sobelY()` detect edges using a vertical sobel operator
- `sharpen( amount )` sharpen
- `emboss( size )` emboss effect with size in pixels
- `polaroid()` polaroid camera effect
- `shiftToBGR()` shift colors from RGB to BGR
