document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Intentando iniciar sesión con', { email, password });

    try {
      const response = await fetch('https://backendpop-ku78.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      console.log('Respuesta de login recibida:', response);

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        const userId = responseData.userId;

        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', email);
        localStorage.setItem('userId', userId);

        console.log('Inicio de sesión exitoso, token:', token);

        const userResponse = await fetch(`https://backendpop-ku78.onrender.com/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const { name, lastName } = userData;  // Asegúrate de que lastName esté presente en userData
          localStorage.setItem('userName', name); 
          localStorage.setItem('userLastName', lastName);  // Almacena el apellido

          showAlert('success', 'Inicio de sesión exitoso');
          window.location.href = '/';
        } else {
          console.log('Error al obtener los detalles del usuario', await userResponse.text());
          showAlert('danger', 'Error al obtener los detalles del usuario');
        }
      } else {
        const errorData = await response.json();
        console.log('Error al iniciar sesión', errorData);
        showAlert('danger', 'Error al iniciar sesión: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showAlert('danger', 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    } finally {
      setTimeout(() => {
        loadingSpinner.style.display = 'none';
      }, 2000);
    }
  });

  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', `alert-${type}`, 'mt-3', 'position-fixed', 'start-50', 'translate-middle-x');
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.zIndex = '1050'; 
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
});
