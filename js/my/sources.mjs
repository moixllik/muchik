class MySources extends HTMLElement {
    constructor() {
        super();
        this.db = new Worker('/js/worker.js');
        this.tmpl = document.querySelector('#my-sources');
    }
    connectedCallback() {
        this.db.onmessage = e => { this.add(e.data) };
        this.db.postMessage(['get_sources']);
    }
    add(data) {
        this.append(this.tmpl.content.cloneNode(true));
        const it = this.children[this.children.length - 1];
        for (const k in data) {
            it.innerHTML = it.innerHTML.replaceAll(`{{ ${k} }}`, data[k]);
        }
    }
}

customElements.define('my-sources', MySources);
