// imports
importScripts('js/sw-utils.js');


const CACHE_STATIC = 'static-v4';
const CACHE_DYNAMIC = 'dynamic-v2';
const CACHE_IMMUTABLE = 'immutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_IMMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(CACHE_STATIC)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheImmutable = caches.open(CACHE_IMMUTABLE)
        .then(cache => cache.addAll(APP_SHELL_IMMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

self.addEventListener('activate',e => {
    const borraviejos = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key.includes('static') && key !== CACHE_STATIC) {
                    return caches.delete(key);
                }
                if (key.includes('dynamic') && key !== CACHE_DYNAMIC) {
                    return caches.delete(key);
                }
            });
        });
    e.waitUntil(borraviejos)
});

self.addEventListener('fetch', e => {
    const resp = caches.match(e.request)
        .then(cache => {
            if (cache) {
                return cache;
            } else {
                return fetch(e.request)
                    .then(res => {
                        return actualizarCacheDinamico(CACHE_DYNAMIC, e.request, res);
                    });
            }
        });
    e.waitUntil(resp);
});