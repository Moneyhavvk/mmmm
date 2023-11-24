/**
 *
 * @authors Bert
 * @date    2023-09-05 00:00:00
 * @version 1.0
 */
var GRECAPTCHA = {
    use: true,
    init: false,
    key: '',
    response: ''
}
var loginTwoVerifySendCode = {
    type: 1
}
var delPhoneCodeCount = 0
var dialogCountDownTimer
/**
 * @description: blurEmail Lost focus verification email
 * @param {*} input Input object
 * @return {*} No return value
 */
function blurEmail(input) {
    if (!input) return
    var emailDom = document.getElementById('email'),
        emailErrorDom = document.getElementById('emailErrMsg'),
        checkObj = Unit.checkEmail(input.value),
        emailClearIcoDom = document.getElementById('emailClearIco')
    if (checkObj.bool) {
        emailDom.className = 'normal'
        emailErrorDom.innerHTML = ''
    } else {
        emailDom.className = 'err'
        emailErrorDom.innerHTML = checkObj.errMsg
    }
    emailClearIcoDom.className = 'clearIco needLoadBackgroundImage'
}
/**
 * @description: focusEmail Verify email when getting focus
 * @param {*} input Input object
 * @return {*} No return value
 */
function focusEmail(input) {
    var emailDom = document.getElementById('email'),
        emailErrorDom = document.getElementById('emailErrMsg'),
        emailClearIcoDom = document.getElementById('emailClearIco')
    emailDom.className = 'normal'
    emailErrorDom.innerHTML = ''
    emailClearIcoDom.className = 'clearIco needLoadBackgroundImage' + (emailDom.value.trim().length > 0 ? ' active' : '')
}
/**
 * @description: clearEmailValue    Clear email value
 * @param {*} No param
 * @return {*} No return value
 */
function clearEmailValue() {
    var event = window.event || arguments[0] || ''
    if (event) {
        event.preventDefault()
    }
    var emailDom = document.getElementById('email'),
        emailClearIcoDom = document.getElementById('emailClearIco')
    emailDom.value = ''
    emailClearIcoDom.className = 'clearIco needLoadBackgroundImage'
}
/**
 * @description: inputEmail Verify email when entering content
 * @param {*} input Input object
 * @return {*} No return value
 */
function inputEmail(input) {
    var emailDom = document.getElementById('email'),
        emailErrorDom = document.getElementById('emailErrMsg'),
        emailClearIcoDom = document.getElementById('emailClearIco')
    emailDom.className = 'normal'
    emailErrorDom.innerHTML = ''
    emailClearIcoDom.className = 'clearIco needLoadBackgroundImage' + (emailDom.value.trim().length > 0 ? ' active' : '')
}
/**
 * @description: setEmailSuffixList Set up email address entry prompts.
 * @param {*} No param
 * @return {*} No return value
 */
function setEmailSuffixList() {
    var emailDom = document.getElementById('email')
    var emailSuffixDom = document.getElementById('emailSuffix')
    if (!emailDom || !emailSuffixDom || emailDom.value.trim().length == 0) return
    var emailVal = emailDom.value.trim()
    var aIndex = emailDom.value.indexOf('@')
    if (aIndex > -1) {
        var newArr = [],
            afterStr = emailVal.substr(aIndex + 1)
        const suffixArr = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'outlook.com', 'aol.com']
        suffixArr.forEach(function (item) {
            if (item.substr(0, afterStr.length) == afterStr) {
                newArr.push('@' + item)
            }
        })
        var itemsInnerHtml = ''
        newArr.forEach(function (item) {
            itemsInnerHtml += '<li>' + item + '</li>'
        })
        if (itemsInnerHtml.length > 0) {
            itemsInnerHtml = '<ul>' + itemsInnerHtml + '</ul>'
        }
        emailSuffixDom.innerHTML = itemsInnerHtml
        emailVal = emailVal.substring(aIndex + 1)
        emailSuffixDom.setAttribute('style', 'display: ' + (!suffixArr.includes(emailVal) && newArr.length > 0 ? 'block' : 'none') + ';')
    } else {
        emailSuffixDom.setAttribute('style', 'display: none')
    }
}
/**
 * @description: selectEmailItem Check Prompt email address suffix.
 * @param {*} No param
 * @return {*} No return value
 */
