/**
 * @authors Bert
 * @version 1.0
 */
var Unit = (function () {
    var Unit = function () {
        return new Unit.fn.init()
    }
    Unit.fn = Unit.prototype = {
        constructor: Unit,
        init: function () {
            /**
             * @description: Remove leading and trailing spaces from string
             * @param {*} str String
             * @return {*} Sting
             */
            this.trim = function (str) {
                return str.replace(/^\s+|\s+$/g, '')
            }
            /**
             * @description: Verify email format
             * @param {*} email email
             * @return {*} {bool: bool, errMsg: errMsg, errType: 0,1,2} 0 -- right, 1 -- empty value, 2 -- wrong format
             */
            this.checkEmail = function (email) {
                var obj = { bool: true, errMsg: '', errType: 0 },
                    emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (email.trim().length == 0) {
                    obj.bool = false
                    obj.errMsg = 'Required.'
                    obj.errType = 1
                } else if (!emailReg.test(email.trim()) || this.checkEmailSiteName(email.trim())) {
                    obj.bool = false
                    obj.errMsg = 'Invalid email address.'
                    obj.errType = 2
                }
                if (obj.bool) {
                    obj = { bool: true, errMsg: '', errType: 0 }
                }
                return obj
            }
            /**
             * @description: checkEmailSiteName
             * @param {*} value String
             * @return {*} bool
             */
            this.checkEmailSiteName = function (value) {
                let idx = value.trim().indexOf('@')
                let substringStr = value
                    .trim()
                    .toLowerCase()
                    .substring(idx + 1)
                return substringStr.indexOf(SiteName.toLowerCase()) > -1 ? true : false
            }
            /**
             * @description: checkPassword
             * @param {*} value password value
             * @return {*} {bool: bool, errMsg: errMsg, errType: 0,1,2} 0 -- right, 1 -- empty value, 2 -- wrong format
             */
            this.checkPassword = function (password) {
                var obj = { bool: true, errMsg: '', errType: 0 }
                if (password.trim().length == 0) {
                    obj.bool = false
                    obj.errMsg = 'Required.'
                    obj.errType = 1
                } else if (password.trim().length < 6) {
                    obj.bool = false
                    obj.errMsg = '6 characters minimum'
                    obj.errType = 2
                }
                if (obj.bool) {
                    obj = { bool: true, errMsg: '', errType: 0 }
                }
                return obj
            }
            /**
             * @description: getRootDomain
             * @param {*} no param
             * @return {*} string Root domain
             */
            this.getRootDomain = function () {
                var host = window.location.hostname
                return host.split('.').slice(-2).join('.')
            }
            /**
             * @description: delCookie Delete cookie
             * @param {*} name, obj name--Delete cookie key obj--Delete cookie-related object parameters
             * @return {*} string Root domain
             */
            this.delCookie = function (name, obj) {
                this.setCookie(name, '', obj)
            }
            /**
             * @description: setCookie Set cookie
             * @param {*} name, obj obj name--Delete cookie key obj--Delete cookie-related object parameters
             * @return {*} string Root domain
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
             * @description: getCookie Get cookie
             * @param {*} name, cookie Key name
             * @return {*} string Cookie return value
             */
            this.getCookie = function (name) {
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
             * @description: setSessionStorage Set Session Storage
             * @param {*} name, value Key name, Value
             * @return {*} No return value
             */
            this.setSessionStorage = function (name, value) {
                if (!navigator.cookieEnabled) return
                try {
                    sessionStorage.setItem(name, value)
                } catch (e) {
                    console.log('sessionStorage cache to limit!')
                }
            }
            /**
             * @description: getSessionStorage Get Session Storage
             * @param {*} name Key name
             * @return {*} String Returns the value corresponding to the Session Storage key value
             */
            this.getSessionStorage = function (name) {
                if (!navigator.cookieEnabled) return
                return sessionStorage.getItem(name)
            }
            /**
             * @description: getObjSessionStorage Get the Session Storage value and convert it into an object and return it
             * @param {*} name Key name
             * @return {*} Obj Returns an object type value.
             */
            this.getObjSessionStorage = function (key) {
                if (!navigator.cookieEnabled) return
                return JSON.parse(sessionStorage.getItem(key))
            }
            /**
             * @description: removeSessionStorage Delete Session Storage value
             * @param {*} name Key name
             * @return {*}  No return value
             */
            this.removeSessionStorage = function (key) {
                sessionStorage.removeItem(key)
            }
            /**
             * @description: setLocalStorage Set Local Storage value
             * @param {*} name Key name
             * @return {*} No return value
             */
            this.setLocalStorage = function (name, value) {
                try {
                    localStorage.setItem(name, value)
                } catch (e) {
                    console.log('localStorage cache to limit!')
                }
            }
            /**
             * @description: getLocalStorage Get Local Storage value
             * @param {*} name Key name
             * @return {*} No return value
             */
            this.getLocalStorage = function (name) {
                if (!navigator.cookieEnabled) return
                return localStorage.getItem(name)
            }
            /**
             * @description: getObjLocalStorage Get the 获取Local Storage value and convert it into an object and return it
             * @param {*} name Key name
             * @return {*} Obj Returns an object type value.
             */
            this.getObjLocalStorage = function (key) {
                if (!navigator.cookieEnabled) return
                return JSON.parse(localStorage.getItem(key))
            }
            /**
             * @description: removeLocalStorage Delete 获取Local Storage value
             * @param {*} name Key name
             * @return {*} No return value
             */
            this.removeLocalStorage = function (key) {
                localStorage.removeItem(key)
            }
            /**
             * @description: getQueryString Get Get browser parameter value
             * @param {*} name Key name
             * @return {*} string Return string value
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
             * @description: closeDomById Hide Dom elements
             * @param {*} elementId element id
             * @return {*} return value
             */
            this.closeDomById = function (elementId) {
                elementId && document.getElementById(elementId) && document.getElementById(elementId).setAttribute('style', 'display:none;')
            }
            /**
             * @description: setPageLoading Set page loading animation
             * @param {*} bool true--show false--hide
             * @return {*} No return value
             */
            this.setPageLoading = function (bool) {
                if (bool) {
                    var pageLoading = document.createElement('div')
                    pageLoading.className = 'pageLoading'
                    document.body.appendChild(pageLoading)
                } else {
                    var pageloadingDom = document.getElementsByClassName('pageLoading')
                    for (var i = 0; i < pageloadingDom.length; i++) {
                        pageloadingDom[i].remove()
                    }
                }
            }
            /**
             * @description: sendGA GA Event packaging
             * @param {*} action, action--action data--custom object
             * @return {*} No return value
             */
            this.sendGA = function (action, data) {
                if (GAID && typeof dataLayer != 'undefined' && typeof gtag != 'undefined') {
                    var sendObj = {
                        event_category: isMobile ? 'DE4_Mobile_Statistics' : 'DE4_PC_Statistics'
                    }
                    data ? (sendObj = Object.assign(sendObj, data)) : ''
                    gtag('event', action, sendObj)
                }
            }
            /**
             * @description: showElement Set element visibility
             * @param {*} el, bool, customDisplayVa  el--dom element bool--show and hide bool value customDisplayVa--custom display attribute
             * @return {*} No return value
             */
            this.showElement = function (el, bool, customDisplayVal) {
                if (el && typeof el.setAttribute == 'function') {
                    el.setAttribute('style', 'display: ' + (bool ? 'block' : 'none') + ';')
                }
            }
            /**
             * @description: newAbGetCacheNewAb Get new ab test data
             * @param {*} No param
             * @return {*} Arrar Return ab test data
             */
            this.newAbGetCacheNewAb = function () {
                let newAB = JSON.parse(this.getLocalStorage('newAb')) || {}
                if (this.newAbIsLogined()) {
                    return newAB['logined'] || []
                } else {
                    return newAB['visitor'] || []
                }
            }
            /**
             * @description: newAbIsLogined Get login status
             * @param {*} No param
             * @return {*} Arrar Returns login status Boolean value
             */
            this.newAbIsLogined = function () {
                return this.getCookie('clientKey') ? true : false
            }
            /**
             * @description: newAbGetIdentity Get user ab identity
             * @param {*} jira
             * @return {*} int Return ab identity value
             */
            this.newAbGetIdentity = function (jira) {
                let _newAbGetCacheNewAb = this.newAbGetCacheNewAb()
                let index = -1
                for (let i = 0; i < _newAbGetCacheNewAb.length; i++) {
                    if (_newAbGetCacheNewAb[i].jira == jira) {
                        index = i
                        break
                    }
                }
                if (index > -1) {
                    return parseInt(_newAbGetCacheNewAb[index].aOrB)
                }
                return -1
            }
        }
    }
    Unit.fn.init.prototype = Unit.fn
    return Unit
})()

Unit = Unit()
