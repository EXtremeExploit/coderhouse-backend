const socket = io();

socket.emit('pullProducts');

socket.on('products', prods => {
    let div = document.getElementById('products');

    div.textContent = '';
    for (const prod of prods) {
        const title = document.createElement('p');
        const description = document.createElement('p');
        const price = document.createElement('p');
        const stock = document.createElement('p');
        const br = document.createElement('br');

        title.textContent = prod.title;
        description.textContent = prod.description;
        price.textContent = prod.price;
        stock.textContent = prod.stock;

        div.append(title);
        div.append(description);
        div.append(price);
        div.append(stock);
        div.append(br);
    }

    socket.emit('pullProducts');
});

document.getElementById('cargarButton').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    const body = JSON.stringify({ title, description, code, price, stock, category });
    console.log(body);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/products/', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        console.log(xhr.response);
    };
    xhr.send(body);
});