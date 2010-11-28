# Functional Geometry on Canvas

A JavaScript/HTML5 canvas port of [Frank Buss's Common Lisp implementation][buss] of a method to describe pictures as functions, as described in Peter Henderson's [_Functional Geometry_][paper] paper. Once we have a function that describes some shape, it can be easily manipulated by other functions.

Michael Grady has written a paper covering similar ground in the Journal of Computing Sciences in College; the paper is available on the [ACM Digital Library][acm] as a free download (after registration).Grady uses the canvas `drawImage` function, while this example draws the paths from scratch (as in Buss's example).

For an example of usage, see `fishes.html`, which draws a version of M.C. Escher's _Square Limit_.

[buss]: http://www.frank-buss.de/lisp/functional.html
[paper]: http://users.ecs.soton.ac.uk/ph/funcgeo.pdf 
[acm]: http://portal.acm.org/citation.cfm?id=1858583.1858597
