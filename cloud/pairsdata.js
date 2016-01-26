// This document contains all the pairs for all the languages.
// Each pair is a binary array.
// Each binary is in an array of all the pairs for that contrast.
// Each contrast array is in an array with all the other contrasts belonging to the same language.
// Each language is in an array of all the languages we have.
// And each such array is in an array of ... only joking. The nesting has to end somewhere.

var allPairs = [engPairArrays, deuPairArrays];

var engPairArrays = [eng_ee_i_array, eng_i_e_array, eng_e_a_array, eng_u_o_array, eng_a_u_array, eng_u_o_array, eng_s_th_array, eng_f_th_array, eng_z_th_array, eng_b_v_array, eng_v_w_array];

var eng_ee_i_array = [
['feet', 'fit'],
['sheep', 'ship'],
['beat', 'bit'],
['seat', 'sit'],
['heat', 'hit'],
['neat', 'nit'],
['peat', 'pit'],
['read', 'rid'],
['teat', 'tit'],
['wean', 'win'],
['wheat', 'wit'],
['seen', 'sin'],
['teen', 'tin'],
['green', 'grin'],
['greet', 'grit'],
['sheet', 'shit'],
['meal', 'mill'],
['feel', 'fill'],
['keep', 'kip'],
['eat', 'it'],
['seek', 'sick'],
['eel', 'Ill'],
['heel', 'hill'],
['sheen', 'shin'],
['leave', 'live'],
['deed', 'did'],
['bead', 'bid'],
['heed', 'hid'],
['seed', 'Sid'],
['steal', 'still'],
['Streep', 'strip'],
['wheel', 'will'],
['seal', 'sill'],
['feast', 'fist'],
['wreak', 'Rick'],
['fees', 'fizz'],
['sleet', 'slit'],
['peel', 'pill'],
['lead', 'lid'],
['cheek', 'chick'],
['heap', 'hip'],
['deep', 'dip'],
['sleep', 'slip'],
['meet', 'mitt'],
['cheap', 'chip'],
['sleeper', 'slipper'],
['deeper', 'dipper'],
['peak', 'pick'],
['bean', 'bin'],
['peach', 'pitch'],
['week', 'wick'],
['team', 'Tim'],
['keen', 'kin'],
['meek', 'Mick'],
['weaker', 'wicker'],
['beater', 'bitter'],
['weaned', 'wind']
];

var eng_i_e_array = [
['bit', 'bet'],
['sit', 'set'],
['nit', 'net'],
['pit', 'pet'],
['rid', 'red'],
['win', 'when'],
['wit', 'wet'],
['tin', 'ten'],
['mill', 'Mel'],
['fill', 'fell'],
['it', 'eat'],
['sick', 'sec'],
['hill', 'hell'],
['did', 'dead'],
['Jill', 'gel'],
['bid', 'bed'],
['hid', 'head'],
['Sid', 'said'],
['fin', 'fen'],
['pin', 'pen'],
['will', 'well'],
['sill', 'sell'],
['fist', 'fest'],
['Rick', 'wreck'],
['fizz', 'fez'],
['big', 'beg'],
['lid', 'led'],
['pig', 'peg'],
['tint', 'tent'],
['chick', 'check'],
['mitt', 'met'],
['whist', 'west'],
['pick', 'peck'],
['bin', 'Ben'],
['bill', 'bell'],
['wrist', 'rest'],
['Billy', 'belly'],
['Jim', 'gem'],
['trick', 'trek'],
['kin', 'Ken'],
['bitter', 'better'],
['wind', 'wend'],
['Livy', 'levy']
];

var eng_e_a_array = [
['bet', 'bat'],
['set', ' sat'],
['net', 'gnat'],
['pet', 'pat'],
['red', 'rad'],
['ten', 'tan'],
['eat', 'at'],
['sec', 'sack'],
['hell', 'Hal'],
['dead', 'dad'],
['bed', 'bad'],
['head', 'had'],
['said', 'sad'],
['fed', 'fad'],
['wren', 'ran'],
['rent', 'rant'],
['pedal', 'paddle'],
['fen', 'fan'],
['pen', 'pan'],
['wreck', 'rack'],
['beg', 'bag'],
['end', 'and'],
['men', 'man'],
['guess', 'gas'],
['led', 'lad'],
['met', 'mat'],
['peck', 'pack'],
['Ben', 'ban'],
['gem', 'jam'],
['lend', 'land'],
['send', 'sand'],
['merry', 'marry'],
['celery', 'salary'],
['Kenyan', 'canyon'],
['lettuce', 'lattice'],
['pellets', 'palettes'],
['trek', 'track'],
['Ken', 'can'],
['better', 'batter']
];

