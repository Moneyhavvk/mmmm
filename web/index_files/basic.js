/**
 *
 * @authors Bert
 * @version 1.0
 */
/**
 * @description: needUpdateProfileOptions    Determine whether parent profileOptions are needed?
 * @param {*}    No param
 * @return {*} bool    Return bool
 */
function needUpdateProfileOptions() {
    let bool = false,
        profileOptions = Unit.getObjLocalStorage('profileOptions') || ''
    if (!profileOptions || typeof profileOptions.loaded == 'undefined') {
        bool = true
    }
    return bool
}
/**
 * @description: getToken    Get local token
 * @param {*} callback    callback
 * @return {*}    No return value
 */
function getToken(callback) {
    API.ajax({
        url: 'get_token',
        data: {},
        success: (response) => {
            if (response.access_token) {
                Unit.setCookie(TokenKeyName, response.access_token, { path: '/', domain: Unit.getRootDomain(), expires: 3 })
                callback ? callback() : ''
            } else {
                console.log('error:', response)
            }
        }
    })
}
/**
 * @description: getProfileOptions    Get profileOptions
 * @param {*}    No param
 * @return {*}    No return value
 */
function getProfileOptions() {
    if (!needUpdateProfileOptions()) {
        return
    }
    API.ajax({
        url: 'profile_options',
        data: {},
        method: 'get',
        success: (response) => {
            if (parseInt(response.code) == 200) {
                let updateData = response.data
                updateData.version = Version
                updateData.loaded = 1
                if (Engine == 'ps' && updateData.distance) {
                    updateData.distance.push({
                        id: '8',
                        label: 'Within this country'
                    })
                }
                Unit.setLocalStorage('profileOptions', JSON.stringify(updateData))
            } else {
                console.log('error:', response.message || '')
            }
            //this.setInitLoading()
        }
    })
}
/**
 * @description: reportTid    Report tid
 * @param {*} tidNum   Tid Name
 * @return {*}    No return value
 */
function reportTid(tidNum) {
    API.ajax({
        url: 'click_report',
        data: {
            trackId: tidNum,
            type: 1
        },
        success: function (data) {
            console.log(data)
        }
    })
}
/**
 * @description: reportEmail    Report email
 * @param {*} reportEmail   Email name
 * @return {*}    No return value
 */
function reportEmail(submitData) {
    API.ajax({
        url: 'click_report',
        data: submitData,
        success: function (data) {
            console.log(data)
        }
    })
}
/**
 * @description: setUUID    Set UUID
 * @param {*} No param
 * @return {*}    No return value
 */
function setUUID() {
    if (!Unit.getCookie('UUID')) {
        var currentLocationStr = Unit.getCookie('sign_key'),
            options = {
                path: '/',
                domain: Unit.getRootDomain(),
                expires: 1000
            }
        Unit.setCookie('UUID', md5(new Date().getTime() + Math.ceil(Math.random() * 10000000).toString() + currentLocationStr), options)
    }
}
/**
 * @description: syncLogin    Auto login
 * @param {*} No param
 * @return {*}    No return value
 */
function syncLogin() {
    if (Unit.getCookie('clientKey')) {
        if (document.getElementById('siteLoading') == null) {
            var siteLoading = document.createElement('div')
            siteLoading.id = 'siteLoading'
            siteLoading.className = 'siteLoading'
            document.body.appendChild(siteLoading)
        }
        window.location.href = isMobile ? '/spark' : '/myHome'
    } else {
        document.getElementById('siteLoading') && document.getElementById('siteLoading').remove()
    }
}
/**
 * @description: getCurrentLocation    Initialize user ip address.
 * @param {*} No param
 * @return {*}    No return value
 */
function getCurrentLocation() {
    if (Unit.getSessionStorage('currentLocation') != null) return
    API.ajax({
        url: 'current_location',
        method: 'get',
        data: {},
        success: function (response) {
            if (parseInt(response.code) == 200) {
                let updateData = response.data
                for (var key in updateData) {
                    updateData[key] == null ? (updateData[key] = '') : ''
                }
                Unit.setSessionStorage('currentLocation', JSON.stringify(updateData || {}))
            } else {
                console.log('error:', response.message || '')
            }
        }
    })
}
/**
 * @description: gtag    Return to gtag
 * @param {*} No param
 * @return {*}    No return value
 */
