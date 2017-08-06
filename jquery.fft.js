/*!
 * jQuery FFT Plugin v1.0.1
 * This code is javascript converted version of following VBA source:
 * Tetsuya Kawamura 川村 哲也, エンジニアのためのExcelナビシリーズ 数値計算入門, page 194, (2012)
 * ISBN 987-4-9011092-81-4 
 * 
 * Copyright 2017 Hideto Manjo
 * Released under the MIT license
 */

;(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.FFT = factory();
    }
}(this, function() {

    var FFT = function(settings) {
        this.settings = settings || {samplingrate: 1};
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

    FFT.prototype._forloop = function _forloop(N, callback){
        var m = N / 2;
        var ans = [];
        for (var i = 0; i < m; i = i + 1){
            ans.push( callback.call(null, i) );
        } 
        return ans;
    };

    FFT.prototype._convertTo = function _convertTo(unit, F1, F2, samplingrate){
        var sps = samplingrate || this.settings.samplingrate;
        var f;
        switch(unit){
            case 'amplitude': 
                f = function amp(i){return Math.sqrt(F1[i] * F1[i] + F2[i] * F2[i]);};
                break;
            case 'power':
                f = function pow(i){return F1[i] * F1[i] + F2[i] * F2[i];};
                break;
            case 'phase':
                f = function phs(i){return Math.atan2(F2[i], F1[i]);};
                break;
            case 'frequencies':
                f = function freq(i){return sps * (i) / N;};
                break;
            case 'periods':
                f = function prd(i){return N / (sps * (i));};
        }
        return this._forloop(this.dim(F1, F2), function(i){
                return f.call(null, i);
            });
    };

    FFT.prototype.amplitude = function amplitude(F1, F2) {
        return this._convertTo('amplitude', F1, F2, 1);
    };

    FFT.prototype.power = function power(F1, F2) {
        return this._convertTo('power', F1, F2, 1);
    };

    FFT.prototype.phase = function phase(F1, F2) {
        return this._convertTo('phase', F1, F2, 1);
    };

    FFT.prototype.frequencies = function frequencies(F1, F2, samplingrate) {
        return this._convertTo('frequencies', F1, F2, samplingrate);
    };

    FFT.prototype.periods = function periods(F1, F2, samplingrate) {
        return this._convertTo('periods', F1, F2, samplingrate);
    };

    FFT.prototype.calc = function calc(SW, F1, F2) {

    	var WN, T, A1, A2, B1, B2, W1, W2, C, S;
    	//integers
    	var m, i, j, k, l, jl, jm, m1, kl;

    	N = this.dim(F1, F2);
    	INDEX = Math.log2(N);
    	DX = 1/N;

    	var PAI = 3.14159265358979;
    	WN = 2 * PAI / N; 
    	m = N; 

    	for (l = 0; l < INDEX; l = l + 1){  
    		T = 0;
    		m1 = m; 
    		m = m / 2;
    		
    		for (k = 0; k < m ; k = k + 1){ 
    			kl = k - m1;
    			C = Math.cos(T);
    			S = -SW * Math.sin(T);
    			T = T + WN;
                
    			for (j = m1 ; j < N + 1 ; j = j + m1){
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
    	for (i = 0 ; i < N - 1; i = i + 1){

    		if ( i < j ){
    			W1 = F1[j];
    			W2 = F2[j];
    			F1[j] = F1[i];
    			F2[j] = F2[i];
    			F1[i] = W1;
    			F2[i] = W2;
    		}

    		k = N / 2;
    		while (true){
    			if (k > j){break;}	
    			j = j - k;
    			k = k / 2;
    		}
    		j = j + k; 		
    	}

    	if (SW < 0){
			for (i =0; i < N; i = i + 1){
				F1[i] =  DX * F1[i];
				F2[i] =  DX * F2[i];
			}
		}

    	return [F1, F2];
    };

    //export
    return FFT;
}));