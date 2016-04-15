var aubio = require('./index.js');
var ref = require('ref');

var get_file_bpm = function(path, params) {

	var source = aubio.new_aubio_source(path, params.samplerate, params.hop_s);//params.samplerate, params.hop_s);
	var samplerate = aubio.aubio_source_get_samplerate(source);
	console.log('samplerate: ' + samplerate);
	var beats = [];
	var total_frames = 0;
	var test_fvec = aubio.new_fvec(params.hop_s);
	var out_fvec = aubio.new_fvec(params.hop_s);
	var tmp_read = ref.alloc('int'); 
	var tempo = aubio.new_aubio_beattracking(params.hop_s, params.hop_s, params.samplerate);
	var total_bpm = 0;
	var count = 0;

	while(true) {
		aubio.aubio_source_do(source, test_fvec, tmp_read);
		aubio.aubio_beattracking_do(tempo, test_fvec, out_fvec);
		var test_sample = aubio.fvec_get_sample(test_fvec, 1);
		console.log('test sample: ' + test_sample);
		var read = tmp_read.deref();
		total_frames += read;
		count = count + 1;
		total_bpm += aubio.aubio_beattracking_get_bpm(tempo);
		if(read != params.hop_s) { break; }
	} 
	console.log('total' + total_frames);
	console.log('bpm: ' + total_bpm / count);
	aubio.del_aubio_source(source);
}

get_file_bpm('holden.mp3', {
	samplerate: 44100,
	win_s : 1024,
	hop_s : 512,
});

/*var in_fvec = aubio.new_fvec(16);
var out_fvec = aubio.new_fvec(4);
aubio.fvec_ones(out_fvec);
aubio.fvec_print(in_fvec);
aubio.fvec_print(out_fvec);

var tempo = aubio.new_aubio_beattracking(16, 256, 44100);

var i = 0;

while(i < 10) {
	aubio.aubio_beattracking_do(tempo, in_fvec, out_fvec);
	console.log(aubio.aubio_beattracking_get_bpm(tempo));
	i++
}

//var test_filt = aubio.new_aubio_filter_a_weighting(44100);
//aubio.aubio_filter_do(test_fvec, test_filt);
//*/