function gtag() {
    dataLayer.push(arguments)
}
/**
 * @description: addGtag    Initialize gtag
 * @param {*} No param
 * @return {*}    No return value
 */
function addGtag() {
    var oScript = document.createElement('script')
    oScript.type = 'text/javascript'
    oScript.async = true
    oScript.id = 'grecaptchaApi'
    oScript.src = '//www.googletagmanager.com/gtag/js'
    document.querySelector('head').appendChild(oScript)
    oScript.onload = function () {
        window.dataLayer = window.dataLayer || []
        gtag('js', new Date())
        if (typeof GAID == 'string') {
            gtag('config', GAID)
        } else {
            for (let i = 0; i < GAID.length; i++) {
                gtag('config', GAID[i])
            }
        }
    }
}
/**
 * @description: loadGrecaptcha    Initialize grecaptcha
 * @param {*} callback    callback
 * @return {*}    No return value
 */
function loadGrecaptcha(callback) {
    if (!document.querySelector('script#grecaptchaApi')) {
        var oScript = document.createElement('script')
        oScript.async = true
        oScript.type = 'text/javascript'
        oScript.id = 'grecaptchaApi'
        oScript.src = '//www.google.com/recaptcha/api.js?hl=en'
        oScript.onload = function () {
            typeof callback == 'function' ? callback() : ''
        }
        document.documentElement.appendChild(oScript)
    }
}
/**
 * @description: initAppleLogin    Initialize apple login
 * @param {*}    No param
 * @return {*}    No return value
 */
function initAppleLogin() {
    if (typeof appleSignInParams == 'undefined' || !appleSignInParams || ['/login', '/registerStep1'].indexOf(window.location.pathname) == -1) return
    var oScript = document.createElement('script')
    oScript.async = true
    oScript.type = 'text/javascript'
    oScript.src = '//appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
    oScript.onload = function () {
        AppleID.auth.init({
            clientId: appleSignInParams.clientId,
            redirectURI: appleSignInParams.redirectURI,
            usePopup: true
        })
        // Listen for authorization success.
        document.addEventListener('AppleIDSignInOnSuccess', (response) => {
            // Handle successful response.
            typeof appleIDSignInOnSuccess == 'function' ? appleIDSignInOnSuccess(response) : ''
        })

        // Listen for authorization failures.
        document.addEventListener('AppleIDSignInOnFailure', (response) => {
            // Handle error.
            typeof appleIDSignInOnFailure == 'function' ? appleIDSignInOnFailure(response) : ''
        })
    }
    document.documentElement.appendChild(oScript)
}
/**
 * @description: initGoogleLogin    Initialize google login
 * @param {*}    No param
 * @return {*}    No return value
 */
function initGoogleLogin() {
    if (typeof googleSignInParams == 'undefined' || !googleSignInParams || ['/login', '/registerStep1'].indexOf(window.location.pathname) == -1) return
    var oScript = document.createElement('script')
    oScript.async = true
    oScript.type = 'text/javascript'
    oScript.src = '//apis.google.com/js/api:client.js'
    oScript.onload = function () {
        window.gapi.load('auth2', function () {
            const auth2 = window.gapi.auth2.init(googleSignInParams)
            auth2.attachClickHandler(
                document.getElementById('google-signin'),
                {},
                (googleUser) => {
                    typeof googleSignInOnSuccess == 'function' ? googleSignInOnSuccess(googleUser) : ''
                },
                (error) => {
                    console.log(error)
                }
            )
        })
    }
    document.documentElement.appendChild(oScript)
}
/**
 * @description: addTranslate    Initialize google translate
 * @param {*}    No param
 * @return {*}    No return value
 */
function addTranslate() {
    let oScript = document.createElement('script')
    oScript.id = 'translate_google_js'
    oScript.type = 'text/javascript'
    oScript.src = '//translate.google.com/translate_a/element.js?&cb=googleTranslateElementInit'
    document.documentElement.appendChild(oScript)
}
/**
 * @description: initCookieConsent    Initialize cookieConsent
 * @param {*}    No param
 * @return {*}    No return value
 */
