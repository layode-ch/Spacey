/**
 * Classe pour gérer les pages SPA.
 */
export class PageManager {
    #location;
    route;
    main;
    hash;
    publicPages;
    adminPages;
    /**
     * @constructor
     * @param {Map<string, Page>} route
     * @param {HTMLElement} main
     * @param {boolean} [hash=true]
     * @param {string[]} publicPages
     * @param {string[]} adminPages
     */
    constructor(route, main, hash = true, publicPages = [], adminPages = []) {
        this.route = route;
        this.main = main;
        this.hash = hash;
        window.addEventListener("popstate", e => {
            this.handleLocation();
        });
        this.publicPages = publicPages;
        this.adminPages = adminPages;
        this.#location = null;
    }
    /**
     * Gère le changement de page selon l'URL.
     */
    async handleLocation() {
        const location = window.location;
        let path = this.hash ? location.hash.replace("#", "") : location.pathname;
        if (path.trim() == "")
            path = "/";
        if (path === this.#location)
            return;
        if (!this.route.has(path)) {
            console.error("Page not found");
            path = "/not-found";
        }
        const page = this.route.get(path);
        this.main.innerHTML = "";
        this.main.append(page.template.content.cloneNode(true));
        page.main = this.main;
        this.#location = path;
        page.init();
    }
    /**
     * Change la page courante.
     * @param {string} page
     */
    changePage(page) {
        let path = String(page);
        if (!path.startsWith("/"))
            path = "/" + path;
        if (this.hash)
            window.location.hash = path;
        else
            window.history.pushState({}, "", path);
        this.handleLocation();
    }
}
