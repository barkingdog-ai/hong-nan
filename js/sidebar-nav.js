/* 側邊書籤導航功能 */
(function () {
  let isNavInitialized = false;

  function initSidebarNav() {
    if (isNavInitialized) return;

    const navContainer = document.querySelector(".sidebar-nav");
    const navLinks = document.querySelectorAll(".sidebar-nav a");

    if (!navContainer || !navLinks.length) {
      console.log("側邊導航元素未找到，稍後重試...");
      return;
    }

    // 定義錨點對應的區域
    const sections = {
      from: { id: "from", offset: 100 },
      building: { id: "building", offset: 100 },
      fixing: { id: "fixing", offset: 100, bufferHeight: 900 },
      active: { id: "active", offset: 100, bufferHeight: 900 },
      "indoor-show": { id: "indoor-show", offset: 100 },
      "outdoor-show": { id: "outdoor-show", offset: 100 },
    };

    // 平滑滾動功能
    function smoothScrollTo(targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - sections[targetId].offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        console.log("滾動到:", targetId);
      } else {
        console.error("找不到目標元素:", targetId);
      }
    }

    // 更新活動狀態
    function updateActiveState() {
      const scrollPosition = window.pageYOffset + 100;
      let activeSection = "from"; // 預設為第一個區域

      // 按照頁面順序定義區域陣列，過濾掉有問題的 outdoor-show
      const sectionOrder = ["from", "building", "fixing", "active", "indoor-show"];
      
      // 獲取所有區域的位置資訊
      const sectionPositions = [];
      sectionOrder.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          sectionPositions.push({
            id: sectionId,
            top: element.offsetTop
          });
        }
      });

      // 特別處理 outdoor-show，因為它的位置有問題
      const outdoorElement = document.getElementById("outdoor-show");
      if (outdoorElement) {
        // 假設 outdoor-show 在 indoor-show 之後
        const indoorElement = document.getElementById("indoor-show");
        const outdoorTop = indoorElement ? indoorElement.offsetTop + 800 : 5000; // 假設在 indoor-show 後 800px
        sectionPositions.push({
          id: "outdoor-show",
          top: outdoorTop
        });
      }

      // 從後往前檢查，找到最後一個符合條件的區域
      for (let i = sectionPositions.length - 1; i >= 0; i--) {
        const current = sectionPositions[i];
        
        // 如果滾動位置已經超過當前區域的起始位置
        if (scrollPosition >= current.top - 150) {
          activeSection = current.id;
          break;
        }
      }

      console.log(`滾動位置: ${scrollPosition}, 活動區域: ${activeSection}`);

      // 更新導航連結的活動狀態
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const linkSectionId = href.substring(1);
          if (linkSectionId === activeSection) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        }
      });
    }

    // 添加點擊事件監聽器
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          smoothScrollTo(targetId);

          // 立即更新活動狀態
          navLinks.forEach((navLink) => navLink.classList.remove("active"));
          this.classList.add("active");
        }
      });
    });

    // 監聽滾動事件
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveState();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll);

    // 初始化時更新一次活動狀態
    updateActiveState();

    isNavInitialized = true;
    console.log("側邊導航初始化完成");
  }

  // DOM 載入完成後初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarNav);
  } else {
    initSidebarNav();
  }

  // 備用：延遲初始化（防止 Webflow 干擾）
  setTimeout(initSidebarNav, 100);
  setTimeout(initSidebarNav, 500);
})();
