function buy() {
    const xhr = new XMLHttpRequest();
    const pid = document.getElementById('pid').value;
    const cid = document.getElementById('cid').value;
    xhr.open('POST', `/api/carts/${cid}/product/${pid}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status == 200) {
            alert('Producto agregado');
            window.location.reload();
        }
    };
    xhr.send(JSON.stringify({
        quantity: 1
    }));
}

const btn = document.getElementById('add-cart');
btn.addEventListener('click', buy);