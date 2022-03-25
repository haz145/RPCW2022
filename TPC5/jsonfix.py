import re
import json

f = open('arq-son.json')
lines = f.read()
lines = re.sub('}\n{', '},{', lines)

json_obj = json.loads("{\"musicas\":[" + lines + "]}")

for el in json_obj['musicas']:
    id = re.search(r'evo(.+?)\.', el['file'])[1]
    el['id'] = id

outf = open('arq-son2.json','w')
json.dump(json_obj, outf, indent = 4, ensure_ascii=False)