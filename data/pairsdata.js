// This document contains all the pairs for all the languages.
// Each pair is a binary array.
// Each binary is in an array of all the pairs for that contrast.
// Each contrast array is in an array with all the other contrasts belonging to the same language.
// Each language is in a dictionary (or whatever Javascript calls these) with all the languages we have as keys.
// And each such dictionary is in an array of ... only joking. The nesting has to end somewhere.


//var allPairs = {"English" : engPairArrays, "German" : deuPairArrays};

/* COMMENTED OUT FOR TESTING PURPOSES
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
['eel', 'ill'],
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
// Here's that dumb JS thing you can do, put to good use
eng_ee_i_array.contrast = 'ee/i';
eng_ee_i_array.contrastId = 'PyU54yQ74i';

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
eng_i_e_array.contrast = 'i/e';
eng_i_e_array.contrastId = 'S3a9ROc7Mu';

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
eng_e_a_array.contrast = 'e/a';
eng_e_a_array.contrastId = 'h3uuMEwWES';

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
eng_a_u_array.contrast = 'a/u';
eng_a_u_array.contrastId = 'z9xvwwGTIJ';

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
['cult', 'colt'],
['colour', 'collar'],
['tongues', 'tongs'],
['wonder', 'wander'],
['come', 'com'],
['done', 'don'],
['some', 'Somme']
];
eng_u_o_array.contrast = 'u/o';
eng_u_o_array.contrastId = 'zPIcdZKbOq';

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
eng_s_th_array.contrast = 'th/s';
eng_s_th_array.contrastId = 'hWcC9g4pry';

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
eng_f_th_array.contrast = 'th/f';
eng_f_th_array.contrastId = 'Qhr4scmitm';
*/

