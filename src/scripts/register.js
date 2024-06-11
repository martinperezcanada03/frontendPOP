document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmarpassword = document.getElementById('confirmarpassword').value;

    if (password !== confirmarpassword) {
      showAlert('danger', 'Las passwords no coinciden. Inténtalo de nuevo.');
      return;
    }

    try {
      const response = await fetch('https://backendpop-ku78.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastName, email, password }) 
      });

      if (response.ok) {
        const responseData = await response.json();
        const { token, userId } = responseData;

        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', name);
        localStorage.setItem('userLastName', lastName); 

        showAlert('success', 'Registro exitoso');
        window.location.href = '/';
      } else {
        const errorData = await response.text();
        if (response.status === 401) {
          showAlert('danger', 'Correo electrónico ya en uso. Inténtalo de nuevo.');
        } else {
          showAlert('danger', `Error: ${errorData}`);
        }
      }
    } catch (error) {
      showAlert('danger', 'Ocurrió un error al intentar registrarse. Inténtalo de nuevo más tarde.');
    }
  });

  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', `alert-${type}`, 'mt-3', 'position-fixed', 'top-0', 'start-50', 'translate-middle-x');
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
});
