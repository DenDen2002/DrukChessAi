const skill1 = document.getElementById('skill1');
const skill2 = document.getElementById('skill2');
const skill3 = document.getElementById('skill3');
const command1 = document.getElementById('Command1')
const command2 = document.getElementById('Command2')
const command3 = document.getElementById('Command3')
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function executeOnInView(element, callback) {
    const rect = element.getBoundingClientRect();

    // Check if the element is in view
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        callback;
    }

    // Set up a listener for scrolling and resizing the window
    window.addEventListener('scroll', () => {
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            callback;
        }
    });
    window.addEventListener('resize', () => {
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            callback;
        }
    });
}

executeOnInView(command1, animateText(command1))
skill1.addEventListener('click', function () {
    skill1.style.display = 'none';
    skill2.style.display = 'flex';
    animateText(command2)
});

skill2.addEventListener('click', function () {
    skill2.style.display = 'none';
    skill3.style.display = 'flex';
    animateText(command3)
});
skill3.addEventListener('click', function () {
    skill3.style.display = 'none';
    skill1.style.display = 'flex';
    animateText(command1)
});


function animateText(element) {
    let interval = null;
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        element.innerText = element.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return element.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");

        if (iteration >= element.dataset.value.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 100);
}