export const useYandexMetrika = () => {
    const isMetrikaLoaded = ref(false)

    const createMetrika = () => {
        if(isMetrikaLoaded.value) return

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.innerHTML = `
            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () {
                    (m[i].a = m[i].a || []).push(arguments)
                };
                m[i].l = 1 * new Date();
                for(var j = 0; j < document.scripts.length; j++){
                    if (document.scripts[j].src === r) { return; }
                }
                k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=106837324', 'ym');
            ym(106837324, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: "dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce:
                true, trackLinks: true
            });
        `
        document.head.appendChild(script)

        const noscript = document.createElement('noscript')
        noscript.innerHTML = `
            <div>
                <img src="https://mc.yandex.ru/watch/106837324" style="position:absolute; left:-9999px;" alt="" />
            </div>
        `
        document.body.appendChild(noscript)
        isMetrikaLoaded.value = true
    }

    const destroyMetrika = () => {
        const scripts = document.querySelectorAll('script[data-metrika]')
        scripts.forEach(script => script.remove())

        const noscripts = document.querySelectorAll('noscript[data-metrika]')
        noscripts.forEach(noscript => noscript.remove())

        // Очищаем глобальную переменную ym
        if(window.ym){
            delete window.ym
        }

        isMetrikaLoaded.value = false
    }

    return {
        createMetrika,
        destroyMetrika,
        isMetrikaLoaded
    }
}