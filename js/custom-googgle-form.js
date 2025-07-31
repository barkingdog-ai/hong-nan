(function () {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdeBKB69Kd_DSWIF6M2a15x0gVT71pG7pThcR5A6cdtwml2Ig/formResponse";

  const submitButton = document.getElementById("custom-google-form-submit");
  const groupNameInput = document.getElementById("group-name");
  const groupSizeInput = document.getElementById("group-size");
  const contactPhoneInput = document.getElementById("contact-phone");
  const infoSourceInput = document.getElementById("info-source");
  const visitDateInput = document.getElementById("visit-date");
  const visitTimeInput = document.getElementById("visit-time");
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

  // 初始化 Flatpickr 日期選擇器
  const datePicker = flatpickr(visitDateInput, {
    locale: "zh_tw",
    dateFormat: "Y-m-d",
    minDate: "today",
    placeholder: "請選擇日期",
    allowInput: false
  });

  // 驗證函數
  function validateField(input, fieldName, isRequired = true) {
    const valueTrim = input.value.trim();
    if (isRequired && valueTrim === "") {
      inputError[fieldName] = `請輸入${fieldName}`;
      input.classList.remove('success');
      input.classList.add('error');
      errorMessage.style.display = "block";
      return false;
    } else {
      inputError[fieldName] = "";
      input.classList.remove('error');
      input.classList.add('success');
      return true;
    }
  }

  // 驗證所有必填欄位
  function validateAllFields() {
    let allValid = true;
    
    // 必填欄位驗證
    allValid &= validateField(groupNameInput, "團體/個人名稱");
    allValid &= validateField(groupSizeInput, "人數");
    allValid &= validateField(contactPhoneInput, "聯絡電話");
    allValid &= validateField(visitDateInput, "預約日期");
    allValid &= validateField(visitTimeInput, "導覽時間");

    // 檢查是否有任何錯誤
    const hasErrors = Object.values(inputError).some(error => error !== "");
    if (!hasErrors && allValid) {
      errorMessage.style.display = "none";
    }
    
    return allValid;
  }

  // 各欄位 blur 事件
  groupNameInput.addEventListener("blur", () => validateField(groupNameInput, "團體/個人名稱"));
  groupSizeInput.addEventListener("blur", () => validateField(groupSizeInput, "人數"));
  contactPhoneInput.addEventListener("blur", () => validateField(contactPhoneInput, "聯絡電話"));
  visitDateInput.addEventListener("change", () => validateField(visitDateInput, "預約日期"));
  visitTimeInput.addEventListener("change", () => validateField(visitTimeInput, "導覽時間"));

  // 攔截送出，先顯示 modal
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    // 驗證所有必填欄位
    if (!validateAllFields()) {
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
    // 將日期拆分為年月日
    const dateValue = visitDateInput.value;
    const dateParts = dateValue.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    
    const formData = {
      "entry.250977054": groupNameInput.value.trim(), // 六燃丁種宿舍導覽預約
      "entry.57431109": groupSizeInput.value.trim(), // 人數
      "entry.615449077": contactPhoneInput.value.trim(), // 聯絡電話
      "entry.977853239": infoSourceInput.value || "", // 您從何處得知我們的相關資訊 (選填)
      "entry.282796732_year": year,
      "entry.282796732_month": month,
      "entry.282796732_day": day,
      "entry.1692193185": visitTimeInput.value, // 預約時間 (已確保是全形冒號)
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
        // 清空所有欄位與重設狀態
        groupNameInput.value = "";
        groupSizeInput.value = "";
        contactPhoneInput.value = "";
        infoSourceInput.value = "";
        visitDateInput.value = "";
        visitTimeInput.value = "";
        
        // 重設樣式 class
        [groupNameInput, groupSizeInput, contactPhoneInput, visitDateInput, 
         visitTimeInput].forEach(input => {
          input.classList.remove('error', 'success');
        });
        
        // 清空錯誤狀態
        Object.keys(inputError).forEach(key => {
          inputError[key] = "";
        });
      },
    });
  }
})();
