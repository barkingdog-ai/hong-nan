/* 側邊書籤導航功能 - 使用 Intersection Observer API */
(function () {
  let isNavInitialized = false;
  let observer = null;
  let currentActiveSection = null;
  let sections = null;
  let navLinks = null;
  let isUserScrolling = true; // 預設為使用者滾動狀態

  // 檢查是否應該顯示側邊欄
  function checkSidebarVisibility() {
    const navContainer = document.querySelector(".sidebar-nav");
    if (!navContainer) return;

    // 取得 section-6 的位置
    const section6 = document.querySelector(".section-6");
    if (!section6) return;

    const section6Rect = section6.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // 當 section-6 進入視窗範圍時顯示側邊欄，否則隱藏
    if (section6Rect.top <= viewportHeight) {
      navContainer.style.display = "block";
      navContainer.style.opacity = "1";
    } else {
      navContainer.style.display = "none";
      navContainer.style.opacity = "0";
    }
  }

  // 更新活動狀態
  function updateActiveState(activeSectionId) {
    if (currentActiveSection === activeSectionId) return;
    
    currentActiveSection = activeSectionId;
    console.log("活動區域:", activeSectionId);

    // 更新導航連結的活動狀態
    if (navLinks) {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const linkSectionId = href.substring(1);
          if (linkSectionId === activeSectionId) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        }
      });
    }

    // 只在使用者滾動時更新 URL hash
    if (isUserScrolling) {
      history.replaceState(null, null, `#${activeSectionId}`);
    }
  }

  function initSidebarNav() {
    if (isNavInitialized) return;

    const navContainer = document.querySelector(".sidebar-nav");
    navLinks = document.querySelectorAll(".sidebar-nav a");

    if (!navContainer || !navLinks.length) {
      console.log("側邊導航元素未找到，稍後重試...");
      return;
    }

    // 定義錨點對應的區域
    sections = {
      from: { id: "from", offset: 100 },
      building: { id: "building", offset: 100 },
      fixing: { id: "fixing", offset: 100 },
      active: { id: "active", offset: 100 },
      "indoor-show": { id: "indoor-show", offset: 100 },
      "outdoor-show": { id: "outdoor-show", offset: 100 },
    };

    // 按照頁面順序定義區域陣列
    const sectionOrder = ["from", "building", "fixing", "active", "indoor-show", "outdoor-show"];

    // 平滑滾動功能
    function smoothScrollTo(targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        isUserScrolling = false; // 設定為程式滾動
        
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - sections[targetId].offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // 滾動完成後恢復使用者滾動狀態
        setTimeout(() => {
          isUserScrolling = true;
          history.replaceState(null, null, `#${targetId}`);
        }, 1000);

        console.log("滾動到:", targetId);
      } else {
        console.error("找不到目標元素:", targetId);
      }
    }

    // 設定 Intersection Observer
    function setupIntersectionObserver() {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px', // 當區域在螢幕中間 20%-80% 位置時觸發
        threshold: 0
      };

      observer = new IntersectionObserver((entries) => {
        // 只在使用者滾動時才處理
        if (!isUserScrolling) return;

        // 檢查側邊欄是否應該顯示
        checkSidebarVisibility();

        // 找出目前可見的區域
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id);

        if (visibleSections.length > 0) {
          // 根據 sectionOrder 找到最前面的可見區域
          for (const sectionId of sectionOrder) {
            if (visibleSections.includes(sectionId)) {
              updateActiveState(sectionId);
              break;
            }
          }
        }
      }, observerOptions);

      // 開始觀察所有區域
      sectionOrder.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
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
          
          // 立即更新活動狀態
          updateActiveState(targetId);
          
          // 執行平滑滾動
          smoothScrollTo(targetId);
          
          console.log("點擊導航連結，目標:", targetId);
        }
      });
    });

    // 初始化 Intersection Observer
    setupIntersectionObserver();

    // 添加滾動事件監聽器以檢查側邊欄可見性
    window.addEventListener('scroll', checkSidebarVisibility);

    // 檢查初始側邊欄可見性
    checkSidebarVisibility();

    // 檢查 URL hash 並設定初始狀態
    const hash = window.location.hash.substring(1);
    if (hash && sections[hash]) {
      // 如果 URL 有 hash，設定為活動狀態並滾動到該位置
      setTimeout(() => {
        updateActiveState(hash);
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'instant' });
        }
      }, 100);
    }
    // 不再設定預設的 active 狀態，讓 Observer 自然偵測

    // 監聽 hash 變化
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.substring(1);
      if (newHash && sections[newHash]) {
        updateActiveState(newHash);
      }
    });

    isNavInitialized = true;
    console.log("側邊導航初始化完成");
  }

  // 清理函數
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    window.removeEventListener('scroll', checkSidebarVisibility);
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

  // 頁面卸載時清理
  window.addEventListener("beforeunload", cleanup);
})();