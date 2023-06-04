const parallax_el = document.querySelectorAll('.parallax');

let xValue = 0,
    yValue = 0;

let rotateDegree = 0;

function update(cursorposition) {
    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;
        let speedz = el.dataset.speedz;

        let isInLeft = parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
        let zValue = (cursorposition - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.1;

        el.style.transform = `translateX(calc(-50% + ${-xValue * speedx}px)) rotateY(${rotateDegree}deg) translateY(calc(-50% + ${yValue * speedy}px)) perspective(2300px) translateZ(${zValue * speedz}px)`;
    });
}

update(0)
let link = document.querySelector(".link");
let pink = document.querySelector(".pink");

let hoverTL = gsap.timeline();
hoverTL.pause();

// from, to, fromTo Tweens
hoverTL.to(pink, { width: "calc(100% + 1.3em)", ease: "Elastic.easeOut(0.25)", duration: 0.4 })
hoverTL.to(pink, { width: "2em", left: "calc(100% - 1.45em)", ease: "Elastic.easeOut(0.4)", duration: 0.6 })

link.addEventListener("mouseenter", () => {
    hoverTL.play();
})

link.addEventListener("mouseleave", () => {
    hoverTL.reverse();
})
window.addEventListener("mousemove", (e) => {
    if (timeline.isActive()) return;

    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;

    rotateDegree = xValue / (window.innerWidth / 2) * 20;

    update(e.clientX);
});


/* GSAP ANIMATION FOR LOADING */

let timeline = gsap.timeline();

Array.from(parallax_el).filter(el => !el.classList.contains("text")).forEach(el => {
    timeline.from(el, {
        top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
        duration: 3.5,
        ease: "power3.out",
    },
        "1"
    );
});

timeline.from(".text h1", {
    y: window.innerHeight - document.querySelector(".text h1").getBoundingClientRect().top + 200,
    duration: 2,
}, "2.5").from(".text h2", {
    y: -150,
    opacity: 0,
    duration: 1.3,
}, "3").from(".hide", {
    opacity: 0,
    duration: 1.3,
}, "3").from(".wrapper", {
    opacity: 0,
    duration: 1.5,
}, "4");

