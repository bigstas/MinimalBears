import json
from os.path import join, split

def sqlist(pylist):
    return "'{{{}}}'".format(', '.join('"{}"'.format(x.replace("'", "''")) for x in pylist))

item_id_map = dict()

with open('item_audio.sql', 'w') as fout:
    with open('Item.json') as fin:
        fout.write('INSERT INTO "Items" (language, homophones, audio) VALUES\n')
        
        j = json.load(fin)
        values = []
        for i,x in enumerate(j['results']):
            audio_list = [join('http://www.minimalbears.com/audio/', split(a)[1]) for a in x['Audio']]
            homophone_list = x['Homophones']
            language = 1
            
            obj_id = x['objectId']
            item_id_map[obj_id] = i+1
            
            values.append('({}, {}, {})'.format(language,
                                                    sqlist(homophone_list),
                                                    sqlist(audio_list)))
        fout.write(',\n'.join(values))
        fout.write(';\n')
    
    with open('Audio.json') as fin:
        fout.write('INSERT INTO "Audio" (item, file, speaker) VALUES\n')
        
        j = json.load(fin)
        values = []
        for x in j['results']:
            filename = x['File']['name']
            item_id = item_id_map[x['Item']['objectId']]
            speaker = x['speaker']
            values.append("({}, '{}', '{}')".format(item_id, filename, speaker))
        fout.write(',\n'.join(values))
        fout.write(';\n') 