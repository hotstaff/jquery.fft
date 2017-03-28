# jquery.fft
Simple and pure javascript FFT module.

# Simple Example
var real = [1,1,1,1];  //this is input array
var imaginary = new Array(real.length); 
imaginary.fill(0);   

//fft
	var fft = new FFT();
	fft.calc(1, real, imaginary);

	// real = [4,0,0,0]
	// imaginary = [0,0,0,0]
	// NOTE: This function rewrites orignal array.
