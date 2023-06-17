var init = _ => {
    let $form = document.querySelector('form');
    $form.onsubmit = async evt => {
        evt.preventDefault();
        let q = evt.target.q.value;
        if (q.length == 0) return false;

        let r = await fetch('./data/muchik.json'),
            data = await r.json(),
            $result = document.querySelector('#result');
        $result.innerHTML = '';
        for (let i in data) {
            let d = data[i];
            if (
                d.muchik.toLowerCase().match(q)?.length ||
                d.spanish.toLowerCase().match(q)?.length
            ) {
                $result.innerHTML += /*html*/`
<h3>${d.muchik}</h3>
<pre>${d.spanish}</pre>`;
            }
        }
    }
}