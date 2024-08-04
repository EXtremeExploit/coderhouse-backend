function addToCart() {
    const xhr = new XMLHttpRequest();
    const id = document.getElementById('id').textContent;
    xhr.open('DELETE', `/api/users/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status == 200)
            window.location.reload();
    };
    xhr.send();
}

const btn = document.getElementById('btn-borrar');
btn.addEventListener('click', addToCart);