function initCookieConsent() {
    let oScript = document.createElement('script')
    oScript.id = 'cookie_consent_js'
    oScript.type = 'text/javascript'
    oScript.async = true
    oScript.src = '//www.termsfeed.com/public/cookie-consent/3.0.0/cookie-consent.js'
    oScript.onload = function () {
        if (typeof cookieconsent != 'undefined' && typeof cookieconsent.run != 'undefined' && !isMobile) {
            cookieconsent.run({
                notice_banner_type: 'simple',
                consent_type: 'express',
                palette: 'dark',
                language: 'en',
                cookies_policy_url: `https://www.${SiteName}.com/cookie_policy_`,
                website_name: SiteName + '.com',
                change_preferences_selector: '#changePreferences'
            })
        }
    }
    document.documentElement.appendChild(oScript)
}
/**
 * @description: addFonts    Initialize fonts
 * @param {*}    No param
 * @return {*}    No return value
 */
function addFonts() {
    var head = document.head || document.getElementsByTagName('head')[0]
    var style = document.createElement('link')
    style.href = 'https://aws-static.tmatch.com/de4/common/index/fonts.css'
    style.rel = 'stylesheet'
    style.async = true
    head.appendChild(style)
}
/**
 * @description: siteInit    Initialize site
 * @param {*}    No param
 * @return {*}    No return value
 */
function siteInit() {
    //this.setInitLoading()
    if (Env == 'dev' && !Unit.getCookie(TokenKeyName)) {
        this.getToken(getProfileOptions)
    } else {
        getProfileOptions()
    }
}
/**
 * @description: setTids    Initialize tid
 * @param {*}    No param
 * @return {*}    No return value
 */
function setTids() {
    var tid = Unit.getQueryString('tid') || ''
    var inviteCode = Unit.getQueryString('af-invitation-code') || ''
    if (tid.length > 0) {
        setTimeout(() => {
            if (Unit.getCookie('UUID')) {
                reportTid(tid)
            }
        }, 500)
        Unit.setCookie('tid', tid, { path: '/', domain: Unit.getRootDomain(), expires: 14 })
    } else if (inviteCode.length > 0) {
        setTimeout(() => {
            if (Unit.getCookie('UUID')) {
                reportTid(inviteCode)
            }
        }, 500)
    } else {
        let tidName = isMobile ? 'mobile-plus' : 'pc-na'
        setTimeout(() => {
            if (Unit.getCookie('UUID')) {
                reportTid(tidName)
            }
        }, 500)
    }
    var queryEmail = Unit.getQueryString('email') || ''
    var sendTime = Unit.getQueryString('sendTime') || ''
    var emailTag = Unit.getQueryString('emailTag') || ''
    if (queryEmail) {
        let submitData = {
            email: queryEmail || '',
            sendTime: sendTime || '',
            emailTag: emailTag || '',
            type: 2
        }
        reportEmail(submitData)
    }
    var t2 = Unit.getQueryString('t2') || ''
    if (t2) {
        Unit.setCookie('t2', t2, { path: '/', domain: Unit.getRootDomain(), expires: 14 })
    }
    var referrerPage = Unit.getQueryString('referrer_page') || ''
    if (referrerPage) {
        Unit.setCookie('referrerPage', referrerPage, { path: '/', domain: Unit.getRootDomain(), expires: 14 })
    }
    var trafficSource = Unit.getQueryString('traffic_source') || ''
    if (trafficSource) {
        Unit.setCookie('trafficSource', trafficSource, { path: '/', domain: Unit.getRootDomain(), expires: 14 })
    }
    var providerName = Unit.getQueryString('provider_name') || ''
    if (providerName) {
        Unit.setCookie('providerName', providerName, { path: '/', domain: Unit.getRootDomain(), expires: 14 })
    }
}
/**
 * @description: loadAssets    Initialize assets
 * @param {*}    No param
 * @return {*}    No return value
 */