function selectEmailItem() {
    var event = window.event || arguments[0] || ''
    if (event) {
        event.stopPropagation()
    }
    var emailDom = document.getElementById('email')
    var emailSuffixDom = document.getElementById('emailSuffix')
    var val = event.target.innerText,
        emailVal = emailDom.value.trim(),
        aIndex = emailVal.indexOf('@')
    if (val) {
        emailDom.value = emailVal.slice(0, aIndex) + val
        emailSuffixDom.setAttribute('style', 'display: none')
    }
}
/**
 * @description: tabPasswordType    Modify the password input box type.
 * @param {*} type    Input box type
 * @return {*} No return value
 */
function tabPasswordType(type) {
    var event = window.event || arguments[0] || ''
    if (event) {
        event.preventDefault()
    }
    var inputDom = document.getElementById('password'),
        tabPsdHide = document.getElementById('tabPsdHide'),
        tabPsdShow = document.getElementById('tabPsdShow')
    if (inputDom && tabPsdHide && tabPsdShow) {
        if (type == 'text') {
            tabPsdHide.className = 'tabPsd tabPsdHide needLoadBackgroundImage'
            tabPsdShow.className = 'tabPsd tabPsdShow needLoadBackgroundImage active'
        } else if (type == 'password') {
            tabPsdHide.className = 'tabPsd tabPsdHide needLoadBackgroundImage active'
            tabPsdShow.className = 'tabPsd tabPsdShow needLoadBackgroundImage'
        }
        inputDom.setAttribute('type', type)
    }
}
/**
 * @description: clearPasswordValue    Clear password value
 * @param {*} No param
 * @return {*} No return value
 */
function clearPasswordValue() {
    var event = window.event || arguments[0] || ''
    if (event) {
        event.preventDefault()
    }
    var passwordDom = document.getElementById('password'),
        passwordClearIcoDom = document.getElementById('passwordClearIco')
    passwordDom.value = ''
    passwordClearIcoDom.className = 'clearIco needLoadBackgroundImage'
}
/**
 * @description: blurPassword    Lost focus verification password
 * @param {*} input    Input object
 * @return {*}   No return value
 */
function blurPassword(input) {
    if (!input) return
    var passwordDom = document.getElementById('password'),
        passwordErrorDom = document.getElementById('passwordErrMsg'),
        checkObj = Unit.checkPassword(input.value),
        passwordClearIcoDom = document.getElementById('passwordClearIco')
    if (checkObj.bool) {
        passwordDom.className = 'normal'
        passwordErrorDom.innerHTML = ''
    } else {
        passwordDom.className = 'err'
        passwordErrorDom.innerHTML = checkObj.errMsg
    }
    passwordClearIcoDom.className = 'clearIco needLoadBackgroundImage'
}
/**
 * @description: focusPassword    Verify password when getting focus
 * @param {*} input    Input object
 * @return {*}   No return value
 */
function focusPassword(input) {
    var passwordDom = document.getElementById('password'),
        passwordErrorDom = document.getElementById('passwordErrMsg'),
        passwordClearIcoDom = document.getElementById('passwordClearIco')
    passwordDom.className = 'normal'
    passwordErrorDom.innerHTML = ''
    passwordClearIcoDom.className = 'clearIco needLoadBackgroundImage' + (passwordDom.value.length > 0 ? ' active' : '')
}
/**
 * @description: focusPassword    Enter password box input monitoring
 * @param {*} input    Input object
 * @return {*}   No return value
 */
function inputPassword(input) {
    var passwordDom = document.getElementById('password'),
        passwordErrorDom = document.getElementById('passwordErrMsg'),
        passwordClearIcoDom = document.getElementById('passwordClearIco')
    passwordDom.className = 'normal'
    passwordErrorDom.innerHTML = ''
    passwordClearIcoDom.className = 'clearIco needLoadBackgroundImage' + (passwordDom.value.length > 0 ? ' active' : '')
}
/**
 * @description: tabRemberMe    Select the rember me option
 * @param {*}    No param
 * @return {*}   No return value
 */
function tabRemberMe() {
    var checkbox = document.getElementById('rememberCheckbox')
    checkbox.className = checkbox.className.indexOf('active') > -1 ? 'checkbox' : 'checkbox active'
}
/**
 * @description: checkForm    Validate login form.
 * @param {*}    No param
 * @return {*}   No return value
 */
