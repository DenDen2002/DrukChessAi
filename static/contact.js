function resizable(elementt, factor) {
    var int = Number((factor) || 7.7);
    function resize() {
        elementt.style.width = ((elementt.value.length + 4) * int) + 'px';
    }
    var e = 'keyup,keypress,focus,change,blur'.split(',');
    for (var i in e) {
        elementt.addEventListener(e[i], resize, false);
        resize();
    }
}

resizable(document.getElementById('name'))
resizable(document.getElementById('email'))
resizable(document.getElementById('subject'))
resizable(document.getElementById('message'))

const myInputs = document.getElementsByClassName('Line-Input');

for (let i = 0; i < myInputs.length; i++) {
    myInputs[i].addEventListener('focus', function () {
        const comments = document.getElementsByClassName("Line-Comment");
        for (let j = 0; j < comments.length; j++) {
            comments[j].style.display = "none";
        }
    });

    myInputs[i].addEventListener('blur', function () {
        const comments = document.getElementsByClassName("Line-Comment");
        for (let j = 0; j < comments.length; j++) {
            comments[j].style.display = "inline";
        }
    });
}

document.querySelector('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("hi")
    const email = document.getElementById("email").value.trim();
    const name = document.getElementById("name").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    if (isValidEmail(email)) {
        Email.send({
            Host: "smtp.elasticemail.com",
            Username: "12210067.gcit@rub.edu.bt",
            Password: "D2AD176442A4C101D39AA047B9782F8DA278",
            To: "12210067.gcit@rub.edu.bt",
            From: email,
            Subject: "Name: " + name + "<br>" + "Subject: " + subject,
            Body: "Message: " + message
        }).then(
            message => alert(message)
        );
    }
})



const sendEmail = () => {

    emailjs.sendForm('service_ytcf4kr', 'template_jycn3xn', form.current, 'psgeH9Sn3HF-ug0Wv')
        .then((result) => {
            console.log(result.text);
            if (result.text === "OK") {
                setSendingEmailText("Email Sent!")
                console.log("EMAIL SENT");
            }
        }, (error) => {
            setSendingEmailText("Something went wrong :<")
        });
};

const isValidEmail = (email) => {
    // regular expression to match email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // check if email matches the regex
    return emailRegex.test(email);
}