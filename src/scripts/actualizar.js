document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    async function getProductDetails(productId) {
        try {
            const response = await fetch(`https://backendpop-ku78.onrender.com/products/${productId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }
            const productDetails = await response.json();
            return productDetails;
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    async function loadProductDetailsToForm(productId) {
        const productDetails = await getProductDetails(productId);
        if (productDetails) {
            document.getElementById("nombre").value = productDetails.nombre;
            document.getElementById("descripcion").value = productDetails.descripcion;
            document.getElementById("precio").value = productDetails.precio;
            document.getElementById("imagen").value = productDetails.imagen;
        }
    }

    async function updateProduct(formData) {
        try {
            const response = await fetch(`https://backendpop-ku78.onrender.com/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to update product");
            }
            console.log("Product updated successfully");
            window.location.href = "/sidebar/productos";
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    function showAlert(type, message, confirmCallback, cancelCallback) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`, 'mt-3', 'position-fixed', 'start-50', 'translate-middle-x');
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.zIndex = '1050'; 
        alertDiv.innerHTML = `
            <p>${message}</p>
            <button id="confirmButton" class="btn btn-danger">Sí</button>
            <button id="cancelButton" class="btn btn-secondary">No</button>
        `;
        document.body.prepend(alertDiv);

        document.getElementById("confirmButton")?.addEventListener("click", () => {
            confirmCallback();
            alertDiv.remove();
        });

        document.getElementById("cancelButton")?.addEventListener("click", () => {
            cancelCallback();
            alertDiv.remove();
        });
    }

    function showSuccessAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', 'alert-success', 'mt-3', 'position-fixed', 'start-50', 'translate-middle-x');
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.zIndex = '1050'; 
        alertDiv.textContent = message;
        document.body.prepend(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 2000);
    }

    async function deleteProduct() {
        showAlert('warning', '¿Estás seguro que quieres eliminar este producto?', async () => {
            try {
                const response = await fetch(`https://backendpop-ku78.onrender.com/products/${productId}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    throw new Error("Failed to delete product");
                }
                showSuccessAlert('Producto eliminado exitosamente');
                setTimeout(() => {
                    window.location.href = "/sidebar/productos";
                }, 2000);
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }, () => {
            console.log('Eliminación del producto cancelada');
        });
    }

    await loadProductDetailsToForm(productId);

    document.getElementById("productForm").addEventListener("submit", async (event) => {
        event.preventDefault(); 
        const formData = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            precio: document.getElementById("precio").value,
            imagen: document.getElementById("imagen").value
        };
        await updateProduct(formData); 
    });

    document.getElementById("deleteButton").addEventListener("click", (event) => {
        event.preventDefault();
        deleteProduct();
    });
});
