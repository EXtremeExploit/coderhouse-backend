function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/session/logout', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        if (xhr.status == 200)
            window.location.href = "/login";
    };
    xhr.send();
};
