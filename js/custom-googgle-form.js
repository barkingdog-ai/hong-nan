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

  // Modal 元素
  const modal = document.getElementById("custom-modal");
  const modalAgree = document.getElementById("modal-agree");
  const modalDisagree = document.getElementById("modal-disagree");
  const modalOverlay = modal
    ? modal.querySelector(".combine-modal__overlay")
    : null;

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

  // 攔截送出，先顯示 modal
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    // 若有錯誤不開啟 modal
    if (nameInput.value.trim() === "" || emailInput.value.trim() === "") {
      errorMessage.style.display = "block";
      return;
    }
    openModal();
  });

  // Modal 控制
  function openModal() {
    if (!modal) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      modal.querySelector(".combine-modal__content").focus?.();
    }, 0);
  }
  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  // Modal 按鈕事件
  if (modalAgree) {
    modalAgree.addEventListener("click", function () {
      closeModal();
      actuallySubmit();
    });
  }
  if (modalDisagree) {
    modalDisagree.addEventListener("click", function () {
      closeModal();
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function () {
      closeModal();
    });
  }
  // ESC 關閉
  document.addEventListener("keydown", function (e) {
    if (
      modal.style.display === "flex" &&
      (e.key === "Escape" || e.key === "Esc")
    ) {
      closeModal();
    }
  });

  // 真正送出表單
  function actuallySubmit() {
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
        // 清空欄位與重設狀態
        nameInput.value = "";
        emailInput.value = "";
        notesInput.value = "";
        nameInput.style.border = "";
        emailInput.style.border = "";
        inputError.name = "";
        inputError.email = "";
      },
    });
  }
})();
