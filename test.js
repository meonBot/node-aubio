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
	var tempo = aubio.new_aubio_tempo('default', params.win_s, params.hop_s, params.samplerate);
	var total_bpm = 0;
	var count = 0;

	while(true) {
		aubio.aubio_source_do(source, test_fvec, tmp_read);
		aubio.aubio_tempo_do(tempo, test_fvec, out_fvec);
		var is_beat = aubio.fvec_get_sample(out_fvec, 0);
		if (is_beat) {
			var last_beat = aubio.aubio_tempo_get_last_s(tempo);
			var last_bpm = aubio.aubio_tempo_get_bpm(tempo);
			console.log('found beat at %d, %d bpm', last_beat, last_bpm);
		}
		var read = tmp_read.deref();
		total_frames += read;
		if(read != params.hop_s) { break; }
	} 
	console.log('total time : %d seconds (%d frames)', (total_frames / samplerate), total_frames);

	aubio.del_aubio_source(source);
	aubio.del_aubio_tempo(tempo);
}

get_file_bpm('holden.mp3', {
	samplerate: 44100,
	win_s : 1024,
	hop_s : 512,
});