function checkForm() {
    let bool = true
    if (!Unit.checkEmail(document.getElementById('email').value).bool || !Unit.checkPassword(document.getElementById('password').value).bool) {
        bool = false
    }
    if (!bool) {
        blurEmail(document.getElementById('email'))
        blurPassword(document.getElementById('password'))
    }
    if (GRECAPTCHA.show && GRECAPTCHA.response.length == 0) {
        bool = false
    }
    return bool
}
/**
 * @description: changeGrecaptchaState Update verification code
 * @param {*} No param
 * @return {*} No return value
 */
function changeGrecaptchaState() {
    GRECAPTCHA.response = ''
    GRECAPTCHA.show = true
    document.getElementById('g-recaptcha').setAttribute('style', 'display: flex;')
    var scriptElement = document.querySelector('script#grecaptchaApi')
    GRECAPTCHA.init ? resetGrecaptcha() : scriptElement ? initGrecaptcha() : ''
}
/**
 * @description: resetGrecaptcha Reset verification code
 * @param {*} No param
 * @return {*} No return value
 */
function resetGrecaptcha() {
    grecaptcha.reset()
    GRECAPTCHA.show = true
    document.getElementById('g-recaptcha').setAttribute('style', 'display: flex;')
}
/**
 * @description: initGrecaptcha Initialization verification code
 * @param {*} No param
 * @return {*} No return value
 */
function initGrecaptcha() {
    var scriptElement = document.querySelector('script#grecaptchaApi')
    if (scriptElement) {
        setTimeout(() => {
            try {
                //6LcNnwIoAAAAAEeT5mJe0sH6N88OIdCIatIccGxZ  Web Site
                //6LcNnwIoAAAAAOZR_McmB_AZRrIpxSQR0DZVgjB0  API
                //var key = Env == 'dev' ? '6LcNnwIoAAAAAEeT5mJe0sH6N88OIdCIatIccGxZ' : GRECAPTCHA.key
                var key = GRECAPTCHA.key
                grecaptcha.render('g-recaptcha', {
                    sitekey: key,
                    callback: (response) => {
                        GRECAPTCHA.response = response
                    }
                })
                GRECAPTCHA.init = true
            } catch (e) {
                initGrecaptcha()
            }
        }, 1000)
    }
}
/**
 * @description: keyupLogin Press Enter to submit the form.
 * @param {*} No param
 * @return {*} No return value
 */
function keyupLogin() {
    var event = window.event || arguments[0] || ''
    if (event.keyCode === 13) {
        login()
    }
}
/**
 * @description: updateVerifyRequired   Update mandatory verification information.
 * @param {*}   No param
 * @return {*}   No return value
 */
function updateVerifyRequired() {
    API.ajax({
        url: 'verify/required',
        method: 'get',
        data: {},
        success: (response) => {
            Unit.setLocalStorage('verifyRequired', JSON.stringify(response.data))
        },
        complete: () => {}
    })
}
/**
 * @description: login   Sign in
 * @param {*}   No param
 * @return {*}   No return value
 */
