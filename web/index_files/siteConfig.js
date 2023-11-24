/**
 *
 * @authors Bert
 * @date    2023-08-29 16:08:53
 * @version 1.0
 */

var md5Loaded = false,
    qsLoaded = false,
    basicLoaded = false,
    apiLoaded = false,
    unitLoaded = false,
    siteLoading = false,
    Domain = window.location.origin,
    isMobileDevice = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent) && 'ontouchend' in document ? true : false,
    isMobile = isMobileDevice && document.body.clientWidth < 768 && document.querySelector('meta[name=viewport]') ? true : false,
    Host = window.location.hostname,
    SiteName = 'MillionaireMatch',
    mainSite = 'https://www.millionairematch.com',
    Engine = 'nmm',
    Env = 'product',
    Version = '2.5000',
    SiteSvgName = '',
    GAID = 'G-731PXD13W4',
    GRECAPTCHAKEY = '6LcXkLAeAAAAAHkdQdf1p7En7p1108DXukPGfMlb',
    ApiUrl = 'https://' + Host + '/api/v1/',
    TokenKeyName = 'access_token',
    googleSignInParams = {
        client_id: '293594344092-g4r84vgrdh41934r85inkheku13hu9me.apps.googleusercontent.com'
    },
    appleSignInParams = {
        clientId: 'com.classyapp.classy.web.login',
        redirectURI: 'https://www.millionairematch.com/login'
    }
if (['de4.' + Engine + '.com', 'de4.dist.com'].indexOf(Host) > -1) {
    Env = 'dev'
    GAID = 'G-M17HC9JRZJ'
    ApiUrl = Domain + '/api/'
    TokenKeyName = 'token'
    googleSignInParams = {
        client_id: '184052116948-nua3t25q0cg7chu6lur99nulr7a7ron5.apps.googleusercontent.com'
    }
    appleSignInParams = {
        clientId: 'com.classyapp.classy.weblocal',
        redirectURI: 'https://de4.nmm.com/login'
    }
} else if (Host.indexOf('masonvips.com') > -1) {
    Env = 'test'
    GAID = 'G-M17HC9JRZJ'
    googleSignInParams = {
        client_id: '184052116948-nua3t25q0cg7chu6lur99nulr7a7ron5.apps.googleusercontent.com'
    }
    appleSignInParams = {
        clientId: 'com.classyapp.classy.web',
        redirectURI: 'https://nmm.masonvips.com/login'
    }
}
function loadScript(url, callback) {
    var loadScript = document.createElement('script')
    loadScript.async = true
    loadScript.type = 'text/javascript'
    loadScript.onload = function () {
        typeof callback == 'function' ? callback() : ''
    }
    var src = url
    if (Env == 'dev') {
        src = '../common/assets/' + url
    }
    if (Env == 'test') {
        src = 'https://aws-static.tmatch.com/de4/statics/test/common/' + url
    }
    if (Env == 'product') {
        src = 'https://aws-static.tmatch.com/de4/statics/prod/common/' + url
    }
    loadScript.src = src
    document.documentElement.appendChild(loadScript)
}
function loadCSS(url, callback) {
    var loadCss = document.createElement('link')
    loadCss.type = 'text/css'
    loadCss.rel = 'stylesheet'
    loadCss.onload = function () {
        typeof callback == 'function' ? callback() : ''
    }
    var href = url
    if (Env == 'dev') {
        href = '../common/assets/' + url
    }
    if (Env == 'test') {
        href = 'https://aws-static.tmatch.com/de4/statics/test/common/' + url
    }
    if (Env == 'product') {
        href = 'https://aws-static.tmatch.com/de4/statics/prod/common/' + url
    }
    loadCss.href = href
    document.querySelector('head').appendChild(loadCss)
}
loadCSS('less/pc/cookieConsent.css')
loadScript('statics/js/unit.js', function () {
    unitLoaded = true
})
loadScript('statics/js/md5/index.js', function () {
    md5Loaded = true
})
loadScript('statics/js/qs/index.js', function () {
    qsLoaded = true
})
loadScript('statics/js/basic.js', function () {
    basicLoaded = true
})
loadScript('statics/js/api.js', function () {
    apiLoaded = true
})

var siteLoadTimer = null,
    siteLoadTimerCount = 0
siteLoadTimer = window.setInterval(() => {
    if (siteLoadTimerCount == 30) {
        clearInterval(siteLoadTimer)
    }
    if (md5Loaded && qsLoaded && basicLoaded && apiLoaded && unitLoaded) {
        loadGrecaptcha(typeof pageLoadGrecaptcha == 'function' ? pageLoadGrecaptcha : '')
        if (!siteLoading) {
            siteLoading = true
            if (Env != 'dev') {
                API.refreshToken()
            }
            siteInit()
        }
        if (!needUpdateProfileOptions()) {
            siteLoading = false
            init()
            clearInterval(siteLoadTimer)
        }
    }
    siteLoadTimerCount += 1
}, 1000)
