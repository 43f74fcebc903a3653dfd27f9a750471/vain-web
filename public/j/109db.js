/**
 * @fileoverview 43fa98a4b00a785351f0d6e5d77057f4
 * @version 0.2
 */

/// <reference lib="webworker" />

const Cname = 'ad0389679a86a26353895394cede5607';
const Cresponse = 'dc416f93bdd6fc94f87c3187c3986fd1';
const Cmax = 50;
const Ctime = 86400000;

const Cpatterns = [
    /\.(js|ts|jsx|tsx)$/,
    /\.(css|scss|sass|less)$/,
    /\.(woff2?|ttf|eot|otf)$/,
    /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
    /\.(json|xml|txt)$/,
    /\.(ico|manifest)$/
];

const Cblacklist = [
    /\.html$/,
    /\/api\//,
    /\?.*$/
];

/** @type {ServiceWorkerGlobalScope} */
const Cself = /** @type {any} */ (self);

class Cmanager {
    /**
     * @param {string} Ckey
     * @returns {Promise<Cache>}
     */
    static async Copen(Ckey) {
        return await caches.open(Ckey);
    }

    /**
     * @param {Request} Creq
     * @returns {boolean}
     */
    static Cvalid(Creq) {
        const Curl = new URL(Creq.url);

        if (Creq.method !== 'GET') return false;
        if (Curl.protocol !== 'https:' && Curl.protocol !== 'http:') return false;
        if (Cblacklist.some(Cpattern => Cpattern.test(Curl.pathname))) return false;

        return Cpatterns.some(Cpattern => Cpattern.test(Curl.pathname)) ||
            Curl.pathname.includes('/_next/static/');
    }

    /**
     * @param {Cache} Ccache
     * @returns {Promise<void>}
     */
    static async Cprune(Ccache) {
        const Ckeys = await Ccache.keys();
        if (Ckeys.length <= Cmax) return;

        const Centries = await Promise.all(
            Ckeys.map(async Creq => {
                const Cres = await Ccache.match(Creq);
                const Cdate = Cres?.headers.get('Date');
                return {
                    Creq,
                    Ctime: Cdate ? new Date(Cdate).getTime() : 0
                };
            })
        );

        Centries
            .sort((Ca, Cb) => Ca.Ctime - Cb.Ctime)
            .slice(0, Ckeys.length - Cmax)
            .forEach(({ Creq }) => Ccache.delete(Creq));
    }

    /**
     * @param {Request} Creq
     * @returns {Promise<Response>}
     */
    static async Cfetch(Creq) {
        const Ccache = await this.Copen(Cname);
        const Ccached = await Ccache.match(Creq);

        if (Ccached) {
            const Cdate = Ccached.headers.get('Date');
            if (Cdate && Date.now() - new Date(Cdate).getTime() < Ctime) {
                return Ccached;
            }
        }

        try {
            const Cnetwork = await fetch(Creq);
            if (Cnetwork.ok && this.Cvalid(Creq)) {
                const Cclone = Cnetwork.clone();
                const Cheaders = new Headers(Cclone.headers);
                Cheaders.set('Date', new Date().toISOString());

                const Cmodified = new Response(await Cclone.blob(), {
                    status: Cclone.status,
                    statusText: Cclone.statusText,
                    headers: Cheaders
                });

                await Ccache.put(Creq, Cmodified);
                await this.Cprune(Ccache);
            }
            return Cnetwork;
        } catch (Cerror) {
            if (Ccached) return Ccached;
            throw Cerror;
        }
    }
}

Cself.addEventListener('install', Cevent => {
    Cevent.waitUntil(Cself.skipWaiting());
});

Cself.addEventListener('activate', Cevent => {
    Cevent.waitUntil(
        Promise.all([
            Cself.clients.claim(),
            caches.keys().then(Ckeys =>
                Promise.all(
                    Ckeys
                        .filter(Ckey => Ckey !== Cname && Ckey !== Cresponse)
                        .map(Ckey => caches.delete(Ckey))
                )
            )
        ])
    );
});

Cself.addEventListener('fetch', Cevent => {
    if (!Cmanager.Cvalid(Cevent.request)) return;

    Cevent.respondWith(Cmanager.Cfetch(Cevent.request));
});

Cself.addEventListener('message', Cevent => {
    if (Cevent.data?.type === 'SKIP_WAITING') {
        Cself.skipWaiting();
    }
});