function login() {
    var emailDom = document.getElementById('email'),
        emailErrorDom = document.getElementById('emailErrMsg'),
        passwordDom = document.getElementById('password'),
        passwordErrorDom = document.getElementById('passwordErrMsg'),
        loginErrDom = document.getElementById('loginErr'),
        loadingDom = document.getElementById('loginLoading'),
        chooseVerifyTypeDom = document.getElementById('chooseVerifyType'),
        loginTwoVerifyDialogDom = document.getElementById('loginTwoVerifyDialog'),
        loginTwoVerifyErrorMsgDom = document.getElementById('loginTwoVerifyErrorMsg'),
        recaptchaDom = document.getElementById('g-recaptcha')
    if (!checkForm() || loadingDom.className.indexOf('active') > -1 || document.getElementsByClassName('pageLoading').length > 0) return
    if (window.getComputedStyle(loginTwoVerifyDialogDom).display != 'none') {
        Unit.setPageLoading(true)
    } else {
        loadingDom.className = 'btnLoading active'
    }
    loginErrDom.className = 'errMsg loginErr'
    loginErrDom.innerHTML = ''
    let submitData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim()
    }
    if (GRECAPTCHA.show && GRECAPTCHA.response) {
        submitData.reCaptchaKey = GRECAPTCHA.response
    }
    if (loginTwoVerifySendCode.twoFactorCode && loginTwoVerifySendCode.twoFactorKey) {
        submitData.twoFactorKey = loginTwoVerifySendCode.twoFactorKey
        submitData.twoFactorCode = loginTwoVerifySendCode.twoFactorCode
    }
    API.ajax({
        url: 'signin',
        data: submitData,
        success: function (response) {
            if (response.code == 200) {
                let expires = document.getElementById('rememberCheckbox').className.indexOf('active') > -1 ? 30 : 1
                let options = {
                    path: '/',
                    domain: Unit.getRootDomain()
                }
                expires ? (options.expires = expires) : (expires = 1)
                Unit.setCookie('clientKey', new Date().getTime(), options)
                expires == 30 ? Unit.setCookie('remember_me', 1, options) : ''
                if (Engine == 'imm') {
                    Unit.setCookie('loc-version', 'international', { path: '/', domain: Unit.getRootDomain(), expires: 90 })
                } else if (Engine == 'nmm') {
                    Unit.setCookie('loc-version', 'www', { path: '/', domain: Unit.getRootDomain(), expires: 90 })
                }
                clearVerifyDialogs()
                Unit.showElement(recaptchaDom, false)
                if (loginTwoVerifySendCode.type == 1 && submitData.twoFactorKey && submitData.twoFactorCode) {
                    Unit.setSessionStorage('emailLoginVerify', 1)
                }
                Unit.sendGA('Login_Successful')
                Unit.setCookie('autoSaveEmail', submitData.email, { path: '/', domain: Unit.getRootDomain(), expires: 7 })
                updateVerifyRequired()
                window.location.href = '/' + (isMobile ? 'spark' : 'myHome')
                //window.location.href = 'https://de4.sdm.com:7001/' + (isMobile ? 'spark' : 'myHome')
            } else {
                if (window.getComputedStyle(loginTwoVerifyDialogDom).display != 'none') {
                    if (loginTwoVerifyErrorMsgDom) {
                        Unit.showElement(loginTwoVerifyErrorMsgDom, true)
                        loginTwoVerifyErrorMsgDom.innerHTML = response.message || 'We got an error. Please try again later.'
                    }
                }
                if (parseInt(response.code) != 30001053) {
                    Unit.showElement(recaptchaDom, false)
                    GRECAPTCHA.response = ''
                    GRECAPTCHA.show = false
                }
                if (parseInt(response.code) != 30001054) {
                    clearVerifyDialogs()
                }
                switch (parseInt(response.code)) {
                    case 30001007:
                        emailDom.className = 'err'
                        emailErrorDom.innerHTML = response.message || 'We got an error. Please try again later.' //err message
                        break
                    case 30003100:
                        if (Engine == 'imm') {
                            Unit.setCookie('loc-version', 'www', { path: '/', domain: Unit.getRootDomain(), expires: 90 })
                            window.location.reload()
                        } else if (Engine == 'nmm') {
                            Unit.setCookie('loc-version', 'international', { path: '/', domain: Unit.getRootDomain(), expires: 90 })
                            window.location.reload()
                        }
                        break
                    case 30001013:
                        passwordDom.className = 'err'
                        passwordErrorDom.innerHTML = response.message || 'We got an error. Please try again later.' //err message
                        break
                    case 30001051:
                        GRECAPTCHA.key = response.data.siteKey
                        changeGrecaptchaState()
                        break
                    case 30001052:
                        clearVerifyDialogs()
                        loginTwoVerifySendCode.email = submitData.email
                        if (response.data && response.data.phone && response.data.phoneCountry) {
                            updateUserValidateInfo({
                                email: submitData.email,
                                phone: response.data.phone || '',
                                phoneCountry: response.data.phoneCountry || '',
                                password: submitData.password,
                                twoFactorKey: response.data.twoFactorKey || '',
                                hasVideoVerify: response.data.hasVideoVerify || false
                            })
                            loginTwoVerifySendCode.phoneCountry = response.data.phoneCountry || ''
                            loginTwoVerifySendCode.phone = response.data.phone || ''
                            Unit.showElement(chooseVerifyTypeDom, true)
                        } else {
                            chooseVerifyType(1)
                            getTwoFactorCode(showVerifyDialog)
                        }
                        break
                    case 30001053:
                        this.changeGrecaptchaState()
                        break
                    case 30001054:
                        if (window.getComputedStyle(loginTwoVerifyDialogDom).display != 'none') {
                            if (loginTwoVerifyErrorMsgDom) {
                                Unit.showElement(loginTwoVerifyErrorMsgDom, true)
                                loginTwoVerifyErrorMsgDom.innerHTML = response.message || 'We got an error. Please try again later.'
                            }
                        }
                        break
                    case 30001055:
                        Unit.setCookie('autoSaveEmail', submitData.email, { path: '/', domain: Unit.getRootDomain(), expires: 7 })
                        updateSuspendedInfo({
                            disableVerify: response.data.disableVerify || 0
                        })
                        if (response.data && response.data.errCode == '30005024') {
                            updateUserValidateInfo({
                                email: submitData.email,
                                password: submitData.password,
                                key: response.data.key || '',
                                gestureVerifyPicInfo: {
                                    pic: response.data.gesturePic || '',
                                    code: response.data.gestureCode || ''
                                },
                                hasVideoVerify: !response.data.hiddenVerifyVideo || false
                            })
                        }
                        if (isMobile) {
                            if (response.data && response.data.errCode == '30005024' && Unit.getSessionStorage('toGestureVerify') == '1') {
                                window.location.href = '/gestureVerify'
                            } else {
                                window.location.href = '/accountSuspended?email=' + encodeURIComponent(submitData.email)
                            }
                        } else {
                            window.location.href = '/accountSuspended'
                        }
                        break
                    case 30001021:
                        window.location.href = '/reactivate?isDeleted=' + response.data.isDeleted + '&email=' + encodeURIComponent(submitData.email) + '&password=' + encodeURIComponent(submitData.password) + '&type=1'
                        break
                    case 30001094:
                    case 30001061:
                        window.location.href = '/sendResetPassword'
                        break
                    default: //err message
                        loginErrDom.className = 'errMsg loginErr active'
                        loginErrDom.innerHTML = response.message || 'We got an error. Please try again later.'
                        break
                }
            }
        },
        complete: function () {
            Unit.setPageLoading(false)
            loadingDom.className = 'btnLoading'
        }
    })
}
/**
 * @description: pastePhoneCode   Paste the mobile phone verification code
 * @param {*}   No param
 * @return {*}   No return value
 */
