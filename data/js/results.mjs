class MyResults extends HTMLElement {
    constructor() {
        super();
        this.query = location.search.slice(1).split('=');
        this.db = new Worker('/data/js/worker.js');
        this.tmpl = document.querySelector('#my-results');
    }
    connectedCallback() {
        if (this.query.length < 2) return;
        if (this.query[0] == 'q') {
            document.querySelector('input[type="search"]').value = this.query[1];
        }
        this.parentNode.style.display = 'block';
        this.db.onmessage = e => { this.add(e.data) };
        this.db.postMessage(['get_results', this.query]);
    }
    add(data) {
        this.append(this.tmpl.content.cloneNode(true));
        const it = this.children[this.children.length - 1];
        for (const k in data) {
            it.innerHTML = it.innerHTML.replaceAll(`{{ ${k} }}`, data[k]);
        }
    }
}

customElements.define('my-results', MyResults);
