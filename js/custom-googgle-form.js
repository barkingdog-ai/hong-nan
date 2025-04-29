(function () {
  const formUrl =
    "https://docs.google.com/forms/u/1/d/e/1FAIpQLSeZ_vhDrPAEZ4wlrBEeSkm10x31xAtvjfDKFUo9q7XFur70WA/formResponse";

  const submitButton = document.getElementById("custom-google-form-submit");
  const nameInput = document.getElementById("Contact-3-Name");
  const emailInput = document.getElementById("Contact-3-Email");
  const notesInput = document.getElementById("Contact-3-Message");
  const successMessage = document.querySelector(
    ".combine-form_success-message"
  );
  const errorMessage = document.querySelector(".combine-form_error-message");

  const inputError = {};

  nameInput.addEventListener("blur", (event) => {
    const valueTrim = event.target.value.trim();
    if (valueTrim === "") {
      inputError.name = "請輸入姓名";
      event.target.style.border = "1px solid red";
      errorMessage.style.display = "block";
    } else {
      inputError.name = "";
      event.target.style.border = "1px solid green";
      errorMessage.style.display = "none";
    }
  });

  emailInput.addEventListener("blur", (event) => {
    const valueTrim = event.target.value.trim();
    if (valueTrim === "") {
      inputError.email = "請輸入Email";
      event.target.style.border = "1px solid red";
      errorMessage.style.display = "block";
    } else {
      inputError.email = "";
      event.target.style.border = "1px solid green";
      errorMessage.style.display = "none";
    }
  });

  submitButton.addEventListener("click", handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();
    const nameValue = nameInput.value;
    const emailValue = emailInput.value;
    const notesValue = notesInput.value;
    const formData = {
      "entry.1426741429": nameValue,
      "entry.926476951": emailValue,
      "entry.873658346": notesValue,
    };

    $.ajax({
      type: "POST",
      url: formUrl,
      data: formData,
      contentType: "application/json",
      dataType: "jsonp",
      complete: function () {
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
      },
    });
  }
})();
