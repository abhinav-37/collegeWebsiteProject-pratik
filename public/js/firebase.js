let contact = document.querySelector("#contact-form");

contact.addEventListener("submit",(e) => {
    e.preventDefault();
    db.collection("contact_form").add({
        full_name:contact["cf-name"].value,
        email:contact["cf-email"].value,
        subject:contact["cf-subject"].value,
        content:contact["cf-message"].value
    });

    contact.reset();

})