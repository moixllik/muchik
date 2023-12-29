const db = '/muchik/data';

async function get_tsv(path) {
    const res = await fetch(db + path);
    if (res.status != 200) return [];
    const tsv = await res.text();
    return tsv.split('\n').slice(1);
}

const actions = {
    'get_sources': async _ => {
        const sources = await get_tsv('/sources.tsv');
        for (const idx in sources) {
            const source = sources[idx].split('\t');
            if (source.length == 1) continue;
            postMessage({ key: source[0], name: source[1] });
        }
    },
    'get_results': async data => {
        const typ = data[1][0], query = data[1][1];
        const words = await get_tsv('/words.tsv');
        const send = word => {
            postMessage({
                id: word[0],
                muchik: decodeURI(word[1]),
                spanish: decodeURI(word[2])
            });
        };
        let limit = 5;
        for (const idx in words) {
            if (limit == 0) break;
            const word = words[idx].split('\t');
            if (word.length == 1) continue;
            if (typ == 'id' && query == word[0]) {
                send(word);
                break;
            }
            if (typ == 'q' && (word[1].match(query) || word[2].match(query))) {
                send(word);
                limit--;
            }
        }
    }
};

onmessage = (e) => {
    if (e.data[0] in actions) actions[e.data[0]].call(this, e.data);
};
