document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const imagen = document.getElementById('imagen').value;
        const userId = localStorage.getItem('userId');

        console.log('Enviando datos del producto:', { nombre, descripcion, precio, imagen, userId });

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('https://backendpop-ku78.onrender.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    imagen,
                    userId
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Producto creado exitosamente:', responseData);
                // showAlert('success', 'Producto creado exitosamente');
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.log('Error al crear el producto', errorData);
                // showAlert('danger', 'Error al crear el producto: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
            // showAlert('danger', 'Ocurrió un error al intentar crear el producto. Inténtalo de nuevo más tarde.');
        }
    });
});