function pastePhoneCode() {
    var event = window.event || arguments[0] || ''
    var pastedText = undefined
    if (window.clipboardData && window.clipboardData.getData) {
        // IE
        pastedText = window.clipboardData.getData('Text').replace(/[^\d]/g, '')
    } else {
        pastedText = event.clipboardData.getData('Text').replace(/[^\d]/g, '')
    }
    if (pastedText) {
        var valueArr = pastedText.split('')
        for (var i = 0; i < (valueArr.length > 6 ? 6 : valueArr.length); i++) {
            document.getElementById('num' + (i + 1)).value = valueArr[i]
        }
        document.getElementById('num' + (valueArr.length < 6 ? valueArr.length : 6)).focus()
    }
}
/**
 * @description: loginTwoVerifyKeyup   Second-step verification input box monitoring.
 * @param {*}  index, type   index -- serial number, type -- Second verification type
 * @return {*}   No return value
 */
function loginTwoVerifyKeyup(index, type) {
    var event = window.event || arguments[0] || ''
    if (event.keyCode === 8) {
        tabCodeInput(index, type)
    }
    if (event.keyCode === 13) {
        checkVerifyCode()
    }
}
/**
 * @description: tabCodeInput   Verification code input tab key switches callback function.
 * @param {*}  index, type   index -- serial number, type -- Second verification type
 * @return {*}   No return value
 */
function tabCodeInput(index, type) {
    var event = window.event || arguments[0] || ''
    document.getElementById('num' + index).value = event.target.value.trim().replace(/[^\d]/g, '')
    var val = event.target.value.trim(),
        inputDom = type == 'input' ? document.getElementById('num' + (index + 1)) : document.getElementById('num' + (index - 1))
    if (val.length > 0 && inputDom && type == 'input') {
        if (document.getElementById('num' + (index + 1)).value.trim().length == 0) {
            inputDom.focus()
        } else {
            document.getElementById('num' + (index + 1)).value = ''
            inputDom.focus()
        }
    }
    if (val.length == 0 && inputDom && type == 'delete') {
        delPhoneCodeCount = parseInt(delPhoneCodeCount) + 1
        if (delPhoneCodeCount == 2) {
            delPhoneCodeCount = 0
            inputDom.focus()
        }
    }
    checkVerifyCode()
}
/**
 * @description: clickCodeInput   Verification code input box input monitoring.
 * @param {*}  index   index -- serial number
 * @return {*}   No return value
 */