function loadAssets() {
    var needLoadBackgroundImageDom = document.getElementsByClassName('needLoadBackgroundImage')
    for (var i = 0; i < needLoadBackgroundImageDom.length; i++) {
        var styleStr = '',
            fileUrl = '',
            staticPath = needLoadBackgroundImageDom[i].getAttribute('data-static-path') || '',
            filePath = needLoadBackgroundImageDom[i].getAttribute('data-file-path') || ''
        if (staticPath && filePath) {
            if (Env == 'dev') {
                fileUrl = '/' + staticPath + '/assets/' + filePath
            } else if (Env == 'test') {
                fileUrl = 'https://aws-static.tmatch.com/de4/statics/test/' + staticPath + '/' + filePath
            } else {
                fileUrl = 'https://aws-static.tmatch.com/de4/statics/prod/' + staticPath + '/' + filePath
            }
            styleStr = 'background-image: url(' + fileUrl + ');'
        }
        if (styleStr) {
            needLoadBackgroundImageDom[i].setAttribute('style', (needLoadBackgroundImageDom[i].getAttribute('style') || '') + styleStr)
        }
    }
}
/**
 * @description: loadApplicationLogos    Configure application icon
 * @param {*}    No param
 * @return {*}    No return value
 */
function loadApplicationLogos() {
    var staticPath = '',
        head = document.querySelector('head')
    if (Env == 'dev') {
        staticPath = '/' + Engine.toLocaleLowerCase() + '/assets/'
    } else if (Env == 'test') {
        staticPath = 'https://aws-static.tmatch.com/de4/statics/test/' + Engine.toLocaleLowerCase() + '/'
    } else {
        staticPath = 'https://aws-static.tmatch.com/de4/statics/prod/' + Engine.toLocaleLowerCase() + '/'
    }
    //add share logo
    var shareLink = document.createElement('meta')
    shareLink.setAttribute('property', 'og:image')
    shareLink.content = staticPath + 'shareLinkLogo.png'
    head.appendChild(shareLink)
    //add app logo
    var appLink = document.createElement('link')
    appLink.rel = 'apple-touch-icon-precomposed'
    appLink.href = staticPath + 'appLogo.png'
    head.appendChild(appLink)
    //add favicon
    var faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    faviconLink.href = staticPath + 'favicon.ico'
    head.appendChild(faviconLink)
}
/**
 * @description: init    Initialize page
 * @param {*}    No param
 * @return {*}    No return value
 */
function init() {
    getCurrentLocation()
    setUUID()
    setTids()
    syncLogin()
    addGtag()
    initAppleLogin()
    initGoogleLogin()
    addTranslate()
    initCookieConsent()
    addFonts()
    loadAssets()
    loadApplicationLogos()
    window.addEventListener('pageshow', function (event) {
        syncLogin()
    })
}
//Third Party Sign In Start
/**
 * @description: deleteThirdPartyRegisterInformation   Delete third-party login information.
 * @param {*}  No param
 * @return {*}   No return value
 */
function deleteThirdPartyRegisterInformation() {
    var regitsterCache = Unit.getObjSessionStorage('regitsterCache') || {}
    delete regitsterCache['googleUid']
    delete regitsterCache['appleUid']
    delete regitsterCache['identityToken']
    delete regitsterCache['tiktokUid']
    Unit.setSessionStorage('regitsterCache', JSON.stringify(regitsterCache))
}
//Apple Sign In
/**
 * @description: getAppleDataFromToken   Get Apple login information
 * @param {*}  token    Login tocken
 * @return {*}   No return value
 */
function getAppleDataFromToken(token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join('')
    )
    return JSON.parse(jsonPayload)
}
/**
 * @description: appleIDSignInOnSuccess   Login information successfully recalled to Han nationality
 * @param {*}  response    Apple login returns object.
 * @return {*}   No return value
 */
