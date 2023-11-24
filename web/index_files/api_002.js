/**
 *
 * @authors Bert
 * @version 1.0
 */
var API = (function () {
    var API = function () {
        return new API.fn.init()
    }
    API.fn = API.prototype = {
        constructor: API,
        init: function () {
            this.AJAX_RETRY_COUNT = {}
            this.holdRequest = []
            this.onNoTokenRequet = []
            this.isSentRefreshToken = false
            this.hasAccessToken = false
            /**
             * @description: setCookie               Set cookie value
             * @param {*} name, value, options       name--key value, value--value, option--set cookie related configuration
             * @return {*}                           No return value
             */
            this.setCookie = function (name, value, options) {
                if (options.expires) {
                    var expires = new Date()
                    expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000)
                }
                //The function of the encodeURI method is to encode, the main control character has special characters.
                var str = name + '=' + encodeURI(value) + (expires ? '; expires=' + expires.toGMTString() : '') + (options.path ? '; path=' + options.path : '/') + (options.domain ? '; domain=' + options.domain : '')
                document.cookie = str
            }
            /**
             * @description: delCookie               Delete cookie value
             * @param {*} name, obj                  name--key value, obj--delete cookie related configuration
             * @return {*}                           No return value
             */
            this.delCookie = function (name, obj) {
                this.setCookie(name, '', obj)
            }
            this.getCookie = function getCookie(name) {
                var search = name + '=',
                    offset,
                    end
                if (document.cookie.length > 0) {
                    offset = document.cookie.indexOf(search)
                    if (offset != -1) {
                        offset += search.length
                        end = document.cookie.indexOf(';', offset)
                        if (end == -1) {
                            end = document.cookie.length
                        }
                        return decodeURI(document.cookie.substring(offset, end))
                    }
                }
                return ''
            }
            /**
             * @description: getRootDomain           Get domain name address
             * @param {*}                            No Param
             * @return {*} string                    return domain name address
             */
            this.getRootDomain = function () {
                var host = window.location.hostname
                return host.split('.').slice(-2).join('.')
            }
            /**
             * @description: ajaxRequest             Send an asynchronous request
             * @param {*} Obj                        Request object
             * @return {*}                           No return value
             */
            this.ajaxRequest = function (obj) {
                var tthis = this
                var xhr = new XMLHttpRequest()
                xhr.open(obj.method || 'GET', obj.url)
                xhr.setRequestHeader('Content-Type', obj.contentType || 'application/x-www-form-urlencoded')
                for (var i = 0; i < Object.keys(obj.headers).length; i++) {
                    xhr.setRequestHeader(Object.keys(obj.headers)[i], obj.headers[Object.keys(obj.headers)[i]])
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (obj.complete && typeof obj.complete === 'function') {
                            obj.complete()
                        }
                        if (xhr.status === 200 || xhr.status === 201) {
                            if (obj.success && typeof obj.success === 'function') {
                                obj.success(JSON.parse(xhr.responseText))
                            }
                            tthis.clearRetryCount()
                        } else {
                            if (obj.error && typeof obj.error === 'function') {
                                obj.error(xhr.status)
                            }
                        }
                    }
                }
                xhr.send(Object.prototype.toString.call(obj.data) === '[object FormData]' ? obj.data : this.param(obj.data) || null)
            }
            /**
             * @description: ajax                    Asynchronous request data encapsulation
             * @param {*} Obj                        Request object
             * @return {*}                           No return value
             */
            this.ajax = function (obj) {
                if (Env != 'dev' && !this.hasAccessToken) {
                    this.onNoTokenRequet.push(obj)
                    !this.isSentRefreshToken && this.refreshToken()
                    return
                }
                var ajaxObj = Object.assign({}, obj),
                    domain = window.location.origin,
                    host = window.location.hostname,
                    apiUrl = 'https://' + host + '/api/v1/',
                    tthis = this
                if (new RegExp('de4..+?.com').test(host)) {
                    apiUrl = domain + '/api/'
                }
                typeof ajaxObj.method == 'undefined' ? (ajaxObj.method = 'POST') : ''
                ajaxObj.url = apiUrl + ajaxObj.url
                ajaxObj.data = this.sortApiData(ajaxObj.data)
                ajaxObj.headers = Object.assign(this.getAjaxHeader(ajaxObj.data, ajaxObj.method, ajaxObj.url), obj.headers || {})
                ajaxObj.success = function (response) {
                    tthis.checkLoginOut(response.code)
                    typeof obj.success == 'function' ? obj.success(response) : ''
                }
                ajaxObj.error = function (error) {
                    console.log(error)
                    typeof obj.error == 'function' ? obj.error(error) : ''
                    if (typeof error.responseJSON != 'undefined') {
                        if (!tthis.checkLoginOut(error.responseJSON.code)) {
                            var statusCode = error.status || 0
                            if ([401, 403].indexOf(statusCode) > -1 && [2000115, 2000114].indexOf(parseInt(error.responseJSON.code)) > -1) {
                                tthis.retryAjax(obj)
                            }
                            if ([500, 502, 503, 504].indexOf(statusCode) > -1) {
                                alert('Oops. There was a temporary connection problem. Please try again.')
                            }
                        }
                    } else {
                        if (ajaxObj.url == 'current_token') {
                            setTimeout(function () {
                                tthis.retryAjax(obj)
                            }, 1000)
                        }
                    }
                }
                this.ajaxRequest(ajaxObj)
            }
            /**
             * @description: retryAjax               Request failed to reconnect
             * @param {*} Obj                        Request object
             * @return {*}                           No return value
             */
            this.retryAjax = function (obj) {
                if (typeof this.AJAX_RETRY_COUNT[obj.url] == 'undefined' || (typeof this.AJAX_RETRY_COUNT[obj.url] != 'undefined' && this.AJAX_RETRY_COUNT[obj.url] < 4)) {
                    this.ajax(obj)
                    if (typeof this.AJAX_RETRY_COUNT[obj.url] == 'undefined') {
                        this.AJAX_RETRY_COUNT[obj.url] = 1
                    } else {
                        this.AJAX_RETRY_COUNT[obj.url] += 1
                    }
                }
            }
            /**
             * @description: retryAjax               Clear reconnection records.
             * @param {*} url                        Request url
             * @return {*}                           No return value
             */
            this.clearRetryCount = function (url) {
                typeof this.AJAX_RETRY_COUNT[url] != 'undefined' ? delete this.AJAX_RETRY_COUNT[url] : ''
            }
            /**
             * @description: checkLoginOut           Automatically log out.
             * @param {*} code                       Error code
             * @return {*} Bool                      Bool
             */
            this.checkLoginOut = function (code) {
                if ([10001001, 2000110].indexOf(parseInt(code)) > -1) {
                    this.delCookie('clientKey', { path: '/', expires: -1, domain: this.getRootDomain() })
                    this.delCookie('remember_me', { path: '/', expires: -1, domain: this.getRootDomain() })
                    sessionStorage.clear()
                    window.location.reload()
                    return true
                } else {
                    return false
                }
            }
            /**
             * @description: getFormDataKeys         Get the request object key value
             * @param {*} data                       Request Data
             * @return {*} keys                      Return keys
             */
            this.getFormDataKeys = function (data) {
                var keys = []
                for (var key of data.keys()) {
                    keys.push(key)
                }
                keys.sort()
                return keys
            }
            /**
             * @description: sortApiData             Get sorted objects
             * @param {*} data                       Request Data
             * @return {*} object                    Return the sorted object
             */
            this.sortApiData = function (data) {
                var newkey, newObj, i
                if (Object.prototype.toString.call(data) === '[object FormData]') {
                    newkey = this.getFormDataKeys(data)
                    newObj = new FormData()
                    for (i = 0; i < newkey.length; i++) {
                        for (var j = 0; j < data.getAll(newkey[i]).length; i++) {
                            newObj.append(newkey[i], data.getAll(newkey[i])[j])
                        }
                    }
                    return newObj
                } else {
                    ;(newkey = Object.keys(data).sort()), (newObj = {})
                    for (i = 0; i < newkey.length; i++) {
                        newObj[newkey[i]] = typeof data[newkey[i]] == 'object' ? this.sortApiData(data[newkey[i]]) : data[newkey[i]]
                    }
                    return newObj
                }
            }
            /**
             * @description: param                   Serialization parameters
             * @param {*} obj                        Request Data
             * @return {*} String                    Returns the serialized string
             */
            this.param = function param(obj) {
                if (window.Qs && typeof window.Qs.stringify == 'function') {
                    return window.Qs.stringify(obj)
                } else {
                    var params = []

                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            var value = obj[key]

                            if (Array.isArray(value)) {
                                value.forEach(function (item) {
                                    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(item))
                                })
                            } else {
                                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
                            }
                        }
                    }
                    return params.join('&')
                }
            }
            /**
             * @description: getQueryString          Get the browser url parameter value.
             * @param {*} name                       Param name
             * @return {*} String                    Returns the browser url parameter value.
             */
            this.getQueryString = function (name) {
                let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
                let r = window.location.search.substr(1).match(reg)
                if (r != null) {
                    return decodeURIComponent(r[2])
                }
                return null
            }
            /**
             * @description: getAjaxHeader           Get request headers.
             * @param {*} data, method, apiName      data--request data, method--request method, apiName--request url name.
             * @return {*} Bool                      Bool
             */
            this.getAjaxHeader = function (data, method, apiName) {
                var isMobile = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent) && 'ontouchend' in document && document.body.clientWidth < 768 ? true : false,
                    t = parseInt(new Date().getTime() / 1000),
                    signKey = this.getCookie('sign_key') || md5(Math.ceil(Math.random() * 10000000).toString()),
                    nonce = Math.ceil(Math.random() * 999),
                    paramStr = this.param(data).replace(/\%20/g, '+'),
                    signature = '',
                    accessPermissions = false,
                    specialApis = ['upload_picture', 'upload_file', 'upload_timeline'],
                    specialParameters = ['file', 'url']
                if (Object.prototype.toString.call(data) === '[object FormData]') {
                    var newkey = this.getFormDataKeys(data),
                        formData = {}
                    paramStr = ''
                    for (var i = 0; i < newkey.length; i++) {
                        if (specialApis.indexOf(apiName) == -1 || (specialApis.indexOf(apiName) > -1 && specialParameters.indexOf(newkey[i]) == -1)) {
                            formData[newkey[i]] = data.get(newkey[i])
                        }
                    }
                    paramStr = this.param(formData).replace(/\%20/g, '+')
                }
                signature = md5(signKey + paramStr + nonce + t).toUpperCase()
                var returnObj = {
                    'Sign-Key': signKey,
                    Timestamp: t,
                    Nonce: nonce,
                    Signature: signature,
                    devicetype: isMobile ? 4 : 3
                }
                if (Env == 'dev') {
                    let token = this.getCookie(TokenKeyName)
                    returnObj.Token = token
                    accessPermissions = token ? true : false
                } else {
                    accessPermissions = signKey ? true : false
                }
                if (!accessPermissions) {
                    console.log('Abnormal request.')
                    return false
                }
                if (Env == 'dev') {
                    returnObj.ParamStr = paramStr
                }

                if (this.getCookie('UUID')) {
                    returnObj.UUID = this.getCookie('UUID').substring(0, 32)
                    returnObj.SUUID = this.getCookie('S_UUID') || ''
                }
                if (this.getCookie('impersonateToken')) {
                    returnObj.Token = this.getCookie('impersonateToken')
                }
                returnObj.clientversion = Version || ''
                if (!signKey) {
                    console.log('Abnormal request.')
                    return false
                }

                return returnObj
            }
            /**
             * @description: refreshToken            Refresh token
             * @param {*}                            No Param
             * @return {*}                           No return value.
             */
            this.refreshToken = function refreshToken() {
                if (Env == 'dev') return
                var cjEvent = this.getQueryString('cjevent') || ''
                var cjTid = this.getQueryString('tid') || ''
                var cje = this.getCookie('cje') || ''
                this.isSentRefreshToken = true
                var xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            // if (typeof Vue != 'undefined' && typeof Vue.$store != 'undefined' && Vue.$store.state.base.siteLoading) {
                            //     setTimeout(() => {
                            //         Vue.$store.dispatch('updateSiteLoding', false)
                            //     }, 2000)
                            // }
                            if (cjEvent.length > 0 && cje.length == 0) {
                                window.location.reload()
                            }
                            this.isSentRefreshToken = false
                            this.hasAccessToken = true
                            this.onNoTokenRequet.map((val) => {
                                this.ajax(val)
                            })
                            this.onNoTokenRequet = []
                        }
                    }
                }
                xhr.open('get', `${window.location.origin}/loading?cjevent=${cjEvent}&tid=${cjTid}`, true)
                xhr.send(null)
            }
        }
    }
    API.fn.init.prototype = API.fn
    return API
})()

API = API()
