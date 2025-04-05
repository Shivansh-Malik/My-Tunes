let btn=document.querySelector(".alt-option");
btn.addEventListener("click",function(event){
    event.preventDefault(); // Prevents page reload
    let change=document.getElementById("email");
    if (change.type === "email") {
        change.setAttribute("placeholder", "Enter your mobile number!");
        change.setAttribute("type", "tel"); // "number" is not ideal for phone numbers
        btn.innerHTML = "Use email instead";
    } else {
        change.setAttribute("placeholder", "name@domain.com");
        change.setAttribute("type", "email");
        btn.innerHTML = "Use phone number instead.";
    }
});