function appleIDSignInOnSuccess(response) {
    if (document.getElementsByClassName('pageLoading').length > 0) return
    Unit.setPageLoading(true)
    var appleUserInfo = getAppleDataFromToken(response.detail.authorization.id_token)
    var chooseVerifyTypeDom = document.getElementById('chooseVerifyType'),
        loginTwoVerifyDialogDom = document.getElementById('loginTwoVerifyDialog'),
        recaptchaDom = document.getElementById('g-recaptcha')
    var submitData = {
        appleUid: appleUserInfo.sub,
        identityToken: response.detail.authorization.id_token
    }
    API.ajax({
        url: 'apple/signin',
        data: submitData,
        success: function (response) {
            Unit.showElement(chooseVerifyTypeDom, false)
            Unit.showElement(loginTwoVerifyDialogDom, false)
            Unit.showElement(recaptchaDom, false)
            if (parseInt(response.code) == 200) {
                Unit.sendGA('Login_Click_Signin_Apple_PC_LoginSucceeded')
                var options = {
                    path: '/',
                    domain: Unit.getRootDomain(),
                    expires: 30
                }
                Unit.setCookie('clientKey', new Date().getTime(), options)
                window.location.href = '/' + (isMobile ? 'spark' : 'myHome')
                return false
            }
            switch (parseInt(response.code)) {
                case 30001055:
                    window.location.href = '/accountSuspended'
                    break
                case 30001007:
                    deleteThirdPartyRegisterInformation()
                    var regitsterCache = Unit.getObjSessionStorage('regitsterCache') || {}
                    regitsterCache.appleUid = submitData.appleUid
                    regitsterCache.identityToken = submitData.identityToken
                    Unit.setSessionStorage('regitsterCache', JSON.stringify(regitsterCache))
                    window.location.href = '/registerStep1'
                    break
                case 30001021:
                    window.location.href = '/reactivate?isDeleted=' + response.data.isDeleted + '&appleUid=' + submitData.appleUid + '&identityToken=' + submitData.identityToken + '&type=3'
                    break
                default:
                    alert(response.message || 'We got an error. Please try again later.')
            }
        },
        complete: function () {
            Unit.setPageLoading(false)
        }
    })
}
//Google Sign In
/**
 * @description: googleSignInOnSuccess   Google login success callback function.
 * @param {*}  googleUser    Google login returns object.
 * @return {*}   No return value
 */
function googleSignInOnSuccess(googleUser) {
    if (document.getElementsByClassName('pageLoading').length > 0) return
    Unit.setPageLoading(true)
    var chooseVerifyTypeDom = document.getElementById('chooseVerifyType'),
        loginTwoVerifyDialogDom = document.getElementById('loginTwoVerifyDialog'),
        recaptchaDom = document.getElementById('g-recaptcha')
    const profile = googleUser.getBasicProfile()
    const authInfo = googleUser.getAuthResponse()
    var googleUid = googleUser.getId(),
        idToken = authInfo.id_token
    var googleInfo = {
        googleUid,
        idToken,
        email: profile.getEmail()
    }
    var submitData = {
        googleUid,
        idToken
    }
    API.ajax({
        url: 'google/signin',
        data: submitData,
        success: function (response) {
            Unit.showElement(chooseVerifyTypeDom, false)
            Unit.showElement(loginTwoVerifyDialogDom, false)
            Unit.showElement(recaptchaDom, false)
            if (parseInt(response.code) == 200) {
                Unit.sendGA('Login_google_Successful')
                Unit.sendGA('Login_Click_Signin_Google_Mobile_LoginSucceeded')
                var options = {
                    path: '/',
                    domain: Unit.getRootDomain(),
                    expires: 30
                }
                Unit.setCookie('clientKey', new Date().getTime(), options)
                Unit.setCookie('autoSaveEmail', googleInfo.email, { path: '/', domain: Unit.getRootDomain(), expires: 7 })
                Unit.setLocalStorage('oldUser', 1)
                window.location.href = '/' + (isMobile ? 'spark' : 'myHome')
                return false
            }
            switch (parseInt(response.code)) {
                case 30001055:
                    window.location.href = '/accountSuspended'
                    break
                case 30001007:
                    deleteThirdPartyRegisterInformation()
                    var regitsterCache = Unit.getObjSessionStorage('regitsterCache') || {}
                    regitsterCache.googleUid = googleInfo.googleUid
                    regitsterCache.email = googleInfo.email
                    Unit.setSessionStorage('regitsterCache', JSON.stringify(regitsterCache))
                    window.location.href = '/registerStep1'
                    break
                case 30001021:
                    window.location.href = '/reactivate?isDeleted=' + response.data.isDeleted + '&googleUid=' + googleInfo.googleUid + '&idToken=' + googleInfo.idToken + '&type=2'
                    break
                default:
                    alert(response.message || 'We got an error. Please try again later.')
            }
        },
        complete: function () {
            Unit.setPageLoading(false)
        }
    })
}
//Third Party Sign In End
