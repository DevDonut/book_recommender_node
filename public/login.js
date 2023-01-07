function handleLoginSubmit(username, password) {
    console.log("This is called")
    const salt = crypto.randomBytes(16).toString('hex');
    const encrypted_password = crypto.pbkdf2Sync(password, salt,
        1000, 64, `sha512`).toString(`hex`)
    request.post({
            headers: {'content-type': 'application/json'},
            url: "localhost:8080/login",
            json: {
                user_name: username,
                user_password: encrypted_password
            }},
            function (error, response, body) {
                console.log(body);
        });
}