function login() {
    console.log('Login');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/session/login', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status == 200)
            window.location.href = xhr.responseURL;
        else {
            document.getElementById('log').textContent = xhr.response;
        }
    };
    xhr.send(JSON.stringify({
        email,
        password,
    }));
}
