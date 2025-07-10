/* 側邊書籤導航功能 - 優化版本，僅使用 scroll 事件 */
(function () {
  // 狀態管理
  let isNavInitialized = false;
  let currentActiveSection = null;
  let sections = null;
  let navLinks = null;
  let isUserScrolling = true;
  
  // 滾動狀態
  let lastScrollY = window.scrollY;
  let scrollDirection = "down";
  
  // 事件處理器引用（用於清理）
  let throttledScrollHandler = null;
  let scrollEndTimeout = null;
  
  // throttle 函數 - 優化 scroll 事件性能
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
  
  // 更新滾動方向
  function updateScrollDirection() {
    if (window.scrollY > lastScrollY) {
      scrollDirection = "down";
    } else if (window.scrollY < lastScrollY) {
      scrollDirection = "up";
    }
    lastScrollY = window.scrollY;
  }
  
  // 檢查側邊欄可見性
  function checkSidebarVisibility() {
    const navContainer = document.querySelector(".sidebar-nav");
    if (!navContainer) return;

    const section6 = document.querySelector(".section-6");
    if (!section6) return;

    const section6Rect = section6.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (section6Rect.top <= viewportHeight) {
      navContainer.style.display = "block";
      navContainer.style.opacity = "1";
    } else {
      navContainer.style.display = "none";
      navContainer.style.opacity = "0";
    }
  }
  
  // 更新活動狀態
  function updateActiveState(activeSectionId, updateUrl = true) {
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

    // 只在需要時更新 URL hash
    if (updateUrl && isUserScrolling) {
      history.replaceState(null, null, `#${activeSectionId}`);
    }
  }
  
  // 根據滾動位置更新活動狀態
  function updateActiveByScroll() {
    const sectionOrder = [
      "from",
      "building", 
      "fixing",
      "active",
      "indoor-show",
      "outdoor-show",
    ];
    
    const sectionsArr = sectionOrder.map((id) => document.getElementById(id));
    let activeIdx = -1;
    
    // 找到當前在視窗中的 section
    for (let i = 0; i < sectionsArr.length; i++) {
      const element = sectionsArr[i];
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      // 以視窗 15% 高度作為基準線，提高敏感度
      if (
        rect.top <= window.innerHeight * 0.15 &&
        rect.bottom > window.innerHeight * 0.15
      ) {
        activeIdx = i;
        break;
      }
    }
    
    // 特殊情況處理
    if (activeIdx === -1) {
      if (window.scrollY < 10) {
        activeIdx = 0; // 頁面頂部
      } else if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
      ) {
        activeIdx = sectionsArr.length - 1; // 頁面底部
      }
    }
    
    // 特殊處理：檢查是否在 Q區範圍內
    if (activeIdx === -1 || activeIdx === 5) { // outdoor-show 索引是 5
      const qArea = document.getElementById('q_area');
      const indoorShow = document.getElementById('indoor-show');
      const outdoorShow = document.getElementById('outdoor-show');
      
      if (qArea && indoorShow && outdoorShow) {
        const qRect = qArea.getBoundingClientRect();
        const indoorRect = indoorShow.getBoundingClientRect();
        const outdoorRect = outdoorShow.getBoundingClientRect();
        
        // 如果 Q區在視窗中，且位於室內展示之後、室外展示之前
        if (qRect.top <= window.innerHeight * 0.15 && 
            qRect.bottom > window.innerHeight * 0.15 && 
            indoorRect.bottom < window.innerHeight * 0.15 &&
            outdoorRect.top > window.innerHeight * 0.15) {
          activeIdx = 4; // 設為 indoor-show 索引
        }
      }
    }
    
    if (activeIdx !== -1) {
      updateActiveState(sectionOrder[activeIdx]);
    }
  }
  
  // 統一的 scroll 事件處理器
  function handleScroll() {
    updateScrollDirection();
    checkSidebarVisibility();
    if (isUserScrolling) {
      updateActiveByScroll();
    }
    
    // 滾動結束後再次偵測，確保準確性
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => {
      if (isUserScrolling) {
        updateActiveByScroll();
      }
    }, 100);
  }
  
  // 平滑滾動
  function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error("找不到目標元素:", targetId);
      return;
    }
    
    isUserScrolling = false;
    
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - sections[targetId].offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    
    // 滾動完成後恢復狀態
    setTimeout(() => {
      isUserScrolling = true;
      history.replaceState(null, null, `#${targetId}`);
    }, 1000);
    
    console.log("滾動到:", targetId);
  }
  
  // hash 變化處理
  function handleHashChange() {
    const newHash = window.location.hash.substring(1);
    if (newHash && sections[newHash]) {
      updateActiveState(newHash);
    }
  }
  
  // 初始化
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
    
    // 添加點擊事件監聽器
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          updateActiveState(targetId);
          smoothScrollTo(targetId);
          console.log("點擊導航連結，目標:", targetId);
        }
      });
    });
    
    // 創建 throttled scroll 事件處理器
    throttledScrollHandler = throttle(handleScroll, 8); // 120fps 提高響應速度
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    
    // 添加 hash 變化監聽器
    window.addEventListener("hashchange", handleHashChange);
    
    // 初始化狀態
    checkSidebarVisibility();
    
    // 處理初始 hash
    const hash = window.location.hash.substring(1);
    if (hash && sections[hash]) {
      setTimeout(() => {
        updateActiveState(hash);
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "instant" });
        }
      }, 100);
    } else {
      // 初始化時檢查當前活動區域但不更新 URL
      setTimeout(() => {
        const sectionOrder = [
          "from",
          "building", 
          "fixing",
          "active",
          "indoor-show",
          "outdoor-show",
        ];
        
        const sectionsArr = sectionOrder.map((id) => document.getElementById(id));
        let activeIdx = -1;
        
        for (let i = 0; i < sectionsArr.length; i++) {
          const element = sectionsArr[i];
          if (!element) continue;
          
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight * 0.15 &&
            rect.bottom > window.innerHeight * 0.15
          ) {
            activeIdx = i;
            break;
          }
        }
        
        if (activeIdx !== -1) {
          updateActiveState(sectionOrder[activeIdx], false); // 不更新 URL
        }
      }, 100);
    }
    
    isNavInitialized = true;
    console.log("側邊導航初始化完成");
  }
  
  // 清理函數
  function cleanup() {
    if (throttledScrollHandler) {
      window.removeEventListener("scroll", throttledScrollHandler);
      throttledScrollHandler = null;
    }
    if (scrollEndTimeout) {
      clearTimeout(scrollEndTimeout);
      scrollEndTimeout = null;
    }
    window.removeEventListener("hashchange", handleHashChange);
    isNavInitialized = false;
    console.log("側邊導航已清理");
  }
  
  // 確保初始化
  function ensureInitialization() {
    if (!isNavInitialized && document.querySelector('.sidebar-nav')) {
      initSidebarNav();
    }
  }
  
  // DOM 載入完成後初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureInitialization);
  } else {
    ensureInitialization();
  }
  
  // 備用初始化（防止 Webflow 干擾）
  setTimeout(ensureInitialization, 100);
  
  // 頁面卸載時清理
  window.addEventListener("beforeunload", cleanup);
})();