function clickCodeInput(index) {
    document.getElementById('num' + index).value = ''
}
/**
 * @description: checkVerifyCode   Verify the verification code input.
 * @param {*}  No param
 * @return {*}   No return value
 */
function checkVerifyCode() {
    var loginVerifyCode = ''
    for (var i = 1; i < 7; i++) {
        loginVerifyCode += String(document.getElementById('num' + i).value.trim())
    }
    if (loginVerifyCode.length < 6) {
        return
    }
    let code = ''
    for (let i = 1; i < 7; i++) {
        let val = document.getElementById('num' + i).value.trim()
        if (!val) {
            document.getElementById('loginTwoVerifyErrorMsg').setAttribute('style', 'display: block;')
            document.getElementById('loginTwoVerifyErrorMsg').innerHTML = 'Verification code is invalid.'
            code = ''
            return false
        } else {
            code += val
        }
    }
    document.getElementById('loginTwoVerifyErrorMsg').setAttribute('style', 'display: none;')
    document.getElementById('loginTwoVerifyErrorMsg').innerHTML = ''
    if (checkForm() && document.getElementById('loginLoading').className.indexOf('active') == -1) {
        loginTwoVerifySendCode.twoFactorCode = loginVerifyCode
        login()
    } else if (!checkForm()) {
        clearVerifyDialogs()
    }
}
/**
 * @description: dialogCountDownFun   Countdown to sending verification code again.
 * @param {*}  No param
 * @return {*}   No return value
 */
function dialogCountDownFun() {
    var countDown = 80,
        loginTwoVerifyTryAgain = document.getElementById('loginTwoVerifyTryAgain')
    clearInterval(dialogCountDownTimer)
    loginTwoVerifyTryAgain.className = 'tryAgain'
    loginTwoVerifyTryAgain.innerHTML = 'Try again'
    dialogCountDownTimer = setInterval(() => {
        if (countDown < 0) {
            clearInterval(dialogCountDownTimer)
            loginTwoVerifyTryAgain.className = 'tryAgain active'
            loginTwoVerifyTryAgain.innerHTML = 'Try again'
            return
        }
        loginTwoVerifyTryAgain.innerHTML = '<span class="countTime">' + countDown + 's</span> <span>Try again</span>'
        --countDown
    }, 1000)
}
/**
 * @description: tryAgainGetTwoFactorCode   Send verification code again.
 * @param {*}  No param
 * @return {*}   No return value
 */
function tryAgainGetTwoFactorCode() {
    var loginTwoVerifyTryAgain = document.getElementById('loginTwoVerifyTryAgain')
    if (loginTwoVerifyTryAgain.className.indexOf('active') == -1) {
        return
    }
    loginTwoVerifyTryAgain.className = 'tryAgain active'
    getTwoFactorCode(showVerifyDialog)
}
/**
 * @description: getTwoFactorCode   Get the second verification code
 * @param {*}  callback    callback
 * @return {*}   No return value
 */
function getTwoFactorCode(callback) {
    loginTwoVerifySendCode.twoFactorCode = ''
    loginTwoVerifySendCode.twoFactorKey = ''
    var loading = document.getElementById('getTwoFactorCodeLoading'),
        chooseVerifyTypeBtn = document.getElementById('chooseVerifyTypeBtn'),
        pageLoading = document.getElementsByClassName('pageLoading').length > 0 ? document.getElementsByClassName('pageLoading')[0] : '',
        loginTwoVerifyDialog = document.getElementById('loginTwoVerifyDialog')
    if (loading.className.indexOf('active') > -1 || pageLoading || chooseVerifyTypeBtn.className.indexOf('disabled') > -1) return
    loading.className = 'btnLoading active'
    if (window.getComputedStyle(loginTwoVerifyDialog).display != 'none') {
        Unit.setPageLoading(true)
    }
    var submitData = {
        type: loginTwoVerifySendCode.type
    }
    if (loginTwoVerifySendCode.type == 2) {
        submitData.phoneCountry = loginTwoVerifySendCode.phoneCountry
        submitData.phone = loginTwoVerifySendCode.phone
    }
    if (loginTwoVerifySendCode.type == 1) {
        submitData.email = loginTwoVerifySendCode.email
    }
    API.ajax({
        url: 'two/factor/code',
        data: submitData,
        success: function (response) {
            if (response.code == 200 && response.data.ret) {
                loginTwoVerifySendCode.twoFactorKey = response.data.twoFactorKey
                dialogCountDownFun()
                typeof callback == 'function' ? callback() : ''
                setTimeout(() => {
                    document.getElementById('num1') && typeof document.getElementById('num1').focus == 'function' ? document.getElementById('num1').focus() : ''
                }, 100)
            } else {
                alert(response.message)
            }
        },
        complete: function () {
            loading.className = 'btnLoading'
            if (window.getComputedStyle(loginTwoVerifyDialog).display != 'none') {
                Unit.setPageLoading(false)
            }
        }
    })
}
/**
 * @description: showVerifyDialog   Display the verification code pop-up window.
 * @param {*}  No param
 * @return {*}   No return value
 */
