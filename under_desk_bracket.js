const jscad = require('@jscad/modeling');
const { cube, cuboid, cylinder, cylinderElliptic, ellipsoid, geodesicSphere, roundedCuboid, roundedCylinder, sphere, torus } = jscad.primitives;
const { translate, rotate, rotateX, rotateY, rotateZ, center } = jscad.transforms;
const { colorize, cssColors } = jscad.colors;
const { intersect, union, subtract } = jscad.booleans;

const main = () => structure(600, 300, 600);

module.exports = { main }


// config
const boxDimensions = 20;
const flangeDimensions = { x: 80, y:80, z: 4, holeSpace:0.3 }
const materialColor  = cssColors.grey;


const boxSection = (length) => 
      colorize(materialColor, cuboid({size:[boxDimensions,boxDimensions,length]}));

const flange = ({x,y,z,holeSpace}) => 
      colorize(materialColor,
	       subtract(
		   cuboid({size:[x, y, z]}),
		   translate([x*holeSpace,y*holeSpace,0],
			     cylinder({height:z, radius:4})),
		   translate([x*holeSpace,-y*holeSpace,0],
			     cylinder({height:z, radius:4})),
		   translate([-x*holeSpace,y*holeSpace,0],
			     cylinder({height:z, radius:4})),
		   translate([-x*holeSpace,-y*holeSpace,0],
			     cylinder({height:z, radius:4})),		   
	       )
	      );


const leg = (length, flange_size) =>
    union(boxSection(length),
	  translate([0, 0, length/2],
	      flange(flange_size)
	   )
    );

const bracket = (height, depth) =>
    union(
	leg(height, flangeDimensions),
	translate([(height-boxDimensions), 0, 0],
		  leg(height, flangeDimensions)),	
	translate([((height-boxDimensions)/2),0, -((height-boxDimensions)/2)],
		  rotate([0, Math.PI/2, 0],
			 boxSection(height)))
    );

const structure = (height, width, depth) =>
      center({}, union(
	  bracket(height, depth),
	  translate([0,(width-boxDimensions),0], bracket(height, depth)),
	  translate([0,(width/2)-(boxDimensions/2),-((height-boxDimensions)/2)],
		    rotate([Math.PI/2,0, 0],
			   boxSection(width-(boxDimensions*2)))),
	  translate([depth-boxDimensions,(width/2)-(boxDimensions/2), -((height-boxDimensions)/2)],
		    rotate([Math.PI/2,0,0],
			   boxSection(width-(boxDimensions*2))))	  
      ));
