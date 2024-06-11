document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('currentUser'); 

    if (!token || !userId || !email) {
        console.error('No se encontró el token, el ID de usuario o el email en el almacenamiento local.');
        return;
    }

    try {
        const response = await fetch(`https://backendpop-ku78.onrender.com/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('name').value = userData.name;
            document.getElementById('surname').value = userData.lastName;
            document.getElementById('email').value = userData.email;
        } else {
            console.error('Error al obtener los detalles del usuario', await response.text());
        }
    } catch (error) {
        console.error('Error al intentar obtener los datos del usuario:', error);
    }

    const deleteAccountButton = document.getElementById('deleteAccountButton');


    deleteAccountButton.addEventListener('click', async () => {
        try {
            const confirmDelete = confirm("¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");

            if (confirmDelete) {
                const deleteResponse = await fetch(`https://backendpop-ku78.onrender.com/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (deleteResponse.ok) {
                    window.location.href = "/"; 

                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userLastName');
                } else {
                    const errorMessage = await deleteResponse.text();
                    console.error('Error al eliminar la cuenta:', errorMessage);
                    alert("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
                }
            }
        } catch (error) {
            console.error('Error al intentar eliminar la cuenta:', error);
            alert("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
        }
    });

    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

    newPasswordInput.disabled = true;
    confirmNewPasswordInput.disabled = true;

    currentPasswordInput.addEventListener('input', async () => {
        const currentPassword = currentPasswordInput.value;

        if (currentPassword) {
            try {
                const verifyResponse = await fetch(`https://backendpop-ku78.onrender.com/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password: currentPassword })
                });

                if (verifyResponse.ok) {
                    newPasswordInput.disabled = false;
                    confirmNewPasswordInput.disabled = false;
                } else {
                    newPasswordInput.disabled = true;
                    confirmNewPasswordInput.disabled = true;
                }
            } catch (error) {
                console.error('Error al verificar la contraseña actual:', error);
                newPasswordInput.disabled = true;
                confirmNewPasswordInput.disabled = true;
            }
        } else {
            newPasswordInput.disabled = true;
            confirmNewPasswordInput.disabled = true;
        }
    });

    const configForm = document.getElementById('configForm');

    configForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;

        const updateData = {};
        if (name) updateData.name = name;
        if (surname) updateData.lastName = surname;
        if (email) updateData.email = email;

        let changesMade = false;

        try {
            if (Object.keys(updateData).length > 0) {
                const updateResponse = await fetch(`https://backendpop-ku78.onrender.com/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });

                if (!updateResponse.ok) {
                    const errorData = await updateResponse.text();
                    showAlert('danger', `Error al actualizar la configuración: ${errorData}`);
                    return;
                }
                changesMade = true;
            }

            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
                const passwordResponse = await fetch(`https://backendpop-ku78.onrender.com/users/${userId}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password: newPassword })
                });

                if (!passwordResponse.ok) {
                    const errorData = await passwordResponse.text();
                    showAlert('danger', `Error al actualizar la contraseña: ${errorData}`);
                    return;
                }
                changesMade = true;
            }

            if (changesMade) {
                showAlert('success', 'Configuración actualizada exitosamente');
                setTimeout(() => {
                    location.reload();
                }, 2000); 
            } else {
                showAlert('info', 'No se realizaron cambios');
            }
        } catch (error) {
            console.error('Error al intentar actualizar los datos del usuario:', error);
            showAlert('danger', 'Ocurrió un error al intentar actualizar la configuración. Inténtalo de nuevo más tarde.');
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

    function togglePasswordVisibility(inputId, iconId) {
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = document.getElementById(iconId);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }

    document.getElementById('toggleCurrentPassword').addEventListener('click', () => {
        togglePasswordVisibility('currentPassword', 'toggleCurrentPasswordIcon');
    });

    document.getElementById('toggleNewPassword').addEventListener('click', () => {
        togglePasswordVisibility('newPassword', 'toggleNewPasswordIcon');
    });

    document.getElementById('toggleConfirmNewPassword').addEventListener('click', () => {
        togglePasswordVisibility('confirmNewPassword', 'toggleConfirmNewPasswordIcon');
    });
});
