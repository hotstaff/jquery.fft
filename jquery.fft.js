/*!
 * jQuery FFT Plugin v1.0.0
 * This code is javascript converted version of following VBA source:
 * Tetsuya Kawamura 川村 哲也, エンジニアのためのExcelナビシリーズ 数値計算入門, page 194, (2012)
 * ISBN 987-4-9011092-81-4 
 * 
 * Copyright 2017 Hideto Manjo
 * Released under the MIT license
 */
if (typeof(window.FFT) == 'undefined') {

    var FFT = function() {
        
    	if (window == this) {
    	    return new FFT();
    	}

    	this.init.apply(this, arguments);
        
        return this;
    };

    FFT.VERSION = '1.0';

    FFT.prototype.init = function init(){

    };

    FFT.prototype.dim = function dim(F1, F2){
    	var N = F1.length;

    	//limited 2^x 
    	while(true){
    		if( !(N & (N-1)) ){ 
    			break;	
    		}
    		N = N + 1;
    		F1.push(0);
    		F2.push(0);	
    	}
    	return N;
    };

    FFT.prototype.amplitude = function amplitude(F1,F2) {
    	var N = this.dim(F1, F2);
    	var m = N / 2;
    	var amp = [];
        for (var i = 0; i < m; i = i + 1 ){
            amp.push(Math.sqrt(F1[i] * F1[i] + F2[i] * F2[i]) ); 
        }
        return amp;
    };

    FFT.prototype.power = function power(F1,F2) {
        var N = this.dim(F1, F2);
        var m = N / 2;
        var pwr = [];
        for (var i = 0; i < m; i = i + 1 ){
            pwr.push( F1[i] * F1[i] + F2[i] * F2[i] ); 
        }
        return pwr;
    };

    FFT.prototype.phase = function phase(F1,F2) {
        var N = this.dim(F1, F2);
        var m = N / 2;
        var phs = [];
        for (var i = 0; i < m; i = i + 1 ){
            phs.push( Math.atan2(F2[i], F1[i])); 
        }
        return phs;
    };

    FFT.prototype.frequencies = function frequencies( samplingrate, F1, F2 ) {
    	var N = this.dim(F1, F2);
    	var m = N / 2;
    	var freq = [];
        for (var i = 0; i < m ; i = i + 1 ){
            freq.push( samplingrate * (i) / N ); 
        }
        return freq;
    };

    FFT.prototype.periods = function periods( samplingrate, F1, F2 ) {
        var N = this.dim(F1, F2);
        var m = N / 2;
        var prd = [];
        for (var i = 0; i < m ; i = i + 1 ){
            prd.push( N / (samplingrate * (i)) ); 
        }
        return prd;
    };

    // メソッドの定義
    FFT.prototype.calc = function calc( SW, F1, F2 ) {
    	
    	var WN;
    	var T;
    	var A1;
    	var A2;
    	var B1;
    	var B2;
    	var W1;
    	var W2;
    	var C;
    	var S;

    	//integer
    	var m;
    	var i;
    	var j;
    	var k;
    	var l;
    	var jl;
    	var jm;
    	var m1;
    	var kl;

    	N = this.dim(F1,F2);
    	INDEX = Math.log2(N);
    	DX = 1/N;

    	var PAI = 3.14159265358979;
    	WN = 2 * PAI / N; 
    	m = N; 

    	for ( l = 0; l < INDEX; l = l + 1 ){  
    		T = 0;
    		m1 = m; 
    		m = m / 2;
    		
    		for ( k = 0; k < m ; k = k + 1){ 
    			kl = k - m1;
    			C = Math.cos(T);
    			S = -SW * Math.sin(T);
    			T = T + WN;
    			for ( j = m1 ; j < N + 1 ; j = j + m1 ){
    				jl = j + kl;
    				jm = jl + m;
    				A1 = F1[jl];
    				A2 = F1[jm];
    				B1 = F2[jl];
    				B2 = F2[jm];
    				F1[jl] = A1 + A2;
    				F2[jl] = B1 + B2;
    				F1[jm] = (A1 - A2) * C + (B1 - B2) * S;
    				F2[jm] = (B1 - B2) * C - (A1 - A2) * S;
    			}
       		}
    		WN = 2 * WN;  		
    	}

    	j = 0;
    	for ( i = 0 ; i < N-1; i = i + 1 ){

    		if ( i < j ){
    			W1 = F1[j];
    			W2 = F2[j];
    			F1[j] = F1[i];
    			F2[j] = F2[i];
    			F1[i] = W1;
    			F2[i] = W2;
    		}

    		k = N / 2;
    		while( true ){
    			if (k > j){break;}	
    			j = j - k;
    			k = k / 2;
    		}
    		j = j + k; 		
    	}

    	if( SW < 0){
			for ( i =0; i < N; i = i + 1 ){
				F1[i] =  DX * F1[i];
				F2[i] =  DX * F2[i];
			}
		}

    	return [F1, F2];
    };
}