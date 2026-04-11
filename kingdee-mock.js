(() => {
  "use strict";

  const STORAGE_KEY = "nebula-workbench:v1";
  const PAGE_SIZE = 8;
  const MAX_FAV = 8;

  const ICONS = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1V9.5z"/></svg>',
    cart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 3h2l2 12h12l2-7H6"/></svg>',
    box: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.7L12 12l8.7-4.3M12 22V12"/></svg>',
    coin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c0-1.5-1-2.5-2.5-2.5S9.5 8 9.5 9.5c0 2 5 1.5 5 3.5s-2 3.5-4 3.5-4-1.5-4-3.5M12 6v2M12 16v2"/></svg>',
    factory: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V10l4 3V10l4 3V7l4 2v12M9 21v-4h6v4"/></svg>',
    spark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3M12 18v3M4.2 7.8l2.1 2.1M17.7 14.1l2.1 2.1M3 12h3M18 12h3M4.2 16.2l2.1-2.1M17.7 9.9l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5z"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
    bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    help: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  };

  const ROUTES = [
    { id: "overview", label: "工作台", icon: "home", group: "核心", desc: "跨模块指标、预警与快捷入口的聚合视图。" },
    { id: "sales", label: "销售", icon: "spark", group: "核心", desc: "订单、发货与回款链路的前端模拟。" },
    { id: "purchase", label: "采购", icon: "cart", group: "核心", desc: "请购、订单与到货协同的演示数据。" },
    { id: "inventory", label: "库存", icon: "box", group: "核心", desc: "多仓库存、批次与可用量的静态沙盘。" },
    { id: "finance", label: "财务", icon: "coin", group: "扩展", desc: "应收应付与对账状态的占位看板。" },
    { id: "manufacturing", label: "生产", icon: "factory", group: "扩展", desc: "工单进度与报工回传的模拟时间线。" },
    { id: "settings", label: "偏好", icon: "settings", group: "系统", desc: "主题与演示数据偏好（仅存于本机）。" },
  ];

  const MOCK_NOTIFICATIONS = [
    { id: "n1", title: "待办：3 张采购入库单待审核", body: "来源：采购管理 · 模拟队列", time: "09:12" },
    { id: "n2", title: "预警：2 个 SKU 低于安全库存", body: "仓库：华东 RDC", time: "昨天" },
    { id: "n3", title: "同步：MES 报工回传延迟 5 分钟", body: "产线：SMT-02（演示）", time: "周一" },
    { id: "n4", title: "提醒：月度对账窗口即将关闭", body: "财务共享 · 占位通知", time: "上周五" },
  ];

  const ORGS = [
    { id: "hq", name: "星云集团（总部）" },
    { id: "east", name: "华东事业部" },
    { id: "south", name: "华南工厂" },
  ];

  const ALERT_BANNER_ID = "demo-compliance";

  const APPROVAL_LABELS = ["保存提交", "部门审核", "财务审核", "过账"];

  const hashSeed = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  };

  const rnd = (seed) => {
    let x = seed % 2147483647;
    if (x <= 0) x += 2147483646;
    return () => (x = (x * 16807) % 2147483647) / 2147483647;
  };

  const fmtMoney = (n) =>
    new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(n);

  const fmtNum = (n) => new Intl.NumberFormat("zh-CN").format(Math.round(n));

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw)
        return {
          theme: "dark",
          route: "overview",
          log: [],
          favorites: [],
          notifReadIds: [],
          orgId: "hq",
          dismissedBanners: [],
          sortByRoute: {},
          tableDensity: "comfortable",
          recentRoutes: [],
          hiddenColsByRoute: {},
        };
      const j = JSON.parse(raw);
      const fav = Array.isArray(j.favorites) ? j.favorites.filter((id) => ROUTES.some((r) => r.id === id)) : [];
      const notifReadIds = Array.isArray(j.notifReadIds) ? j.notifReadIds.filter((x) => typeof x === "string") : [];
      const orgId = ORGS.some((o) => o.id === j.orgId) ? j.orgId : "hq";
      const dismissedBanners = Array.isArray(j.dismissedBanners)
        ? j.dismissedBanners.filter((x) => typeof x === "string")
        : [];
      const sortByRoute = {};
      if (j.sortByRoute && typeof j.sortByRoute === "object") {
        for (const rid of Object.keys(j.sortByRoute)) {
          const p = j.sortByRoute[rid];
          if (p && ["c1", "c2", "c3", "c4"].includes(p.key) && (p.dir === "asc" || p.dir === "desc")) {
            sortByRoute[rid] = { key: p.key, dir: p.dir };
          }
        }
      }
      const tableDensity = j.tableDensity === "compact" ? "compact" : "comfortable";
      const recentRoutes = Array.isArray(j.recentRoutes)
        ? j.recentRoutes.filter((id) => ROUTES.some((r) => r.id === id)).slice(0, 5)
        : [];
      const hiddenColsByRoute = {};
      if (j.hiddenColsByRoute && typeof j.hiddenColsByRoute === "object") {
        for (const rid of Object.keys(j.hiddenColsByRoute)) {
          const arr = j.hiddenColsByRoute[rid];
          if (!Array.isArray(arr)) continue;
          const hid = arr.filter((x) => ["c1", "c2", "c3", "c4"].includes(x));
          if (hid.length) hiddenColsByRoute[rid] = hid;
        }
      }
      return {
        theme: j.theme === "light" ? "light" : "dark",
        route: ROUTES.some((r) => r.id === j.route) ? j.route : "overview",
        log: Array.isArray(j.log) ? j.log.slice(-80) : [],
        favorites: fav.slice(0, MAX_FAV),
        notifReadIds,
        orgId,
        dismissedBanners,
        sortByRoute,
        tableDensity,
        recentRoutes,
        hiddenColsByRoute,
      };
    } catch {
      return {
        theme: "dark",
        route: "overview",
        log: [],
        favorites: [],
        notifReadIds: [],
        orgId: "hq",
        dismissedBanners: [],
        sortByRoute: {},
        tableDensity: "comfortable",
        recentRoutes: [],
        hiddenColsByRoute: {},
      };
    }
  };

  const saveState = (s) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: s.theme,
          route: s.route,
          log: s.log.slice(-80),
          favorites: s.favorites.slice(0, MAX_FAV),
          notifReadIds: s.notifReadIds.slice(-50),
          orgId: s.orgId,
          dismissedBanners: s.dismissedBanners.slice(-20),
          sortByRoute: s.sortByRoute || {},
          tableDensity: s.tableDensity === "compact" ? "compact" : "comfortable",
          recentRoutes: Array.isArray(s.recentRoutes) ? s.recentRoutes.slice(0, 5) : [],
          hiddenColsByRoute: s.hiddenColsByRoute && typeof s.hiddenColsByRoute === "object" ? s.hiddenColsByRoute : {},
        })
      );
    } catch {
      /* ignore */
    }
  };

  let state = loadState();

  const parseHashRoute = () => {
    const raw = (location.hash || "").replace(/^#/, "").replace(/^\//, "").trim();
    if (!raw) return null;
    return ROUTES.some((r) => r.id === raw) ? raw : null;
  };

  (function applyInitialHash() {
    const hr = parseHashRoute();
    if (hr) state.route = hr;
  })();

  let sidebarOpen = false;
  const mqDrawerSidebar = window.matchMedia("(max-width: 900px)");
  let sidebarMqWired = false;
  let paletteOpen = false;
  let paletteQuery = "";
  let paletteIndex = 0;
  let tableFilter = "";
  let tablePage = 0;
  let notifOpen = false;
  const selectedRowKeys = new Set();
  let detailFlowStep = 0;
  let detailContext = null;

  const lastRowLookup = new Map();
  const $app = document.getElementById("app");
  const $toastHost = document.getElementById("toast-host");

  const pushLog = (text) => {
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())} ${pad(ts.getHours())}:${pad(
      ts.getMinutes()
    )}`;
    state.log.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, stamp, text });
    saveState(state);
  };

  const toast = (title, body) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<strong>${escapeHtml(title)}</strong>${body ? `<span>${escapeHtml(body)}</span>` : ""}`;
    $toastHost.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      el.style.transition = "opacity .25s ease, transform .25s ease";
      setTimeout(() => el.remove(), 260);
    }, 3200);
  };

  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const escapeCsv = (s) => {
    const t = String(s);
    if (/[",\n]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
    return t;
  };

  const currentRoute = () => ROUTES.find((r) => r.id === state.route) || ROUTES[0];

  const currentOrg = () => ORGS.find((o) => o.id === state.orgId) || ORGS[0];

  const tableDataRouteId = () => (state.route === "overview" ? "sales" : state.route);

  const cellSortValue = (val, key, routeId) => {
    const s = String(val);
    if (key === "c3") {
      if (routeId === "manufacturing") {
        const n = parseFloat(s.replace("%", "").trim());
        return Number.isFinite(n) ? n : s.toLowerCase();
      }
      const n = parseFloat(s.replace(/[¥￥,\s%]/g, "").replace(/,/g, ""));
      return Number.isFinite(n) ? n : s.toLowerCase();
    }
    return s.toLowerCase();
  };

  const compareCells = (a, b, key, dir, routeId) => {
    const va = cellSortValue(a[key], key, routeId);
    const vb = cellSortValue(b[key], key, routeId);
    let c = 0;
    if (typeof va === "number" && typeof vb === "number") c = va - vb;
    else c = String(va).localeCompare(String(vb), "zh");
    return dir === "asc" ? c : -c;
  };

  const applySortToRows = (rows, routeId) => {
    const spec = tableSpec(routeId);
    const pref = state.sortByRoute && state.sortByRoute[routeId];
    if (!pref || !pref.key || !spec.keys.includes(pref.key)) return rows;
    const dir = pref.dir === "desc" ? "desc" : "asc";
    const key = pref.key;
    return [...rows].sort((x, y) => compareCells(x, y, key, dir, routeId));
  };

  const touchRecentRoute = (routeId) => {
    if (!ROUTES.some((r) => r.id === routeId)) return;
    const rest = state.recentRoutes.filter((id) => id !== routeId);
    state.recentRoutes = [routeId, ...rest].slice(0, 5);
  };

  const getFilteredTableRows = (routeId) => {
    const spec = tableSpec(routeId);
    const q = tableFilter.trim().toLowerCase();
    let rows = mockRows(routeId);
    if (q) {
      rows = rows.filter((r) => spec.keys.some((key) => String(r[key]).toLowerCase().includes(q)));
    }
    rows = applySortToRows(rows, routeId);
    rows.forEach((r, idx) => {
      r.rowKey = `${routeId}-${idx}`;
    });
    return rows;
  };

  const pruneStaleSelection = () => {
    for (const k of [...selectedRowKeys]) {
      if (!lastRowLookup.has(k)) selectedRowKeys.delete(k);
    }
  };

  const refreshBatchUi = () => {
    const btn = document.getElementById("batch-approve-btn");
    if (btn) {
      const n = selectedRowKeys.size;
      btn.disabled = n === 0;
      btn.textContent = n ? `批量审核 (${n})` : "批量审核";
    }
    document.querySelectorAll("#main-table-wrap tbody tr[data-row-key]").forEach((tr) => {
      tr.classList.toggle("is-selected", selectedRowKeys.has(tr.getAttribute("data-row-key")));
    });
  };

  const syncSelectAllCheckbox = () => {
    const el = document.querySelector("#main-table-wrap thead .js-select-all");
    if (!el) return;
    const rid = tableDataRouteId();
    const rows = getFilteredTableRows(rid);
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE) || 1);
    const safePage = Math.min(tablePage, totalPages - 1);
    const start = safePage * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);
    const keysOnPage = pageRows.map((r) => r.rowKey);
    const allOn = keysOnPage.length > 0 && keysOnPage.every((k) => selectedRowKeys.has(k));
    const someOn = keysOnPage.some((k) => selectedRowKeys.has(k));
    el.checked = allOn;
    el.indeterminate = someOn && !allOn;
  };

  const clearSelection = () => {
    selectedRowKeys.clear();
  };

  const unreadNotifCount = () =>
    MOCK_NOTIFICATIONS.filter((n) => !state.notifReadIds.includes(n.id)).length;

  const markNotifRead = (id) => {
    if (!state.notifReadIds.includes(id)) {
      state.notifReadIds.push(id);
      saveState(state);
    }
  };

  const toggleFavorite = (routeId) => {
    if (!ROUTES.some((r) => r.id === routeId)) return;
    const i = state.favorites.indexOf(routeId);
    if (i >= 0) {
      state.favorites.splice(i, 1);
      saveState(state);
      toast("已取消收藏", ROUTES.find((r) => r.id === routeId)?.label || "");
      return;
    }
    if (state.favorites.length >= MAX_FAV) {
      toast("收藏已满", `最多 ${MAX_FAV} 个`);
      return;
    }
    state.favorites.push(routeId);
    saveState(state);
    toast("已加入收藏", ROUTES.find((r) => r.id === routeId)?.label || "");
  };

  const downloadBlob = (filename, text, mime) => {
    const blob = new Blob([text], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportTableCsv = () => {
    const rid = tableDataRouteId();
    const vis = getVisibleColumns(rid);
    const rows = getFilteredTableRows(rid);
    const head = vis.h.map(escapeCsv).join(",");
    const lines = rows.map((r) => vis.keys.map((k) => escapeCsv(r[k])).join(","));
    const csv = "\ufeff" + [head, ...lines].join("\n");
    const name = `nebula_${rid}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(name, csv, "text/csv;charset=utf-8");
    pushLog(`[导出] 已下载表格 CSV：${name}（${rows.length} 行）`);
    toast("已导出 CSV", name);
  };

  const exportLogTxt = () => {
    if (!state.log.length) {
      toast("暂无日志", "先执行模拟操作再导出");
      return;
    }
    const body = state.log.map((x) => `[${x.stamp}] ${x.text}`).join("\n");
    downloadBlob(`nebula_ops_${new Date().toISOString().slice(0, 10)}.log`, body, "text/plain;charset=utf-8");
    toast("已导出日志", ".log 文件已下载");
  };

  const copyTimelineText = () => {
    const lines = state.log.length
      ? state.log.map((x) => `[${x.stamp}] ${x.text}`)
      : ["（暂无操作记录）"];
    navigator.clipboard?.writeText(lines.join("\n")).then(
      () => toast("已复制", "动态内容已写入剪贴板"),
      () => toast("复制失败", "浏览器未授权剪贴板")
    );
  };

  const mockKpis = (routeId) => {
    const day = new Date().toISOString().slice(0, 10);
    const rand = rnd(hashSeed(routeId + day + state.orgId));
    const base = 1e5 + rand() * 4e5;
    if (routeId === "overview") {
      return [
        { label: "今日出库金额", value: fmtMoney(base * 1.1), delta: `${(rand() * 4 + 1).toFixed(1)}%`, up: true },
        { label: "在制工单", value: fmtNum(20 + rand() * 40), delta: `${(rand() * 3).toFixed(1)}%`, up: false },
        { label: "待审单据", value: fmtNum(3 + rand() * 12), delta: "环比", up: rand() > 0.5 },
        { label: "库存周转天数", value: `${(18 + rand() * 10).toFixed(1)} 天`, delta: `${(rand() * 2).toFixed(1)} 天`, up: rand() > 0.5 },
      ];
    }
    if (routeId === "sales") {
      return [
        { label: "本月签约", value: fmtMoney(base * 2.2), delta: `${(rand() * 8 + 2).toFixed(1)}%`, up: true },
        { label: "待发货行", value: fmtNum(80 + rand() * 120), delta: "较昨日", up: rand() > 0.4 },
        { label: "回款率", value: `${(82 + rand() * 12).toFixed(1)}%`, delta: "目标 85%", up: rand() > 0.5 },
        { label: "退货率", value: `${(rand() * 2.5).toFixed(2)}%`, delta: "滚动 30 天", up: false },
      ];
    }
    if (routeId === "purchase") {
      return [
        { label: "在途订单金额", value: fmtMoney(base * 0.9), delta: `${fmtNum(rand() * 6)} 笔`, up: true },
        { label: "准时到货率", value: `${(88 + rand() * 8).toFixed(1)}%`, delta: "供应商维度", up: rand() > 0.3 },
        { label: "待对账发票", value: fmtNum(4 + rand() * 15), delta: "财务共享", up: rand() > 0.5 },
        { label: "安全库存预警", value: fmtNum(rand() * 8), delta: "SKU 数", up: false },
      ];
    }
    if (routeId === "inventory") {
      return [
        { label: "可用库存金额", value: fmtMoney(base * 3.5), delta: "全组织", up: rand() > 0.5 },
        { label: "冻结数量行", value: fmtNum(12 + rand() * 40), delta: "质检/锁库", up: rand() > 0.5 },
        { label: "今日出入库笔数", value: fmtNum(200 + rand() * 400), delta: "含调拨", up: true },
        { label: "盘点差异", value: fmtMoney(rand() * 900), delta: "待处理", up: false },
      ];
    }
    if (routeId === "finance") {
      return [
        { label: "应收余额", value: fmtMoney(base * 1.8), delta: "账期内", up: rand() > 0.5 },
        { label: "应付余额", value: fmtMoney(base * 1.2), delta: "已暂估", up: rand() > 0.5 },
        { label: "现金流覆盖", value: `${(1.1 + rand() * 0.4).toFixed(2)}x`, delta: "滚动 90 天", up: true },
        { label: "未核销差异", value: fmtNum(rand() * 6), delta: "对账中心", up: false },
      ];
    }
    if (routeId === "manufacturing") {
      return [
        { label: "计划达成率", value: `${(91 + rand() * 6).toFixed(1)}%`, delta: "本周", up: true },
        { label: "设备 OEE", value: `${(72 + rand() * 18).toFixed(1)}%`, delta: "关键产线", up: rand() > 0.45 },
        { label: "在制不良率", value: `${(rand() * 1.8).toFixed(2)}%`, delta: "PPM 模拟", up: false },
        { label: "报工待同步", value: fmtNum(rand() * 25), delta: "MES 队列", up: rand() > 0.5 },
      ];
    }
    return [
      { label: "主题", value: state.theme === "dark" ? "深色" : "浅色", delta: "本机保存", up: true },
      { label: "演示日志条数", value: fmtNum(state.log.length), delta: "最多 80", up: state.log.length < 40 },
      { label: "命令面板", value: "Ctrl K", delta: "快速跳转", up: true },
      { label: "数据性质", value: "静态模拟", delta: "无后端", up: true },
    ];
  };

  const metaBlock = (rand) => {
    const owners = ["王某", "李某", "周某", "陈某"];
    const depts = ["销售部", "采购部", "仓储部", "财务部", "生产部"];
    const remarks = ["常规", "加急", "客户设变", "试产", "盘点调整"];
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const m = Math.floor(rand() * 9) + 1;
    const d = Math.floor(rand() * 27) + 1;
    return {
      dept: pick(depts),
      operator: pick(owners),
      created: `2025-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      remark: pick(remarks),
      lines: `${Math.floor(rand() * 12) + 1} 行`,
    };
  };

  const mockRows = (routeId) => {
    const rand = rnd(hashSeed(routeId + "rows" + state.orgId));
    const customers = ["华东精密", "云启科技", "远航电子", "嘉禾医疗", "北辰汽配", "澜图包装"];
    const suppliers = ["鑫源钢材", "恒通化工", "联创光电", "宏泰物流", "景明橡胶", "坤元纸业"];
    const skus = ["A-1001 控制器", "B-220 结构件", "C-09 线束", "D-331 钣金", "E-77 密封圈", "F-12 芯片"];
    const statuses = [
      { t: "已审核", c: "ok" },
      { t: "待审核", c: "warn" },
      { t: "执行中", c: "info" },
      { t: "已关闭", c: "ok" },
      { t: "异常", c: "danger" },
    ];
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];

    const rows = [];
    const n = 26;
    for (let i = 0; i < n; i++) {
      const st = pick(statuses);
      const id = `NX-${String(240400 + i * 11 + Math.floor(rand() * 9)).padStart(6, "0")}`;
      const meta = metaBlock(rnd(hashSeed(`${routeId}-${i}`)));
      if (routeId === "sales" || routeId === "overview") {
        rows.push({
          c1: id,
          c2: pick(customers),
          c3: fmtMoney(8000 + rand() * 120000),
          c4: st.t,
          badge: st.c,
          meta,
        });
      } else if (routeId === "purchase") {
        rows.push({
          c1: id,
          c2: pick(suppliers),
          c3: fmtNum(20 + rand() * 5000),
          c4: st.t,
          badge: st.c,
          meta,
        });
      } else if (routeId === "inventory") {
        rows.push({
          c1: pick(skus),
          c2: ["总仓", "华东 RDC", "华南 RDC", "VMI 仓"][Math.floor(rand() * 4)],
          c3: fmtNum(rand() * 8000),
          c4: st.t,
          badge: st.c,
          meta,
        });
      } else if (routeId === "finance") {
        const fr = ["待核销", "部分核销", "已核销", "争议"];
        const fc = ["warn", "info", "ok", "danger"];
        const fi = Math.floor(rand() * 4);
        rows.push({
          c1: id,
          c2: rand() > 0.5 ? pick(customers) : pick(suppliers),
          c3: fmtMoney(5000 + rand() * 200000),
          c4: fr[fi],
          badge: fc[fi],
          meta,
        });
      } else if (routeId === "manufacturing") {
        rows.push({
          c1: `MO-${100088 + i}`,
          c2: pick(skus),
          c3: `${Math.floor(rand() * 100)}%`,
          c4: ["排队", "加工", "待检", "已完工"][Math.floor(rand() * 4)],
          badge: st.c,
          meta,
        });
      } else {
        rows.push({
          c1: ["主题", "路由", "日志", "筛选", "快捷键", "关于"][i % 6],
          c2: "偏好项",
          c3: ["深色", state.route, `${state.log.length} 条`, tableFilter || "—", "Ctrl+K", "演示"][i % 6],
          c4: "本地",
          badge: "info",
          meta,
        });
      }
    }
    return rows;
  };

  const tableSpec = (routeId) => {
    if (routeId === "sales" || routeId === "overview")
      return { h: ["单据", "客户", "含税金额", "状态"], keys: ["c1", "c2", "c3", "c4"] };
    if (routeId === "purchase") return { h: ["单据", "供应商", "数量", "状态"], keys: ["c1", "c2", "c3", "c4"] };
    if (routeId === "inventory") return { h: ["物料", "仓库", "可用量", "状态"], keys: ["c1", "c2", "c3", "c4"] };
    if (routeId === "finance") return { h: ["台账行", "往来单位", "余额", "核销"], keys: ["c1", "c2", "c3", "c4"] };
    if (routeId === "manufacturing") return { h: ["工单", "产品", "完成度", "工序状态"], keys: ["c1", "c2", "c3", "c4"] };
    return { h: ["项", "类别", "值", "范围"], keys: ["c1", "c2", "c3", "c4"] };
  };

  const getVisibleColumns = (routeId) => {
    const spec = tableSpec(routeId);
    const raw = (state.hiddenColsByRoute && state.hiddenColsByRoute[routeId]) || [];
    const hidden = new Set(raw.filter((k) => spec.keys.includes(k)));
    const keys = [];
    const h = [];
    spec.keys.forEach((k, i) => {
      if (!hidden.has(k)) {
        keys.push(k);
        h.push(spec.h[i]);
      }
    });
    if (keys.length === 0) return { h: spec.h, keys: spec.keys };
    return { h, keys };
  };

  const renderColVisPanel = (routeId) => {
    const spec = tableSpec(routeId);
    const hidden = new Set((state.hiddenColsByRoute && state.hiddenColsByRoute[routeId]) || []);
    return spec.keys
      .map((k, i) => {
        const on = !hidden.has(k);
        return `<label class="col-vis-label"><input type="checkbox" class="js-col-vis" data-col="${k}" ${on ? "checked" : ""} /> ${escapeHtml(spec.h[i])}</label>`;
      })
      .join("");
  };

  const timeline = () => {
    const items = state.log.slice(0, 6);
    if (!items.length) {
      return [
        { t: "系统", m: "欢迎使用星云工作台。数据均为前端随机种子生成。", time: "—" },
        { t: "提示", m: "使用 Ctrl+K 打开命令面板；点表格行查看详情。", time: "—" },
      ];
    }
    return items.map((x) => ({ t: "操作", m: x.text, time: x.stamp.slice(11) }));
  };

  const buildDetailHtml = (routeId, row, spec) => {
    const m = row.meta || {};
    const rows = [
      ["业务日期", m.created || "—"],
      ["责任部门", m.dept || "—"],
      ["经办人", m.operator || "—"],
      ["备注摘要", m.remark || "—"],
      ["明细行数", m.lines || "—"],
      [spec.h[0], row.c1],
      [spec.h[1], row.c2],
      [spec.h[2], row.c3],
      [spec.h[3], row.c4],
    ];
    return `<dl>${rows
      .map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`)
      .join("")}</dl>`;
  };

  const buildApprovalHtml = (completedSteps) => {
    const items = APPROVAL_LABELS.map((label, i) => {
      let cls = "";
      if (i < completedSteps) cls = "is-done";
      else if (i === completedSteps) cls = "is-current";
      return `<li class="${cls}">${escapeHtml(label)}</li>`;
    }).join("");
    const done = completedSteps >= APPROVAL_LABELS.length;
    return `<section class="detail-approval">
      <h4>模拟审批流</h4>
      <ol class="approval-steps">${items}</ol>
      <button type="button" class="btn btn--primary js-approval-next" ${done ? "disabled" : ""}>${done ? "流程已结束" : "下一步（模拟）"}</button>
    </section>`;
  };

  const renderDetailBodyFull = () => {
    if (!detailContext) return "";
    const { routeId, row } = detailContext;
    const spec = tableSpec(routeId);
    return buildDetailHtml(routeId, row, spec) + buildApprovalHtml(detailFlowStep);
  };

  const renderKpis = (routeId) => {
    const kpis = mockKpis(routeId);
    return kpis
      .map((k) => {
        const cls = k.up ? "kpi__delta kpi__delta--up" : "kpi__delta kpi__delta--down";
        const arrow = k.up ? "▲" : "▼";
        return `<article class="kpi">
          <div class="kpi__label">${escapeHtml(k.label)}</div>
          <div class="kpi__value">${escapeHtml(k.value)}</div>
          <div class="${cls}">${arrow} ${escapeHtml(k.delta)}</div>
        </article>`;
      })
      .join("");
  };

  const renderQuickLinks = () => {
    const links = [
      { id: "sales", label: "销售", sub: "订单与出库" },
      { id: "purchase", label: "采购", sub: "订单与到货" },
      { id: "inventory", label: "库存", sub: "多仓沙盘" },
      { id: "finance", label: "财务", sub: "应收应付" },
    ];
    return `<div class="quick-grid" role="navigation" aria-label="快捷入口">
      ${links
        .map(
          (x) => `<button type="button" class="quick-card js-nav" data-route="${x.id}">
        <span class="quick-card__label">${escapeHtml(x.label)}</span>
        <span class="quick-card__sub">${escapeHtml(x.sub)}</span>
      </button>`
        )
        .join("")}
    </div>`;
  };

  const renderSortTh = (routeId, label, colKey) => {
    const pref = state.sortByRoute[routeId];
    const active = pref && pref.key === colKey;
    const ico = !active ? "↕" : pref.dir === "asc" ? "↑" : "↓";
    const sort = active ? (pref.dir === "asc" ? "ascending" : "descending") : "none";
    return `<th class="th-sort" scope="col"><button type="button" class="th-sort-btn js-sort-col" data-col="${colKey}" aria-sort="${sort}">${escapeHtml(label)}<span class="th-sort-ico" aria-hidden="true">${ico}</span></button></th>`;
  };

  const renderTable = (routeId) => {
    const vis = getVisibleColumns(routeId);
    const rows = getFilteredTableRows(routeId);

    lastRowLookup.clear();
    rows.forEach((r) => lastRowLookup.set(r.rowKey, { routeId, row: r }));

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
    if (tablePage >= totalPages) tablePage = totalPages - 1;
    const start = tablePage * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);

    const head =
      `<th class="col-check"><input type="checkbox" class="js-select-all" aria-label="本页全选" /></th>` +
      vis.keys.map((k, i) => renderSortTh(routeId, vis.h[i], k)).join("");
    const body = pageRows
      .map(
        (r) =>
          `<tr class="data-row" tabindex="0" data-row-key="${escapeHtml(r.rowKey)}">
            <td class="col-check" data-stop-row="1"><input type="checkbox" class="js-row-check" data-row-key="${escapeHtml(r.rowKey)}" ${selectedRowKeys.has(r.rowKey) ? "checked" : ""} aria-label="选择行" /></td>
            ${vis.keys
              .map(
                (k, idx) =>
                  `<td>${idx === vis.keys.length - 1 ? `<span class="badge badge--${r.badge}">${escapeHtml(r[k])}</span>` : escapeHtml(r[k])}</td>`
              )
              .join("")}
          </tr>`
      )
      .join("");

    const pager =
      total > PAGE_SIZE
        ? `<div class="table-pager">
        <span>共 ${fmtNum(total)} 条 · 第 ${tablePage + 1} / ${totalPages} 页</span>
        <div class="table-pager__btns">
          <button type="button" class="btn btn--ghost js-page-prev" ${tablePage <= 0 ? "disabled" : ""}>上一页</button>
          <button type="button" class="btn btn--ghost js-page-next" ${tablePage >= totalPages - 1 ? "disabled" : ""}>下一页</button>
        </div>
      </div>`
        : `<div class="table-pager"><span>共 ${fmtNum(total)} 条</span></div>`;

    return `<div class="table-wrap table-wrap--scroll" id="main-table-wrap"><table class="data data--sortable" role="grid"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${pager}</div>`;
  };

  const renderTimeline = () => {
    const items = timeline();
    return items
      .map(
        (it) => `<div class="tl-item">
        <div class="tl-dot" aria-hidden="true"></div>
        <div class="tl-body">
          <strong>${escapeHtml(it.t)}</strong>
          <p>${escapeHtml(it.m)}</p>
        </div>
        <span class="tl-time">${escapeHtml(it.time)}</span>
      </div>`
      )
      .join("");
  };

  const renderView = () => {
    const r = currentRoute();
    const isSettings = r.id === "settings";

    if (isSettings) {
      return `<div class="view" id="view-root">
        <div class="view-head">
          <div>
            <h1>${escapeHtml(r.label)}</h1>
            <p>${escapeHtml(r.desc)}</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel__head"><h2>外观</h2></div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-body">
                <strong>主题模式</strong>
                <p>在浅色与深色之间切换；设置写入本机浏览器。</p>
              </div>
              <button type="button" class="btn btn--primary js-theme-toggle">切换为${state.theme === "dark" ? "浅色" : "深色"}</button>
            </div>
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-body">
                <strong>表格密度</strong>
                <p>业务明细表行高与字号；与主题一并保存。</p>
              </div>
              <div class="density-btns">
                <button type="button" class="btn ${state.tableDensity === "comfortable" ? "btn--primary" : ""} js-density" data-density="comfortable">舒适</button>
                <button type="button" class="btn ${state.tableDensity === "compact" ? "btn--primary" : ""} js-density" data-density="compact">紧凑</button>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel__head"><h2>演示数据</h2></div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-body">
                <strong>重置本地状态</strong>
                <p>清除主题、路由、组织、预警条、收藏、通知已读、列显示、操作日志。</p>
              </div>
              <button type="button" class="btn js-reset">重置</button>
            </div>
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-body">
                <strong>导出操作日志</strong>
                <p>将当前最多 80 条模拟操作记录下载为 .log 文本。</p>
              </div>
              <button type="button" class="btn js-export-log">下载 .log</button>
            </div>
          </div>
        </div>
        <div class="grid-kpi">${renderKpis("settings")}</div>
      </div>`;
    }

    const quick = r.id === "overview" ? renderQuickLinks() : "";

    return `<div class="view" id="view-root">
      ${quick}
      <div class="view-head">
        <div>
          <h1>${escapeHtml(r.label)}</h1>
          <p>${escapeHtml(r.desc)}</p>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn--primary js-sim" data-kind="approve">模拟审核</button>
          <button type="button" class="btn js-sim" data-kind="sync">模拟同步</button>
          <button type="button" class="btn js-export-table">导出表格 CSV</button>
        </div>
      </div>
      <div class="grid-kpi">${renderKpis(r.id)}</div>
      <div class="split">
        <div>
          <section class="panel panel--popover">
            <div class="panel__head">
              <h2>${r.id === "overview" ? "跨模块动态" : "业务明细"}</h2>
              <div class="panel__tools">
                <details class="col-vis" id="col-vis-details">
                  <summary class="btn btn--ghost col-vis-summary">列显示</summary>
                  <div class="col-vis-pop" role="group" aria-label="列显示">${renderColVisPanel(tableDataRouteId())}</div>
                </details>
                <button type="button" class="btn btn--primary js-batch-approve" id="batch-approve-btn" disabled>批量审核</button>
                <input type="search" class="input js-table-filter" placeholder="筛选当前表…" value="${escapeHtml(tableFilter)}" aria-label="筛选表格" />
                <button type="button" class="btn btn--ghost js-sort-clear">清除排序</button>
                <button type="button" class="btn btn--ghost js-refresh">刷新演示数据</button>
              </div>
            </div>
            ${renderTable(tableDataRouteId())}
          </section>
        </div>
        <aside class="panel" aria-label="时间线">
          <div class="panel__head">
            <h2>动态</h2>
            <div class="panel__tools">
              <button type="button" class="btn btn--ghost js-copy-tl">复制</button>
            </div>
          </div>
          <div class="timeline">${renderTimeline()}</div>
        </aside>
      </div>
    </div>`;
  };

  const renderNavGroups = () => {
    const favIds = [...state.favorites];
    const favBlock =
      favIds.length > 0
        ? `<div class="nav-group">
        <div class="nav-group__label">收藏</div>
        ${favIds
          .map((id) => {
            const item = ROUTES.find((x) => x.id === id);
            if (!item) return "";
            return `<div class="nav-item-wrap">
            <button type="button" class="nav-item js-nav" data-route="${item.id}" aria-current="${item.id === state.route ? "page" : "false"}">
              ${ICONS[item.icon] || ""}<span>${escapeHtml(item.label)}</span>
            </button>
            <button type="button" class="nav-fav js-fav is-on" data-route="${item.id}" aria-label="取消收藏 ${escapeHtml(item.label)}" title="取消收藏">★</button>
          </div>`;
          })
          .join("")}
      </div>`
        : "";

    const navGroups = {};
    ROUTES.forEach((item) => {
      navGroups[item.group] = navGroups[item.group] || [];
      navGroups[item.group].push(item);
    });

    const rest = Object.keys(navGroups)
      .map(
        (g) => `<div class="nav-group">
        <div class="nav-group__label">${escapeHtml(g)}</div>
        ${navGroups[g]
          .map((item) => {
            const on = state.favorites.includes(item.id) ? "is-on" : "";
            return `<div class="nav-item-wrap">
            <button type="button" class="nav-item js-nav" data-route="${item.id}" aria-current="${item.id === state.route ? "page" : "false"}">
              ${ICONS[item.icon] || ""}<span>${escapeHtml(item.label)}</span>
            </button>
            <button type="button" class="nav-fav js-fav ${on}" data-route="${item.id}" aria-label="收藏 ${escapeHtml(item.label)}" title="收藏">★</button>
          </div>`;
          })
          .join("")}
      </div>`
      )
      .join("");

    return favBlock + rest;
  };

  const renderShell = () => {
    const r = currentRoute();
    const org = currentOrg();
    const unread = unreadNotifCount();
    const badgeCls = unread > 0 ? "notif-badge is-on" : "notif-badge";
    const showBanner = !state.dismissedBanners.includes(ALERT_BANNER_ID);
    const orgOptions = ORGS.map(
      (o) => `<option value="${escapeHtml(o.id)}" ${o.id === state.orgId ? "selected" : ""}>${escapeHtml(o.name)}</option>`
    ).join("");

    return `
      <aside class="sidebar" id="sidebar" aria-label="主导航">
        <div class="sidebar-brand">
          <div class="sidebar-brand__row">
            <div class="sidebar-brand__mark">NX</div>
            <div class="sidebar-brand__text">
              <strong>星云工作台</strong>
              <span>Enterprise Mock</span>
            </div>
          </div>
        </div>
        <nav class="sidebar-nav">${renderNavGroups()}</nav>
        <div class="sidebar-foot">静态演示 · 非金蝶官方产品<br />商标归权利人所有</div>
      </aside>
      <div class="drawer-backdrop" id="drawer-backdrop" aria-hidden="true"></div>
      <div class="main">
        <header class="topbar">
          <button type="button" class="menu-toggle" id="menu-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="sidebar">${ICONS.menu}</button>
          <div class="org-select-wrap">
            <label for="org-select">组织</label>
            <select id="org-select" class="input org-select" aria-label="切换组织">${orgOptions}</select>
          </div>
          <div class="breadcrumb">
            <span class="sep" aria-hidden="true">|</span>
            <strong>${escapeHtml(org.name)}</strong><span class="sep">/</span><strong>${escapeHtml(r.label)}</strong>
          </div>
          <div class="topbar-spacer"></div>
          <div class="notif-wrap" id="notif-wrap">
            <button type="button" class="icon-btn notif-btn" id="btn-notif" aria-label="通知" aria-expanded="false">${ICONS.bell}<span class="${badgeCls}" id="notif-badge">${unread > 0 ? escapeHtml(String(unread)) : ""}</span></button>
            <div class="notif-pop" id="notif-pop" role="menu" aria-hidden="true">
              <div class="notif-pop__head">通知 · 演示数据</div>
              ${MOCK_NOTIFICATIONS.map((n) => {
                const read = state.notifReadIds.includes(n.id);
                return `<button type="button" class="notif-item ${read ? "is-read" : ""} js-notif-item" data-notif-id="${n.id}" role="menuitem">
                  <strong>${escapeHtml(n.title)}</strong>
                  <span>${escapeHtml(n.body)}</span>
                  <time>${escapeHtml(n.time)}</time>
                </button>`;
              }).join("")}
            </div>
          </div>
          <button type="button" class="search-chip" id="open-palette" aria-label="打开命令面板">
            ${ICONS.search}
            <span>搜索或跳转…</span>
            <span class="search-chip__kbd-wrap"><kbd>Ctrl</kbd><kbd>K</kbd></span>
          </button>
          <button type="button" class="icon-btn" id="btn-help" title="快捷键" aria-label="快捷键帮助">${ICONS.help}</button>
          <button type="button" class="icon-btn js-theme-toggle" title="切换主题" aria-label="切换主题">
            ${state.theme === "dark" ? ICONS.sun : ICONS.moon}
          </button>
          <div class="user-pill">
            <span>演示用户</span>
            <div class="user-pill__avatar" aria-hidden="true">演</div>
          </div>
        </header>
        ${
          showBanner
            ? `<div class="alert-banner" role="status">
          <div class="alert-banner__text"><strong>演示提示</strong>：当前为静态沙盘，切换组织会改变随机演示数据；请勿用于正式业务决策。</div>
          <button type="button" class="icon-btn js-dismiss-banner" aria-label="关闭提示">${ICONS.x}</button>
        </div>`
            : ""
        }
        ${renderView()}
      </div>
    `;
  };

  const paletteRoutes = () => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return ROUTES.slice();
    const hit = ROUTES.filter(
      (r) => r.label.toLowerCase().includes(q) || r.id.includes(q) || r.desc.toLowerCase().includes(q)
    );
    return hit.length ? hit : [];
  };

  const getPaletteFlatList = () => {
    const q = paletteQuery.trim().toLowerCase();
    if (q) return paletteRoutes();
    const recentObjs = state.recentRoutes.map((id) => ROUTES.find((r) => r.id === id)).filter(Boolean);
    const rest = ROUTES.filter((r) => !state.recentRoutes.includes(r.id));
    return recentObjs.length ? [...recentObjs, ...rest] : ROUTES.slice();
  };

  const renderPaletteRow = (r, pos) => {
    const selected = pos === paletteIndex;
    return `<button type="button" class="palette__item" role="option" aria-selected="${selected}" data-route="${r.id}" data-pos="${pos}">
      ${ICONS[r.icon] || ""}
      <span>${escapeHtml(r.label)}</span>
      <small>${escapeHtml(r.id)}</small>
    </button>`;
  };

  const renderPaletteItems = () => {
    const q = paletteQuery.trim().toLowerCase();
    let html = "";
    if (!q && state.recentRoutes.length) {
      const recentObjs = state.recentRoutes.map((id) => ROUTES.find((r) => r.id === id)).filter(Boolean);
      const rest = ROUTES.filter((r) => !state.recentRoutes.includes(r.id));
      if (recentObjs.length) {
        html += `<div class="palette__section" role="presentation">最近访问</div>`;
        let pos = 0;
        recentObjs.forEach((r) => {
          html += renderPaletteRow(r, pos);
          pos++;
        });
        html += `<div class="palette__section" role="presentation">全部模块</div>`;
        rest.forEach((r) => {
          html += renderPaletteRow(r, pos);
          pos++;
        });
        const total = recentObjs.length + rest.length;
        if (paletteIndex >= total) paletteIndex = 0;
        return html;
      }
    }
    const routes = q ? paletteRoutes() : ROUTES.slice();
    if (!routes.length) {
      return `<div class="palette__item" style="cursor:default;opacity:.65">无匹配模块，试试「销售」「库存」…</div>`;
    }
    if (paletteIndex >= routes.length) paletteIndex = 0;
    return routes.map((r, pos) => renderPaletteRow(r, pos)).join("");
  };

  const renderPalette = () =>
    `<div class="overlay ${paletteOpen ? "is-open" : ""}" id="palette-overlay" role="presentation" aria-hidden="${String(!paletteOpen)}">
      <div class="palette" role="dialog" aria-modal="true" aria-label="命令面板">
        <div class="palette__bar">
          ${ICONS.search}
          <input type="text" id="palette-input" autocomplete="off" placeholder="输入模块名称…" value="${escapeHtml(paletteQuery)}" />
          <span class="palette__hint">Esc 关闭</span>
        </div>
        <div class="palette__list" id="palette-list" role="listbox" aria-label="模块列表">${renderPaletteItems()}</div>
      </div>
    </div>`;

  const openDetailDrawer = (routeId, row) => {
    const spec = tableSpec(routeId);
    const title = `${spec.h[0]} · ${row.c1}`;
    detailContext = { routeId, row };
    detailFlowStep = 0;
    const sheet = document.getElementById("detail-sheet");
    const back = document.getElementById("detail-backdrop");
    const titleEl = document.getElementById("detail-title");
    const bodyEl = document.getElementById("detail-body");
    if (!sheet || !back || !titleEl || !bodyEl) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = renderDetailBodyFull();
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    back.classList.add("is-open");
    back.setAttribute("aria-hidden", "false");
  };

  const closeDetailDrawer = () => {
    detailContext = null;
    detailFlowStep = 0;
    document.getElementById("detail-sheet")?.classList.remove("is-open");
    document.getElementById("detail-backdrop")?.classList.remove("is-open");
    document.getElementById("detail-sheet")?.setAttribute("aria-hidden", "true");
    document.getElementById("detail-backdrop")?.setAttribute("aria-hidden", "true");
  };

  const openHelpModal = () => {
    document.getElementById("help-modal")?.classList.add("is-open");
    document.getElementById("help-backdrop")?.classList.add("is-open");
    document.getElementById("help-modal")?.setAttribute("aria-hidden", "false");
    document.getElementById("help-backdrop")?.setAttribute("aria-hidden", "false");
  };

  const closeHelpModal = () => {
    document.getElementById("help-modal")?.classList.remove("is-open");
    document.getElementById("help-backdrop")?.classList.remove("is-open");
    document.getElementById("help-modal")?.setAttribute("aria-hidden", "true");
    document.getElementById("help-backdrop")?.setAttribute("aria-hidden", "true");
  };

  const initOverlaysOnce = () => {
    const host = document.getElementById("overlay-host");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    host.innerHTML = `
      <div id="detail-backdrop" class="detail-backdrop" aria-hidden="true"></div>
      <aside id="detail-sheet" class="detail-sheet" aria-hidden="true" aria-labelledby="detail-title">
        <div class="detail-sheet__head">
          <h3 id="detail-title">详情</h3>
          <button type="button" class="icon-btn" id="detail-close" aria-label="关闭">${ICONS.x}</button>
        </div>
        <div id="detail-body" class="detail-sheet__body"></div>
      </aside>
      <div id="help-backdrop" class="detail-backdrop help-backdrop" aria-hidden="true"></div>
      <div id="help-modal" class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" aria-hidden="true">
        <div class="help-modal__head">
          <h3 id="help-title">快捷键</h3>
          <button type="button" class="icon-btn" id="help-close" aria-label="关闭">${ICONS.x}</button>
        </div>
        <div class="help-modal__body">
          <div class="help-shortcut"><span>打开 / 关闭命令面板</span><kbd>Ctrl</kbd> <kbd>K</kbd></div>
          <div class="help-shortcut"><span>关闭面板 / 抽屉 / 本窗口（焦点在页面时）</span><kbd>Esc</kbd></div>
          <div class="help-shortcut"><span>打开本帮助</span><kbd>Ctrl</kbd> <kbd>/</kbd></div>
          <div class="help-shortcut"><span>表格行</span><span>点击或 Enter 聚焦后打开详情抽屉</span></div>
          <div class="help-shortcut"><span>侧栏 ★</span><span>收藏模块到「收藏」分组</span></div>
          <div class="help-shortcut"><span>顶栏「组织」</span><span>切换后 KPI 与表格种子会变化</span></div>
          <div class="help-shortcut"><span>表格</span><span>勾选后可用「批量审核」；行内详情含模拟审批流</span></div>
          <div class="help-shortcut"><span>表头</span><span>点击列名排序；「清除排序」恢复默认</span></div>
          <div class="help-shortcut"><span>命令面板</span><span>空搜索时优先列出最近访问模块</span></div>
          <div class="help-shortcut"><span>偏好</span><span>可切换表格「紧凑 / 舒适」密度</span></div>
          <div class="help-shortcut"><span>地址栏</span><span>使用 <kbd>#/</kbd> 模块 id 直达，如 <kbd>#/inventory</kbd></span></div>
          <div class="help-shortcut"><span>列显示</span><span>业务表工具栏可隐藏列（每表独立记忆）；导出 CSV 仅含可见列</span></div>
          <p style="margin:14px 0 0;font-size:12px;color:var(--muted2)">数据均为静态模拟，不连接真实业务系统。</p>
        </div>
      </div>
    `;
    document.getElementById("detail-backdrop")?.addEventListener("click", closeDetailDrawer);
    document.getElementById("detail-close")?.addEventListener("click", closeDetailDrawer);
    document.getElementById("help-backdrop")?.addEventListener("click", closeHelpModal);
    document.getElementById("help-close")?.addEventListener("click", closeHelpModal);
    document.getElementById("detail-sheet")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".js-approval-next");
      if (!btn || btn.disabled) return;
      e.preventDefault();
      detailFlowStep++;
      const bodyEl = document.getElementById("detail-body");
      if (bodyEl) bodyEl.innerHTML = renderDetailBodyFull();
      if (detailFlowStep >= APPROVAL_LABELS.length) {
        const doc = detailContext?.row?.c1 || "单据";
        pushLog(`[审批] ${doc} 模拟流程已完成（已过账）`);
        toast("流程完成", "演示审批已推进到「过账」");
      } else {
        toast("已推进", `${APPROVAL_LABELS[detailFlowStep]} 进行中`);
      }
    });
  };

  const replaceTableOnly = () => {
    const wrap = document.getElementById("main-table-wrap");
    if (wrap) wrap.outerHTML = renderTable(tableDataRouteId());
    pruneStaleSelection();
    refreshBatchUi();
    requestAnimationFrame(() => syncSelectAllCheckbox());
  };

  const mount = () => {
    sidebarOpen = false;
    initOverlaysOnce();
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.tableDensity = state.tableDensity === "compact" ? "compact" : "comfortable";
    $app.innerHTML = renderShell() + renderPalette();
    bind();
    const pop = document.getElementById("notif-pop");
    const btn = document.getElementById("btn-notif");
    if (notifOpen && pop && btn) {
      pop.classList.add("is-open");
      pop.setAttribute("aria-hidden", "false");
      btn.setAttribute("aria-expanded", "true");
    }
    syncHashFromState();
  };

  const syncHashFromState = () => {
    const target = `#/${state.route}`;
    if (location.hash === target) return;
    try {
      history.replaceState(null, "", `${location.pathname}${location.search}${target}`);
    } catch {
      try {
        location.hash = target;
      } catch {
        /* ignore */
      }
    }
  };

  const syncSidebarA11y = () => {
    const toggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if (!toggle || !sidebar) return;
    toggle.setAttribute("aria-expanded", String(sidebarOpen));
    toggle.setAttribute("aria-controls", "sidebar");
    toggle.setAttribute("aria-label", sidebarOpen ? "关闭菜单" : "打开菜单");
    if (mqDrawerSidebar.matches) {
      sidebar.setAttribute("aria-hidden", String(!sidebarOpen));
    } else {
      sidebar.setAttribute("aria-hidden", "false");
    }
  };

  const closeSidebarDrawer = () => {
    if (!sidebarOpen) return;
    sidebarOpen = false;
    document.getElementById("sidebar")?.classList.remove("is-open");
    document.getElementById("drawer-backdrop")?.classList.remove("is-open");
    syncSidebarA11y();
  };

  const bind = () => {
    const $sidebar = document.getElementById("sidebar");
    const $backdrop = document.getElementById("drawer-backdrop");
    const $paletteInput = document.getElementById("palette-input");

    document.getElementById("menu-toggle")?.addEventListener("click", () => {
      sidebarOpen = !sidebarOpen;
      $sidebar.classList.toggle("is-open", sidebarOpen);
      $backdrop.classList.toggle("is-open", sidebarOpen);
      syncSidebarA11y();
    });
    $backdrop.addEventListener("click", () => {
      closeSidebarDrawer();
    });

    $app.querySelectorAll(".js-nav").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.route = btn.getAttribute("data-route");
        touchRecentRoute(state.route);
        tableFilter = "";
        tablePage = 0;
        clearSelection();
        saveState(state);
        closeSidebarDrawer();
        notifOpen = false;
        mount();
        toast("已切换模块", currentRoute().label);
      });
    });

    document.getElementById("org-select")?.addEventListener("change", (e) => {
      const v = e.target.value;
      if (!ORGS.some((o) => o.id === v)) return;
      state.orgId = v;
      tablePage = 0;
      clearSelection();
      saveState(state);
      mount();
      toast("已切换组织", currentOrg().name);
    });

    document.querySelector(".js-dismiss-banner")?.addEventListener("click", () => {
      if (!state.dismissedBanners.includes(ALERT_BANNER_ID)) {
        state.dismissedBanners.push(ALERT_BANNER_ID);
        saveState(state);
      }
      mount();
    });

    document.getElementById("batch-approve-btn")?.addEventListener("click", () => {
      const n = selectedRowKeys.size;
      if (!n) return;
      pushLog(`[批量审核] 已模拟通过 ${n} 条选中单据（${currentOrg().name}）`);
      toast("批量审核完成", `共 ${n} 条（演示）`);
      clearSelection();
      mount();
    });

    $app.querySelectorAll(".js-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(btn.getAttribute("data-route"));
        mount();
      });
    });

    document.getElementById("btn-notif")?.addEventListener("click", (e) => {
      e.stopPropagation();
      notifOpen = !notifOpen;
      const pop = document.getElementById("notif-pop");
      const b = document.getElementById("btn-notif");
      pop?.classList.toggle("is-open", notifOpen);
      pop?.setAttribute("aria-hidden", String(!notifOpen));
      b?.setAttribute("aria-expanded", String(notifOpen));
    });

    $app.querySelectorAll(".js-notif-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-notif-id");
        markNotifRead(id);
        btn.classList.add("is-read");
        const badge = document.getElementById("notif-badge");
        const n = unreadNotifCount();
        if (badge) {
          badge.textContent = n > 0 ? String(n) : "";
          badge.classList.toggle("is-on", n > 0);
        }
      });
    });

    document.getElementById("open-palette")?.addEventListener("click", openPalette);
    document.getElementById("btn-help")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openHelpModal();
    });

    $app.querySelectorAll(".js-theme-toggle").forEach((b) =>
      b.addEventListener("click", () => {
        state.theme = state.theme === "dark" ? "light" : "dark";
        saveState(state);
        mount();
        toast("主题已更新", state.theme === "dark" ? "深色" : "浅色");
      })
    );

    document.querySelector(".js-reset")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = {
        theme: "dark",
        route: "overview",
        log: [],
        favorites: [],
        notifReadIds: [],
        orgId: "hq",
        dismissedBanners: [],
        sortByRoute: {},
        tableDensity: "comfortable",
        recentRoutes: [],
        hiddenColsByRoute: {},
      };
      tableFilter = "";
      tablePage = 0;
      notifOpen = false;
      clearSelection();
      mount();
      toast("已重置", "本地演示数据已清除");
    });

    document.querySelector(".js-export-log")?.addEventListener("click", () => {
      exportLogTxt();
    });

    $app.querySelectorAll(".js-sim").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.getAttribute("data-kind");
        const route = currentRoute().label;
        if (kind === "approve") {
          pushLog(`[${route}] 模拟审核：已通过 3 条相关单据`);
          toast("模拟审核完成", "已写入动态与本地日志");
        } else if (kind === "sync") {
          pushLog(`[${route}] 模拟同步：接口队列已清空（演示）`);
          toast("同步完成", "MES / 中间件为占位逻辑");
        }
        mount();
      });
    });

    document.querySelector(".js-export-table")?.addEventListener("click", () => {
      exportTableCsv();
    });

    document.querySelectorAll(".js-density").forEach((b) => {
      b.addEventListener("click", () => {
        const d = b.getAttribute("data-density");
        state.tableDensity = d === "compact" ? "compact" : "comfortable";
        saveState(state);
        mount();
        toast("表格密度", state.tableDensity === "compact" ? "紧凑" : "舒适");
      });
    });

    document.querySelector(".js-sort-clear")?.addEventListener("click", () => {
      const rid = tableDataRouteId();
      if (state.sortByRoute[rid]) delete state.sortByRoute[rid];
      saveState(state);
      tablePage = 0;
      clearSelection();
      replaceTableOnly();
      toast("已清除排序", "恢复默认顺序");
    });

    document.getElementById("col-vis-details")?.addEventListener("change", (e) => {
      const t = e.target;
      if (!t.classList.contains("js-col-vis")) return;
      const rid = tableDataRouteId();
      const col = t.getAttribute("data-col");
      const full = tableSpec(rid).keys;
      const hidden = new Set(state.hiddenColsByRoute[rid] || []);
      if (t.checked) hidden.delete(col);
      else hidden.add(col);
      const visibleCount = full.filter((k) => !hidden.has(k)).length;
      if (visibleCount === 0) {
        t.checked = true;
        hidden.delete(col);
        toast("至少保留一列", "无法全部隐藏");
        return;
      }
      state.hiddenColsByRoute[rid] = Array.from(hidden);
      if (state.hiddenColsByRoute[rid].length === 0) delete state.hiddenColsByRoute[rid];
      saveState(state);
      tablePage = 0;
      clearSelection();
      mount();
      toast("列显示已更新", "导出 CSV 将同步可见列");
    });

    document.querySelector(".js-copy-tl")?.addEventListener("click", () => {
      copyTimelineText();
    });

    document.querySelector(".js-refresh")?.addEventListener("click", () => {
      tableFilter = document.querySelector(".js-table-filter")?.value || tableFilter;
      tablePage = 0;
      clearSelection();
      mount();
      toast("数据已刷新", "使用当日种子重新生成");
    });

    document.querySelector(".js-table-filter")?.addEventListener("input", (e) => {
      tableFilter = e.target.value;
      tablePage = 0;
      clearSelection();
      replaceTableOnly();
    });

    if (paletteOpen) {
      bindPaletteInteractions();
      requestAnimationFrame(() => $paletteInput?.focus());
    }

    requestAnimationFrame(() => {
      refreshBatchUi();
      syncSelectAllCheckbox();
    });

    syncSidebarA11y();
    if (!sidebarMqWired) {
      sidebarMqWired = true;
      mqDrawerSidebar.addEventListener("change", syncSidebarA11y);
    }
  };

  const bindPaletteInteractions = () => {
    const $paletteOverlay = document.getElementById("palette-overlay");
    const $paletteInput = document.getElementById("palette-input");
    const $list = document.getElementById("palette-list");

    $paletteOverlay?.addEventListener("click", (e) => {
      if (e.target === $paletteOverlay) closePalette();
    });
    $paletteInput?.addEventListener("input", (e) => {
      paletteQuery = e.target.value;
      paletteIndex = 0;
      if ($list) $list.innerHTML = renderPaletteItems();
      wirePaletteItems();
    });
    $paletteInput?.addEventListener("keydown", onPaletteKeydown);
    wirePaletteItems();
  };

  const wirePaletteItems = () => {
    document.querySelectorAll("#palette-list .palette__item[data-route]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.route = btn.getAttribute("data-route");
        touchRecentRoute(state.route);
        tableFilter = "";
        tablePage = 0;
        clearSelection();
        saveState(state);
        closePalette();
        toast("已跳转", currentRoute().label);
      });
    });
  };

  const openPalette = () => {
    paletteOpen = true;
    paletteQuery = "";
    paletteIndex = 0;
    mount();
  };

  const closePalette = () => {
    if (!paletteOpen) return;
    paletteOpen = false;
    paletteQuery = "";
    paletteIndex = 0;
    mount();
  };

  const onPaletteKeydown = (e) => {
    const list = getPaletteFlatList();
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }
    if (!list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      paletteIndex = Math.min(paletteIndex + 1, list.length - 1);
      syncPaletteSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      paletteIndex = Math.max(paletteIndex - 1, 0);
      syncPaletteSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = list[paletteIndex];
      if (r) {
        state.route = r.id;
        tableFilter = "";
        tablePage = 0;
        clearSelection();
        touchRecentRoute(r.id);
        saveState(state);
        closePalette();
        toast("已跳转", r.label);
      }
    }
  };

  const syncPaletteSelection = () => {
    const list = getPaletteFlatList();
    if (paletteIndex >= list.length) paletteIndex = Math.max(list.length - 1, 0);
    const btns = Array.from(document.querySelectorAll("#palette-list .palette__item[data-route]"));
    btns.forEach((b, i) => b.setAttribute("aria-selected", String(i === paletteIndex)));
  };

  document.body.addEventListener("change", (e) => {
    const t = e.target;
    if (!t.closest("#main-table-wrap")) return;
    if (t.classList.contains("js-select-all")) {
      const checked = t.checked;
      const rid = tableDataRouteId();
      const rows = getFilteredTableRows(rid);
      const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
      const safePage = Math.min(tablePage, totalPages - 1);
      const start = safePage * PAGE_SIZE;
      const pageRows = rows.slice(start, start + PAGE_SIZE);
      pageRows.forEach((r) => {
        if (checked) selectedRowKeys.add(r.rowKey);
        else selectedRowKeys.delete(r.rowKey);
      });
      pageRows.forEach((r) => {
        const cb = document.querySelector(`#main-table-wrap .js-row-check[data-row-key="${r.rowKey}"]`);
        if (cb) cb.checked = checked;
      });
      refreshBatchUi();
      syncSelectAllCheckbox();
      return;
    }
    if (t.classList.contains("js-row-check")) {
      const key = t.getAttribute("data-row-key");
      if (t.checked) selectedRowKeys.add(key);
      else selectedRowKeys.delete(key);
      refreshBatchUi();
      syncSelectAllCheckbox();
    }
  });

  document.body.addEventListener("click", (e) => {
    const wrap = document.getElementById("main-table-wrap");
    if (wrap?.contains(e.target) && e.target.closest(".js-sort-col")) {
      const btn = e.target.closest(".js-sort-col");
      const col = btn.getAttribute("data-col");
      const rid = tableDataRouteId();
      const cur = state.sortByRoute[rid];
      let dir = "asc";
      if (cur && cur.key === col) dir = cur.dir === "asc" ? "desc" : "asc";
      state.sortByRoute[rid] = { key: col, dir };
      saveState(state);
      tablePage = 0;
      clearSelection();
      replaceTableOnly();
      return;
    }
    if (wrap?.contains(e.target) && e.target.closest(".js-page-prev")) {
      if (tablePage > 0) {
        tablePage--;
        replaceTableOnly();
      }
      return;
    }
    if (wrap?.contains(e.target) && e.target.closest(".js-page-next")) {
      const rid = tableDataRouteId();
      const rows = getFilteredTableRows(rid);
      const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
      if (tablePage < totalPages - 1) {
        tablePage++;
        replaceTableOnly();
      }
      return;
    }
    if (notifOpen && !e.target.closest("#notif-wrap")) {
      notifOpen = false;
      document.getElementById("notif-pop")?.classList.remove("is-open");
      document.getElementById("notif-pop")?.setAttribute("aria-hidden", "true");
      document.getElementById("btn-notif")?.setAttribute("aria-expanded", "false");
    }
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("input, .col-check, label, button")) return;
    const tr = e.target.closest("tr[data-row-key]");
    if (!tr || !document.getElementById("main-table-wrap")?.contains(tr)) return;
    const key = tr.getAttribute("data-row-key");
    const data = lastRowLookup.get(key);
    if (data) openDetailDrawer(data.routeId, data.row);
  });

  document.body.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.closest("button,a,input,textarea,select")) return;
    const tr = e.target.closest("tr[data-row-key]");
    if (!tr || !document.getElementById("main-table-wrap")?.contains(tr)) return;
    const key = tr.getAttribute("data-row-key");
    const data = lastRowLookup.get(key);
    if (data) {
      e.preventDefault();
      openDetailDrawer(data.routeId, data.row);
    }
  });

  window.addEventListener("hashchange", () => {
    const id = parseHashRoute();
    if (!id || id === state.route) return;
    state.route = id;
    touchRecentRoute(id);
    tableFilter = "";
    tablePage = 0;
    clearSelection();
    saveState(state);
    mount();
  });

  document.addEventListener("keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (paletteOpen) closePalette();
      else openPalette();
      return;
    }
    if (mod && e.key === "/") {
      e.preventDefault();
      openHelpModal();
      return;
    }
    if (e.key === "Escape") {
      if (paletteOpen) return;
      if (document.getElementById("help-modal")?.classList.contains("is-open")) {
        closeHelpModal();
        e.preventDefault();
        return;
      }
      if (document.getElementById("detail-sheet")?.classList.contains("is-open")) {
        closeDetailDrawer();
        e.preventDefault();
        return;
      }
      if (notifOpen) {
        notifOpen = false;
        document.getElementById("notif-pop")?.classList.remove("is-open");
        document.getElementById("notif-pop")?.setAttribute("aria-hidden", "true");
        document.getElementById("btn-notif")?.setAttribute("aria-expanded", "false");
        e.preventDefault();
        return;
      }
      if (sidebarOpen && mqDrawerSidebar.matches) {
        closeSidebarDrawer();
        e.preventDefault();
      }
    }
  });

  mount();
})();
