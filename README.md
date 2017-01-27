# WebCam Perspective Tests (REGL) #

This is a byproduct of LW4, focusing on barrel distort and perspective distort to achive camera view correction

- It uses REGL, probably will be superseed for other library.
- Requires a Webcam to be attached.

### installation

- Download or clone this repo
- Use `npm install`
- Attach webcam.
- run `npm start`

### usage

Controls to adjust the barrel distortion
- `a`, `b`, `F`, `scale`, `fovX`, and `fovY`

Controls for perspective
- a toggle to enable/disable
- square knobs, controls the `source` control points
- bullet knobs, controls the `after` control points

####Procedure:

1. disable perspective,

2. adjust fisheye,

3. drag square knobs to the perspective origin plane (grid paper or whatever you use as reference)

4. drag bullet knobs to the corners of the canvas.

5. enable perspective.