function showVerifyDialog() {
    document.getElementById('chooseVerifyType').setAttribute('style', 'display: none;')
    var hideDoms = document.getElementsByClassName(loginTwoVerifySendCode.type == 1 ? 'phoneVerifyWarp' : 'emailVerifyWarp')
    var showDoms = document.getElementsByClassName(loginTwoVerifySendCode.type == 1 ? 'emailVerifyWarp' : 'phoneVerifyWarp')
    var i
    for (i = 0; i < hideDoms.length; i++) {
        hideDoms[i].setAttribute('style', 'display: none;')
    }
    for (i = 0; i < showDoms.length; i++) {
        showDoms[i].setAttribute('style', 'display: block;')
    }
    if (loginTwoVerifySendCode.type == 1) {
        document.getElementById('towVerifyEmail').innerHTML = loginTwoVerifySendCode.email
    }
    if (loginTwoVerifySendCode.type == 2) {
        document.getElementById('towVerifyPhone').innerHTML = '+' + loginTwoVerifySendCode.phoneCountry.toString() + loginTwoVerifySendCode.phone.toString()
    }
    for (i = 1; i < 7; i++) {
        document.getElementById('num' + i).value = ''
        document.getElementById('num' + i).className = 'normal'
    }
    document.getElementById('loginTwoVerifyDialog').setAttribute('style', 'display: flex;')
    var loginTwoVerifyErrorMsgDom = document.getElementById('loginTwoVerifyErrorMsg')
    loginTwoVerifyErrorMsgDom.innerHTML = ''
}
/**
 * @description: clearVerifyDialogs   Clear verify dialogs
 * @param {*}    No param
 * @return {*}   No return value
 */
function clearVerifyDialogs() {
    var chooseVerifyTypeDom = document.getElementById('chooseVerifyType'),
        loginTwoVerifyDialogDom = document.getElementById('loginTwoVerifyDialog'),
        countDownDom = document.getElementById('loginTwoVerifyTryAgain')
    Unit.showElement(chooseVerifyTypeDom, false)
    document.getElementById('textVerifyType').checked = false
    document.getElementById('emailVerifyType').checked = false
    Unit.showElement(loginTwoVerifyDialogDom, false)
    loginTwoVerifySendCode.twoFactorKey = ''
    loginTwoVerifySendCode.twoFactorCode = ''
    loginTwoVerifySendCode.type = 1
    clearInterval(dialogCountDownTimer)
    if (countDownDom) {
        countDownDom.innerHTML = 'Try again'
        countDownDom.className = 'tryAgain'
    }
}
/**
 * @description: chooseVerifyType   Select the verification type.
 * @param {*}  type    Verification code type.
 * @return {*}   No return value
 */
function chooseVerifyType(type) {
    loginTwoVerifySendCode.type = type
    document.getElementById('chooseVerifyTypeBtn').className = 'btn'
}
/**
 * @description: updateUserValidateInfo   Update user verification code information.
 * @param {*}  obj    ValidateInfo
 * @return {*}   No return value
 */
function updateUserValidateInfo(obj) {
    var updateObj = Unit.getObjSessionStorage('userValidateInfo') || {}
    updateObj = Object.assign(updateObj, obj)
    Unit.setSessionStorage('userValidateInfo', JSON.stringify(updateObj))
}
/**
 * @description: updateSuspendedInfo   Update suspension information
 * @param {*}  obj    suspendedInfo
 * @return {*}   No return value
 */
function updateSuspendedInfo(obj) {
    var updateObj = Unit.getObjSessionStorage('suspendedInfo') || {}
    updateObj = Object.assign(updateObj, obj)
    Unit.setSessionStorage('suspendedInfo', JSON.stringify(updateObj))
}
