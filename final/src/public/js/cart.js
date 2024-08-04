function buy() {
    const xhr = new XMLHttpRequest();
    const cid = document.getElementById('cid').value;
    xhr.open('POST', `/api/carts/${cid}/purchase`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status == 200) {
            alert('Compra exitosa');
            window.location.reload();
        } else {
            alert('Ocurrio un error al realizar la compra');
        }
    };
    xhr.send();
}

const btn = document.getElementById('comprar');
btn.addEventListener('click', buy);