var eng_a_u_array = [
['bat', 'but'],
['hat', 'hut'],
['gnat', 'nut'],
['pat', 'putt'],
['tan', 'ton'],
['shat', 'shut'],
['cap', 'cup'],
['sack', 'suck'],
['Hal', 'hull'],
['dad', 'dud'],
['bad', 'bud'],
['ran', 'run'],
['rant', 'runt'],
['paddle', 'puddle'],
['fan', 'fun'],
['pan', 'pun'],
['bag', 'bug'],
['gas', 'Gus'],
['mat', 'mutt'],
['pack', 'puck'],
['ban', 'bun'],
['track', 'truck'],
['rat', 'rut'],
['mac', 'muck'],
['stack', 'stuck'],
['batter', 'butter']
];

var eng_u_o_array = [
['but', 'bot'],
['hut', 'hot'],
['nut', 'not'],
['putt', 'pot'],
['shut', 'shot'],
['cup', 'cop'],
['suck', 'sock'],
['shun', 'shone'],
['run', 'Ron'],
['bug', 'bog'],
['Gus', 'goss'],
['pug', 'pog'],
['chuck', 'choc'],
['tum', 'Tom'],
['rut', 'rot'],
['muck', 'mock'],
['stuck', 'stock'],
['colt', 'cult'],
['colour', 'collar']
];

var eng_s_th_array = [
['sing', 'thing'],
['sought', 'thought'],
['mouse', 'mouth'],
['purse', 'Perth'],
['worse', 'worth'],
['surd', 'third'],
['sore', 'thaw'],
['sank', 'thank'],
['sink', 'think'],
['sump', 'thump'],
['sick', 'thick'],
['miss', 'myth'],
['tense', 'tenth'],
['moss', 'moth'],
['force', 'forth'],
['pass', 'path'],
['sigh', 'thigh'],
['seam', 'theme'],
['gross', 'growth'],
['sin', 'thin'],
['face', 'faith'],
['some', 'thumb'],
['sawn', 'thorn'],
['race', 'wraith'],
['song', 'thong'],
['serum', 'theorem']
];

var eng_f_th_array = [
['fought', 'thought'],
['furred', 'third'],
['for', 'thaw'],
['miff', 'myth'],
['fin', 'thin'],
['fawn', 'thorn'],
['barf', 'bath'],
['doff', 'doth'],
['roof', 'Ruth']
];

var eng_z_th_array = [
['bays', 'bathe'],
["Mao's", 'mouthe'],
['zen', 'then'],
['lays', 'lathe'],
['lows', 'loathe'],
['ties', 'tithe'],
['wizz', 'with'],
['rise', 'writhe'],
['size', 'scythe']
];

var eng_b_v_array = [
['bet', 'vet'],
['bile', 'vile'],
['bent', 'vent'],
['best', 'vest'],
['bend', 'vend'],
['berry', 'very'],
['bow', 'vow'],
['boat', 'vote'],
['bail', 'veil'],
['bat', 'vat'],
['bane', 'vain'],
['ban', 'van'],
['bicker', 'vicar'],
['bolt', 'volt']
];

var eng_v_w_array = [
['vet', 'wet'],
['veal', 'wheel/we'll'],
['vile', 'while'],
['vent', 'went'],
['vest', 'west'],
['vend', 'wend'],
['vine', 'wine'],
['verse', 'worse'],
['vow', 'wow'],
['veil', 'wail'],
['vane', 'wane'],
['vicar', 'wicker'],
['vary', 'wary']
];



////////////
// GERMAN //
////////////

var deuPairArrays = [deu_ch_sch_array];

var deu_ch_sch_array = [
['ich', '-isch']
];



////////////
// POLISH //
////////////

// etc.