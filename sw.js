// Service Worker - キャッシュ管理
// キャッシュバージョンを変更することで、全ての端末で最新版を強制的に取得

const CACHE_VERSION = 'v2.0.0'; // バージョンアップ!
const CACHE_NAME = `restaurant-order-system-${CACHE_VERSION}`;

// キャッシュするファイルリスト
const urlsToCache = [
    './',
    './index.html',
    './kitchen.html',
    './manifest.json',
    './manifest-kitchen.json'
];

// Service Workerのインストール時
self.addEventListener('install', (event) => {
    console.log('[SW] インストール中... バージョン:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] キャッシュを開きました');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // 新しいService Workerを即座にアクティブ化
                return self.skipWaiting();
            })
    );
});

// Service Workerのアクティブ化時
self.addEventListener('activate', (event) => {
    console.log('[SW] アクティブ化中... バージョン:', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 古いバージョンのキャッシュを削除
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // すべてのクライアントで新しいService Workerを即座に有効化
            return self.clients.claim();
        })
    );
});

// ネットワークリクエストの処理
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // HTMLファイルは常にネットワーク優先(最新版を取得)
    if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/restaurant-order-system-8855a/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // 成功したレスポンスをキャッシュに保存
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // ネットワークエラー時はキャッシュから取得
                    return caches.match(event.request);
                })
        );
    }
    // Firebase SDK等の外部リソースはネットワークのみ
    else if (url.hostname.includes('gstatic.com') || 
             url.hostname.includes('firebasedatabase.app') ||
             url.hostname.includes('googleapis.com')) {
        event.respondWith(fetch(event.request));
    }
    // その他のリソースはキャッシュ優先
    else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then((response) => {
                        // 有効なレスポンスの場合のみキャッシュ
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    });
                })
        );
    }
});

// メッセージリスナー(デバッグ用)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});
