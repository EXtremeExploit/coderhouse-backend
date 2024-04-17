function register() {
    console.log('Registro');

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/session/register', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        console.log(xhr.response);
        if(xhr.status == 200)
        window.location.href = '/login';
    };
    xhr.send(JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        age
    }));
}
