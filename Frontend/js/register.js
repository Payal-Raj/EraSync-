
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const alertDiv = document.getElementById('registerAlert');
  const registerBtn = document.getElementById('registerBtn');
  const btnText = document.getElementById('registerBtnText');
  const btnSpinner = document.getElementById('registerBtnSpinner');

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

  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.addEventListener('input', () => {
      const value = usernameInput.value;
      const regex = /^[a-zA-Z0-9_]*$/;
      if (value && !regex.test(value)) {
        usernameInput.setCustomValidity('Only letters, numbers, and underscores allowed');
        usernameInput.classList.add('is-invalid');
        document.getElementById('usernameFeedback').textContent = 'Only letters, numbers, and underscores allowed';
      } else {
        usernameInput.setCustomValidity('');
        usernameInput.classList.remove('is-invalid');
      }
    });
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    alertDiv.classList.add('d-none');
    alertDiv.textContent = '';
    
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
      termsCheckbox.classList.add('is-invalid');
      document.getElementById('termsFeedback').textContent = 'You must agree to the terms';
      return;
    } else {
      termsCheckbox.classList.remove('is-invalid');
    }

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const generation = document.getElementById('generation').value;

    let isValid = true;

    if (!username || username.length < 3) {
      document.getElementById('username').classList.add('is-invalid');
      document.getElementById('usernameFeedback').textContent = 'Username must be at least 3 characters';
      isValid = false;
    } else {
      document.getElementById('username').classList.remove('is-invalid');
    }

    if (!email || !email.includes('@')) {
      document.getElementById('email').classList.add('is-invalid');
      document.getElementById('emailFeedback').textContent = 'Please enter a valid email address';
      isValid = false;
    } else {
      document.getElementById('email').classList.remove('is-invalid');
    }

    if (!password || password.length < 6) {
      document.getElementById('password').classList.add('is-invalid');
      document.getElementById('passwordFeedback').textContent = 'Password must be at least 6 characters';
      isValid = false;
    } else {
      document.getElementById('password').classList.remove('is-invalid');
    }

    if (!generation) {
      document.getElementById('generation').classList.add('is-invalid');
      document.getElementById('generationFeedback').textContent = 'Please select your generation';
      isValid = false;
    } else {
      document.getElementById('generation').classList.remove('is-invalid');
    }

    if (!isValid) return;

    registerBtn.disabled = true;
    btnText.textContent = 'Creating account...';
    btnSpinner.classList.remove('d-none');

    try {
      const response = await fetch('http://localhost:3030/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          generation
        })
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Account created successfully!!', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        const errorMsg = data.error || 'Registration failed. Please try again.';
        showAlert(errorMsg, 'danger');
        // Re-enable button
        registerBtn.disabled = false;
        btnText.textContent = 'Create account';
        btnSpinner.classList.add('d-none');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('Unable to connect to the server. Please ensure the backend is running.', 'danger');
      registerBtn.disabled = false;
      btnText.textContent = 'Create account';
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
    if (this.value.length > 0 && this.value.length < 6) {
      this.classList.add('is-invalid');
      document.getElementById('passwordFeedback').textContent = 'Password must be at least 6 characters';
    } else {
      this.classList.remove('is-invalid');
    }
  });

  document.getElementById('generation').addEventListener('change', function() {
    if (this.value) {
      this.classList.remove('is-invalid');
    }
  });
});