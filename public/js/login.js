
// login.js

// Confirm password
var pwd = document.getElementById('pwd-box')
var confirmPwd = document.getElementById('confirm-pwd-box')
if (pwd && confirmPwd) {
	confirmPwd.addEventListener('change', () => {
		if (confirmPwd.value != pwd.value) {
			confirmPwd.setCustomValidity("Password don't match")
		} else {
			confirmPwd.setCustomValidity('')
		}
	})
}

// End of login.js