// FOR TESTING PURPOSES - remove after test
//var engPairArrays = [eng_z_th_array];
//var deuPairArrays = [];
// FOR TESTING PURPOSES
/*
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
eng_z_th_array.contrast = 'z/th';
eng_z_th_array.contrastId = 'd0N7qKfTDe';
*/
/* COMMENTED OUT FOR TESTING PURPOSES
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
eng_b_v_array.contrast = 'v/b';
eng_b_v_array.contrastId = 'OaLj6meiK5';

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
eng_v_w_array.contrast = 'v/w';
eng_v_w_array.contrastId = 'GAFtcg8vW5';


//with some suggestions from https://www.englishclub.com/pronunciation/minimal-pairs-l-r.htm
eng_l_r_array = [
['law', 'raw'], // 'lore', 'roar'
['low', 'row'], // 'roe'
['allow', 'a row'], // as in an argument
['alive', 'arrive'],
['fly', 'fry'],
['light', 'right'], // 'rite'
['long', 'wrong'],
['collect', 'correct'],
['glamour', 'grammar'],
['glam', 'gram'],
['glass', 'grass'],
['lace', 'race'],
['lane', 'rain'],
['lead', 'reed'], // 'read'
['leader', 'reader'],
['lighter', 'writer'],
['load', 'road'],
['lock', 'rock'],
['locker', 'rocker'],
['lot', 'rot'],
['play', 'pray'],
['belly', 'berry'],
['blew', 'brew'], // 'blue'
['blush', 'brush'],
['clash', 'crash'],
['clown', 'crown'],
['glow', 'grow'],
['lack', 'rack'],
['lamb', 'ram'],
['lice', 'rice'],
['lied', 'ride'],
['lies', 'rise'],
['lip', 'rip'],
['list', 'wrist'],
['locket', 'rocket'],
['lows', 'rose'],
['luck', 'ruck'],
['lush', 'rush'],
['pilot', 'pirate'],
['blues', 'bruise'],
['laid', 'raid'],
['lair', 'rare'],
['lamp', 'ramp'],
['lap', 'wrap'],
['late', 'rate'],
['lay', 'ray'],
['led', 'red'], // 'lead', 'read'
['leech', 'reach'],
['lentil', 'rental'],
['lid', 'rid'],
['loot', 'root'],
['loyal', 'royal'],
['blacken', 'bracken'],
['blight', 'bright'],
['flea', 'free'], // 'flee'
['fleas', 'freeze'], // 'flees', 'frees'
['gland', 'grand'],
['jelly', 'jerry'],
['lag', 'rag'],
['lagging', 'ragging'],
['lake', 'rake'],
['lank', 'rank'],
['lash', 'rash'],
['lather', 'rather'], // if long vowel in 'lather'
['laze', 'raise'], // 'raze'
['leek', 'reek'],
['leap', 'reap'],
['leer', 'rear'],
['lib', 'rib'],
['lick', 'rick'], // 'Rick'
['limb', 'rim'],
['lime', 'rhyme'],
['link', 'rink'],
['lit', 'writ'],
['loam', 'roam'],
['loaves', 'roves'],
['lob', 'rob'], // 'Rob'
['lobe', 'robe'],
['look', 'rook'],
['loom', 'room'], // if long vowel in 'room'
['lute', 'route'],
['lope', 'rope'],
['elope', 'a rope'], // maybe
['lout', 'rout'],
['lubber', 'rubber'],
['lug', 'rug'],
['lump', 'rump'],
['lung', 'rung'],
['lust', 'rust'],
['splat', 'sprat'],
['splint', 'sprint'],
['bled', 'bread'],
['fled', 'Fred'],
['flay', 'fray'],
['loud', 'rowed'],
['splay', 'spray'],
['splain', 'sprain'],
['split', 'sprit'],
['mis-splice', 'misprice'],  // maybe
['cloud', 'crowd'],
['clack', 'crack'], // 'claque'
['clamp', 'cramp'],
['clank', 'crank'],
['clap', 'crap'],
['claw', 'craw'],
['clique', 'creak'], // 'creek'
['click', 'crick'],
['climb', 'crime'],
['clit', 'crit'],
['cloak', 'croak'],
['clone', 'crone'],
['close', 'crows'],
['lavish', 'ravish'],
['glaze', 'graze'], // 'greys'
['flock', 'frock']
];



////////////
// GERMAN //
////////////

var deuPairArrays = [deu_ch_sch_array];

var deu_ch_sch_array = [
['ich', '-isch'],
['Wicht', 'wischt'],
['Kirche', 'Kirsche'],
['Männchen', 'Menschen'],
['Löcher', 'Löscher'],
['Veilchen', 'feilschen'],
['Gicht', 'Gischt'],
['welche', 'welsche'],
['wichen', 'wischen'],
['ficht', 'fischt'],
['brechen', 'Breschen'],
['mich', 'misch'],
['-malig', 'malisch'],
['selig', 'seelisch'],
['gallig', 'gallisch'],
['Märchen', 'Märschen'],
['Herrchen', 'herrschen'],
['Fällchen', 'fälschen'],
['hallig', 'Hallisch'],
['hässig', 'Hessisch'],
];

deu_ch_sch_array.contrast = 'ch/sch';

var deu_ü_u_long_array = [
['spüren', 'Spuren'],
['Tüten', 'Tuten'],
['Güte', 'gute'],
['schwül', 'schwul'],
['Mühen', 'muhen'],
['führen', 'Fuhren'],
['für', 'fuhr'],
['würde', 'wurde'],
['füge', 'Fuge'],
['Verfügung', 'Verfugung'],
['dürfte', 'durfte'],
['Bühne', 'Buhne'],
['Süd', 'Sud'],
['kürzen', 'kurzen'],
['gebührt', 'Geburt'],
['rüder', 'Ruder'],
['Füßen', 'fußen'],
['Brüder', 'Bruder'],
['Blüten', 'bluten'],
['Mythen', 'muten'],
['rühr', 'Ruhr'],
['grüß', 'Gruß'],
['stürz', 'Sturz'],
['Küchen', 'Kuchen'],
['Flüge', 'Fluge'],  // archaic?
['Züge', 'Zuge'],  // archaic?
['fürchte', 'furchte'],
['hüt', 'Hut'],
['Schüler', 'Schuler']  // family name
]



////////////
// POLISH //
////////////

// etc.

*/