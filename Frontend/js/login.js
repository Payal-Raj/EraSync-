
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const alertDiv = document.getElementById('loginAlert');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.getElementById('loginBtnText');
  const btnSpinner = document.getElementById('loginBtnSpinner');

  const token = localStorage.getItem('erasync_token');
  if (token) {

  }

  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const passwordIcon = document.getElementById('passwordIcon');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      passwordIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertDiv.classList.add('d-none');
    alertDiv.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let isValid = true;

    if (!email || !email.includes('@')) {
      document.getElementById('email').classList.add('is-invalid');
      document.getElementById('emailFeedback').textContent = 'Please enter a valid email address';
      isValid = false;
    } else {
      document.getElementById('email').classList.remove('is-invalid');
    }

    if (!password) {
      document.getElementById('password').classList.add('is-invalid');
      document.getElementById('passwordFeedback').textContent = 'Please enter your password';
      isValid = false;
    } else {
      document.getElementById('password').classList.remove('is-invalid');
    }

    if (!isValid) return;

    loginBtn.disabled = true;
    btnText.textContent = 'Logging in...';
    btnSpinner.classList.remove('d-none');

    try {
      const response = await fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('erasync_token', data.token);
        
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
          localStorage.setItem('remembered_email', email);
        } else {
          localStorage.removeItem('remembered_email');
        }

        showAlert('Login successful!', 'success');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        const errorMsg = data.error || 'Login failed. Please check your credentials.';
        showAlert(errorMsg, 'danger');
        loginBtn.disabled = false;
        btnText.textContent = 'Log in';
        btnSpinner.classList.add('d-none');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Unable to connect to the server. Please ensure the backend is running.', 'danger');
      loginBtn.disabled = false;
      btnText.textContent = 'Log in';
      btnSpinner.classList.add('d-none');
    }
  });

  function showAlert(message, type = 'danger') {
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('d-none');
  }

  document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !email.includes('@')) {
      this.classList.add('is-invalid');
      document.getElementById('emailFeedback').textContent = 'Please enter a valid email address';
    } else {
      this.classList.remove('is-invalid');
    }
  });

  document.getElementById('password').addEventListener('input', function() {
    if (this.value.length > 0) {
      this.classList.remove('is-invalid');
    }
  });

  const rememberedEmail = localStorage.getItem('remembered_email');
  if (rememberedEmail) {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.value = rememberedEmail;
      const rememberCheckbox = document.getElementById('rememberMe');
      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
    }
  }
});