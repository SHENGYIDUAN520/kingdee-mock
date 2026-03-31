(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const state = {
    moduleKey: "inventory",
    search: "",
    log: [],
    executedCount: 0,
  };

  const MODULES = {
    dashboard: {
      label: "首页",
      desc: "企业管理系统首页，展示关键业务数据和快捷操作。",
      groups: [
        {
          title: "业务概览",
          subtitle: "关键业务指标和数据",
          tiles: [
            { label: "经营看板", type: "dashboard_business", keywords: ["经营", "看板", "指标"] },
            { label: "库存概览", type: "dashboard_inventory", keywords: ["库存", "概览", "数据"] },
            { label: "销售分析", type: "dashboard_sales", keywords: ["销售", "分析", "报表"] },
          ],
        },
        {
          title: "快捷操作",
          subtitle: "常用功能快速访问",
          tiles: [
            { label: "新建销售订单", type: "dashboard_new_sales", keywords: ["新建", "销售", "订单"] },
            { label: "新建采购订单", type: "dashboard_new_purchase", keywords: ["新建", "采购", "订单"] },
            { label: "库存查询", type: "dashboard_inventory_query", keywords: ["库存", "查询"] },
          ],
        },
      ],
    },
    customer: {
      label: "客户管理",
      desc: "客户信息管理、客户分类和客户分析。",
      groups: [
        {
          title: "客户资料",
          subtitle: "客户基本信息管理",
          tiles: [
            { label: "客户档案", type: "customer_profile", keywords: ["客户", "档案", "信息"] },
            { label: "客户分类", type: "customer_category", keywords: ["客户", "分类"] },
            { label: "客户信用管理", type: "customer_credit", keywords: ["客户", "信用", "管理"] },
          ],
        },
        {
          title: "客户分析",
          subtitle: "客户业务数据分析",
          tiles: [
            { label: "客户销售分析", type: "customer_sales_analysis", keywords: ["客户", "销售", "分析"] },
            { label: "客户回款分析", type: "customer_payment_analysis", keywords: ["客户", "回款", "分析"] },
          ],
        },
      ],
    },
    inventory: {
      label: "库存管理",
      desc: "模拟：库房日常、入库/出库/调拨、以及与 MES/EAP 的对接思路（演示用）。",
      groups: [
        {
          title: "库存日常工作",
          subtitle: "库房作业人员常用操作",
          tiles: [
            { label: "库存工作台", type: "inventory_workbench", keywords: ["工作台", "查询", "台账"] },
            { label: "暂存方案列表", type: "inventory_hold_plan", keywords: ["暂存", "方案", "列表"] },
            { label: "暂不打方案列表", type: "inventory_skip_plan", keywords: ["暂不打", "方案", "列表"] },
          ],
        },
        {
          title: "入库管理",
          subtitle: "从采购、生产、其他来源入库",
          tiles: [
            { label: "采购入库单", type: "inbound_purchase", keywords: ["采购", "入库", "单据", "审核"] },
            { label: "采购入库单列表", type: "inbound_purchase_list", keywords: ["采购", "入库", "列表"] },
            { label: "销售退货入库单", type: "inbound_sales_return", keywords: ["销售退货", "入库"] },
            { label: "生产入库单", type: "inbound_production", keywords: ["生产", "入库"] },
            { label: "生产入库单列表", type: "inbound_production_list", keywords: ["生产", "入库", "列表"] },
            { label: "其他入库单", type: "inbound_other", keywords: ["其他", "入库"] },
          ],
        },
        {
          title: "出库管理",
          subtitle: "销售、领料、其他出库",
          tiles: [
            { label: "销售出库单", type: "outbound_sales", keywords: ["销售", "出库", "审核", "出库"] },
            { label: "销售出库单列表", type: "outbound_sales_list", keywords: ["销售", "出库", "列表"] },
            { label: "其他出库单", type: "outbound_other", keywords: ["其他", "出库"] },
            { label: "生产领料出库单", type: "outbound_production_issue", keywords: ["领料", "生产", "出库"] },
            { label: "生产领料出库单列表", type: "outbound_production_issue_list", keywords: ["领料", "列表"] },
            { label: "分布式出库单", type: "outbound_distributed", keywords: ["分布式", "出库"] },
          ],
        },
        {
          title: "库存调拨",
          subtitle: "不同仓库/组织之间的调拨",
          tiles: [
            { label: "调拨出库单", type: "transfer_out", keywords: ["调拨", "出库"] },
            { label: "调拨出库单列表", type: "transfer_out_list", keywords: ["调拨", "列表"] },
            { label: "直接调拨单", type: "transfer_direct", keywords: ["直接调拨"] },
            { label: "分步调拨出库单", type: "transfer_step_out", keywords: ["分步调拨", "出库"] },
            { label: "分步调拨入库单", type: "transfer_step_in", keywords: ["分步调拨", "入库"] },
          ],
        },
        {
          title: "委托加工业务",
          subtitle: "与供应商之间的受托、委外发料",
          tiles: [
            { label: "受托加工材料入库单", type: "commission_material_in", keywords: ["委托加工", "入库"] },
            { label: "受托加工材料出库单", type: "commission_material_out", keywords: ["委托加工", "出库"] },
            { label: "委托加工材料发运单", type: "commission_material_ship", keywords: ["委托加工", "发运"] },
            { label: "受托加工材料入库单", type: "commission_material_return", keywords: ["委托加工", "入库"] },
          ],
        },
        {
          title: "生产制造对接（演示）",
          subtitle: "展示 MES/EAP 与库存的交互逻辑",
          tiles: [
            { label: "MES 报工回传对账", type: "mes_integration_check", keywords: ["MES", "报工", "对账", "回传"] },
            { label: "EAP 设备状态联动", type: "eap_integration_status", keywords: ["EAP", "设备", "状态", "采集"] },
          ],
        },
      ],
    },
    finance: {
      label: "财务会计",
      desc: "演示：凭证、应收应付与库存业务结转的思路。",
      groups: [
        {
          title: "会计处理",
          subtitle: "凭证与结转演示",
          tiles: [
            { label: "凭证管理", type: "finance_voucher", keywords: ["凭证", "审核", "结转"] },
            { label: "应收账款台账", type: "finance_ar", keywords: ["应收", "台账"] },
            { label: "应付账款台账", type: "finance_ap", keywords: ["应付", "台账"] },
          ],
        },
      ],
    },
    procurement: {
      label: "采购管理",
      desc: "演示：采购订单→采购入库→对账。",
      groups: [
        {
          title: "采购业务",
          subtitle: "订单到入库链路演示",
          tiles: [
            { label: "采购订单", type: "proc_po", keywords: ["采购", "订单"] },
            { label: "采购入库单", type: "proc_receipt", keywords: ["入库"] },
            { label: "供应商资料维护", type: "proc_vendor", keywords: ["供应商", "主数据"] },
          ],
        },
      ],
    },
    sales: {
      label: "销售管理",
      desc: "演示：销售订单→销售出库→回款。",
      groups: [
        {
          title: "销售业务",
          subtitle: "订单到出库链路演示",
          tiles: [
            { label: "销售订单", type: "sales_order", keywords: ["销售", "订单"] },
            { label: "销售出库单", type: "sales_delivery", keywords: ["出库"] },
            { label: "客户资料维护", type: "sales_customer", keywords: ["客户", "主数据"] },
          ],
        },
      ],
    },
    manufacturing: {
      label: "生产制造",
      desc: "演示：生产订单、报工、以及与库存出入库的联动。",
      groups: [
        {
          title: "生产执行",
          subtitle: "订单与报工演示",
          tiles: [
            { label: "生产订单", type: "mfg_mo", keywords: ["生产", "订单"] },
            { label: "MES 报工", type: "mfg_mes_report", keywords: ["MES", "报工"] },
            { label: "EAP 设备采集", type: "mfg_eap_collect", keywords: ["EAP", "采集"] },
          ],
        },
      ],
    },
    quality: {
      label: "质量管理",
      desc: "演示：检验计划与检验单、异常处置。",
      groups: [
        {
          title: "质检业务",
          subtitle: "检验与不良处理演示",
          tiles: [
            { label: "检验计划", type: "q_plan", keywords: ["检验", "计划"] },
            { label: "质量检验单", type: "q_inspection", keywords: ["质检", "检验单"] },
            { label: "不良品处理", type: "q_defect", keywords: ["不良", "处理"] },
          ],
        },
      ],
    },
    masterdata: {
      label: "基础数据",
      desc: "演示：物料、仓库、工序等主数据一致性检查。",
      groups: [
        {
          title: "主数据维护",
          subtitle: "一致性与编码对齐演示",
          tiles: [
            { label: "物料主数据维护", type: "md_item", keywords: ["物料", "编码", "主数据"] },
            { label: "仓库与组织维护", type: "md_wh", keywords: ["仓库", "组织"] },
            { label: "编码一致性校验", type: "md_align", keywords: ["一致性", "编码", "校验"] },
          ],
        },
      ],
    },
    cost: {
      label: "成本管理",
      desc: "演示：成本核算与结转",
      groups: [
        {
          title: "成本核算",
          subtitle: "结转演示",
          tiles: [
            { label: "成本核算", type: "cost_calc", keywords: ["成本", "核算"] },
            { label: "成本分析", type: "cost_analysis", keywords: ["成本", "分析"] },
            { label: "成本结转", type: "cost_transfer", keywords: ["成本", "结转"] },
          ],
        },
      ],
    },
    asset: {
      label: "资产管理",
      desc: "演示：资产台账与折旧",
      groups: [
        {
          title: "资产台账",
          subtitle: "维护演示",
          tiles: [
            { label: "资产台账", type: "asset_list", keywords: ["资产", "台账"] },
            { label: "资产折旧", type: "asset_depreciation", keywords: ["资产", "折旧"] },
            { label: "资产盘点", type: "asset_inventory", keywords: ["资产", "盘点"] },
          ],
        },
      ],
    },
    mgmt: {
      label: "管理会计",
      desc: "演示：报表与指标",
      groups: [
        {
          title: "经营分析",
          subtitle: "指标演示",
          tiles: [
            { label: "经营分析报表", type: "mgmt_report", keywords: ["经营", "分析"] },
            { label: "预算管理", type: "mgmt_budget", keywords: ["预算", "管理"] },
            { label: "绩效指标", type: "mgmt_kpi", keywords: ["绩效", "指标"] },
          ],
        },
      ],
    },
    supply: {
      label: "供应链",
      desc: "演示：采购与库存协同",
      groups: [
        {
          title: "供应链协同",
          subtitle: "链路演示",
          tiles: [
            { label: "供应链看板", type: "supply_board", keywords: ["看板", "供应链"] },
            { label: "供应商协同", type: "supply_vendor", keywords: ["供应商", "协同"] },
            { label: "需求计划", type: "supply_demand", keywords: ["需求", "计划"] },
          ],
        },
      ],
    },
    ecommerce: {
      label: "电商与分销",
      desc: "演示：订单同步与出库",
      groups: [
        {
          title: "订单同步",
          subtitle: "分销演示",
          tiles: [
            { label: "电商订单同步", type: "ecom_sync", keywords: ["电商", "同步"] },
            { label: "分销管理", type: "ecom_distribution", keywords: ["分销", "管理"] },
            { label: "电商库存同步", type: "ecom_inventory_sync", keywords: ["电商", "库存", "同步"] },
          ],
        },
      ],
    },
    plm: {
      label: "PLM",
      desc: "演示：BOM/工艺与变更",
      groups: [
        {
          title: "产品数据",
          subtitle: "BOM演示",
          tiles: [
            { label: "BOM 版本管理", type: "plm_bom", keywords: ["BOM", "版本"] },
            { label: "工艺路线", type: "plm_route", keywords: ["工艺", "路线"] },
            { label: "变更管理", type: "plm_change", keywords: ["变更", "管理"] },
          ],
        },
      ],
    },
    oa: {
      label: "协同办公",
      desc: "演示：流程审批与通知",
      groups: [
        {
          title: "流程审批",
          subtitle: "审批演示",
          tiles: [
            { label: "审批任务处理", type: "oa_approval", keywords: ["审批", "流程"] },
            { label: "请假申请", type: "oa_leave", keywords: ["请假", "申请"] },
            { label: "报销申请", type: "oa_expense", keywords: ["报销", "申请"] },
          ],
        },
      ],
    },
    system: {
      label: "系统设置",
      desc: "系统配置与管理",
      groups: [
        {
          title: "系统配置",
          subtitle: "系统参数设置",
          tiles: [
            { label: "用户管理", type: "system_user", keywords: ["用户", "管理"] },
            { label: "权限设置", type: "system_permission", keywords: ["权限", "设置"] },
            { label: "系统参数", type: "system_param", keywords: ["系统", "参数"] },
          ],
        },
      ],
    },
  };

  const TILES_TYPE_META = {
    inbound: { opModes: ["保存草稿", "提交审核", "执行入库"], steps: ["保存草稿", "提交审核", "执行入库", "写入库存台账"] },
    outbound: { opModes: ["保存草稿", "提交审核", "执行出库"], steps: ["保存草稿", "提交审核", "执行出库", "生成出库凭证"] },
    transfer: { opModes: ["保存草稿", "提交审核", "执行调拨"], steps: ["保存草稿", "提交审核", "执行调拨", "更新在途/库存"] },
    commission: { opModes: ["保存草稿", "提交审核", "执行委外发料"], steps: ["保存草稿", "提交审核", "执行委外发料", "回写库存/结算状态"] },
    mes: { opModes: ["保存草稿", "提交审核", "执行报工"], steps: ["保存草稿", "提交审核", "执行报工", "回传 MES 结果/产量"] },
    eap: { opModes: ["保存草稿", "提交审核", "同步设备数据"], steps: ["保存草稿", "提交审核", "同步设备数据", "刷新看板/异常告警"] },
    generic: { opModes: ["保存草稿", "提交审核", "执行"], steps: ["保存草稿", "提交审核", "执行", "生成执行记录"] },
  };

  const TILE_TYPE_TO_CATEGORY = {
    inventory_workbench: "generic",
    inventory_hold_plan: "generic",
    inventory_skip_plan: "generic",
    inbound_purchase: "inbound",
    inbound_purchase_list: "inbound",
    inbound_sales_return: "inbound",
    inbound_production: "inbound",
    inbound_production_list: "inbound",
    inbound_other: "inbound",
    outbound_sales: "outbound",
    outbound_sales_list: "outbound",
    outbound_other: "outbound",
    outbound_production_issue: "outbound",
    outbound_production_issue_list: "outbound",
    outbound_distributed: "outbound",
    transfer_out: "transfer",
    transfer_out_list: "transfer",
    transfer_direct: "transfer",
    transfer_step_out: "transfer",
    transfer_step_in: "transfer",
    commission_material_in: "commission",
    commission_material_out: "commission",
    commission_material_ship: "commission",
    commission_material_return: "commission",
    mes_integration_check: "mes",
    eap_integration_status: "eap",

    // other module sample mappings
    finance_voucher: "generic",
    finance_ar: "generic",
    finance_ap: "generic",
    proc_po: "inbound",
    proc_receipt: "inbound",
    proc_vendor: "generic",
    sales_order: "outbound",
    sales_delivery: "outbound",
    sales_customer: "generic",
    mfg_mo: "generic",
    mfg_mes_report: "mes",
    mfg_eap_collect: "eap",
    q_plan: "generic",
    q_inspection: "generic",
    q_defect: "commission",
    md_item: "generic",
    md_wh: "generic",
    md_align: "generic",
    cost_calc: "generic",
    cost_analysis: "generic",
    cost_transfer: "generic",
    asset_list: "generic",
    asset_depreciation: "generic",
    asset_inventory: "generic",
    mgmt_report: "generic",
    mgmt_budget: "generic",
    mgmt_kpi: "generic",
    supply_board: "generic",
    supply_vendor: "generic",
    supply_demand: "generic",
    ecom_sync: "generic",
    ecom_distribution: "generic",
    ecom_inventory_sync: "generic",
    plm_bom: "generic",
    plm_route: "generic",
    plm_change: "generic",
    oa_approval: "generic",
    oa_leave: "generic",
    oa_expense: "generic",
    system_user: "generic",
    system_permission: "generic",
    system_param: "generic",
    dashboard_business: "generic",
    dashboard_inventory: "generic",
    dashboard_sales: "generic",
    dashboard_new_sales: "outbound",
    dashboard_new_purchase: "inbound",
    dashboard_inventory_query: "generic",
    customer_profile: "generic",
    customer_category: "generic",
    customer_credit: "generic",
    customer_sales_analysis: "generic",
    customer_payment_analysis: "generic",
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function ts() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function dateKey() {
    const d = new Date();
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  }

  function docNo(prefix) {
    const seq = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${dateKey()}-${seq}`;
  }

  function logLine(level, msg) {
    const line = { level, msg, t: ts(), idx: state.log.length + 1 };
    state.log.push(line);
    renderLogLine(line);
    updateLogButtonsHint();
  }

  function renderLogLine(line) {
    const el = document.createElement("div");
    let cls = "log-line-info";
    if (line.level === "OK") cls = "log-line-ok";
    if (line.level === "WARN") cls = "log-line-warn";
    if (line.level === "FAIL") cls = "log-line-fail";
    el.className = cls;
    el.textContent = `${line.t}\t[${line.level}]\t${line.msg}`;
    $("#opsLog").appendChild(el);
    $("#opsLog").scrollTop = $("#opsLog").scrollHeight;
  }

  function updateLogButtonsHint() {
    // 轻量提示：不做复杂 UI
  }

  function clearLog() {
    state.log = [];
    $("#opsLog").innerHTML = "";
    logLine("INFO", "日志已清空");
  }

  function exportLog() {
    const name = `kingdee-ops-${state.moduleKey}-${new Date().toISOString().slice(0, 10)}.log`;
    const text = state.log
      .map((l) => `${l.t}\t${l.level}\t${l.msg}`)
      .join("\n");
    const blob = new Blob([text || ""], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    logLine("OK", `导出日志完成：${name}`);
  }

  async function copyLog() {
    const text = state.log.map((l) => `${l.t}\t${l.level}\t${l.msg}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      logLine("OK", "复制成功");
    } catch (e) {
      logLine("WARN", "复制失败：浏览器限制，可使用“导出”功能");
    }
  }

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function tileMatch(tile, q) {
    const query = normalize(q);
    if (!query) return true;
    const content = [tile.label, tile.type, ...(tile.keywords || [])].join(" ").toLowerCase();
    return content.includes(query);
  }

  function renderTiles() {
    const mod = MODULES[state.moduleKey];
    const tilesArea = $("#tilesArea");
    tilesArea.innerHTML = "";
    $("#breadcrumbModule").textContent = mod.label;

    const q = state.search;
    const fragment = document.createDocumentFragment();
    for (const g of mod.groups) {
      const visibleTiles = g.tiles.filter((t) => tileMatch(t, q));
      if (visibleTiles.length === 0) continue;

      const sec = document.createElement("section");
      sec.className = "group";

      const title = document.createElement("div");
      title.className = "group-title";
      title.textContent = g.title;
      const sub = document.createElement("span");
      sub.textContent = ` ${g.subtitle}`;
      title.appendChild(sub);

      const grid = document.createElement("div");
      grid.className = "tile-grid";
      for (const t of visibleTiles) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.tabIndex = 0;
        tile.dataset.label = t.label;
        tile.dataset.type = t.type;
        tile.dataset.category = TILE_TYPE_TO_CATEGORY[t.type] || "generic";
        tile.dataset.keywords = (t.keywords || []).join(",");
        tile.innerHTML = `<span>${escapeHtml(t.label)}</span>`;
        // star on some frequent items
        if (t.label === "销售出库单" || t.label === "采购入库单") {
          const star = document.createElement("span");
          star.className = "star";
          star.textContent = "★";
          tile.appendChild(star);
        }
        tile.addEventListener("click", () => openModalForTile(t));
        tile.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") openModalForTile(t);
        });
        grid.appendChild(tile);
      }

      sec.appendChild(title);
      sec.appendChild(grid);
      fragment.appendChild(sec);
    }

    if (!tilesArea.firstChild && !fragment.firstChild) {
      const empty = document.createElement("div");
      empty.className = "group";
      empty.innerHTML = `<div class="group-title">无匹配卡片 <span>试试其他关键词</span></div>`;
      tilesArea.appendChild(empty);
      return;
    }

    tilesArea.appendChild(fragment);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // modal logic
  const modalOverlay = $("#modalOverlay");
  const modalTitle = $("#modalTitle");
  const modalSub = $("#modalSub");
  const opModeSel = $("#opMode");
  const formFieldsEl = $("#formFields");
  const btnExecute = $("#btnExecute");
  const btnCancel = $("#btnCancel");
  const btnModalClose = $("#btnModalClose");

  let modalTile = null;

  function setModalOpen(open) {
    if (open) {
      modalOverlay.classList.remove("hidden");
      modalOverlay.setAttribute("aria-hidden", "false");
    } else {
      modalOverlay.classList.add("hidden");
      modalOverlay.setAttribute("aria-hidden", "true");
    }
  }

  function renderFormFieldsForType(type, category) {
    const prefix =
      category === "inbound"
        ? "IN"
        : category === "outbound"
          ? "OUT"
          : category === "transfer"
            ? "TR"
            : category === "commission"
              ? "COM"
              : category === "mes"
                ? "MO"
                : category === "eap"
                  ? "EAP"
                  : "OPS";

    const doc = docNo(prefix);

    // 不同类别准备默认明细行（可编辑）
    const presets =
      category === "inbound"
        ? [
            { mat: "MAT-ERP-01", batch: "20260331A", qty: 10, price: 12.5, uom: "件" },
            { mat: "MAT-ERP-02", batch: "20260331B", qty: 8, price: 10.0, uom: "件" },
            { mat: "MAT-ERP-03", batch: "20260331A", qty: 5, price: 18.2, uom: "件" },
          ]
        : category === "outbound"
          ? [
              { mat: "MAT-ERP-01", batch: "20260331A", qty: 7, price: 12.5, uom: "件" },
              { mat: "MAT-ERP-04", batch: "20260331C", qty: 12, price: 9.8, uom: "件" },
              { mat: "MAT-ERP-02", batch: "20260331B", qty: 3, price: 10.0, uom: "件" },
            ]
          : category === "transfer"
            ? [
                { mat: "MAT-ERP-02", batch: "20260331B", qty: 15, price: 10.0, uom: "件" },
                { mat: "MAT-ERP-05", batch: "20260331D", qty: 6, price: 14.2, uom: "件" },
                { mat: "MAT-ERP-01", batch: "20260331A", qty: 4, price: 12.5, uom: "件" },
              ]
            : category === "commission"
              ? [
                  { mat: "MAT-ERP-06", batch: "20260331X", qty: 9, price: 21.3, uom: "件" },
                  { mat: "MAT-ERP-07", batch: "20260331Y", qty: 6, price: 16.1, uom: "件" },
                  { mat: "MAT-ERP-02", batch: "20260331B", qty: 5, price: 10.0, uom: "件" },
                ]
              : category === "mes"
                ? [
                    { mat: "FG-ASSY-01", batch: "MO-20260331-001", qty: 120, price: 0.8, uom: "件" },
                    { mat: "FG-ASSY-02", batch: "MO-20260331-001", qty: 48, price: 0.9, uom: "件" },
                    { mat: "FG-ASSY-01", batch: "MO-20260331-001", qty: 10, price: 0.8, uom: "件" },
                  ]
                : category === "eap"
                  ? [
                      { mat: "设备产量采集", batch: "CNC-01", qty: 320, price: 0.1, uom: "点" },
                      { mat: "设备停机统计", batch: "CNC-01", qty: 6, price: 0.0, uom: "次" },
                      { mat: "设备报警事件", batch: "CNC-01", qty: 1, price: 0.0, uom: "次" },
                    ]
                  : [
                      { mat: "MAT-ERP-01", batch: "20260331A", qty: 10, price: 12.5, uom: "件" },
                      { mat: "MAT-ERP-02", batch: "20260331B", qty: 8, price: 10.0, uom: "件" },
                      { mat: "MAT-ERP-03", batch: "20260331A", qty: 5, price: 18.2, uom: "件" },
                    ];

    formFieldsEl.innerHTML = `
      <div class="doc-shell">
        <div class="doc-topline">
          <div class="doc-status" id="docStatus">
            <span class="s-dot"></span>
            <span>草稿（模拟）</span>
          </div>
          <div class="doc-meta-right">
            <div style="font-size:12px;color:rgba(255,255,255,0.65);text-align:right;">单据号</div>
            <div style="font-size:14px;font-weight:800;">${escapeHtml(doc)}</div>
          </div>
          <div style="display:none;">
            <input id="docNoInput" value="${escapeHtml(doc)}" readonly />
          </div>
        </div>

        <div class="doc-grid">
          <div class="doc-item">
            <div class="k">目标/设备</div>
            <div class="v">
              <select id="targetSelect" class="line-input" style="padding:7px 10px;">
                <option value="CK01">仓库：CK01（原材料）</option>
                <option value="CK02">仓库：CK02（成品仓）</option>
                <option value="LINE-A">产线：LINE-A</option>
                <option value="CNC-01">设备：CNC-01</option>
              </select>
            </div>
          </div>
          <div class="doc-item">
            <div class="k">${category === "mes" ? "工单号" : category === "eap" ? "同步来源" : "摘要"}</div>
            <div class="v">
              ${
                category === "mes"
                  ? `<input id="moInput" class="line-input" value="MO-20260331-001" />`
                  : category === "eap"
                    ? `<input id="syncFromInput" class="line-input" value="EAP-KP-01" />`
                    : `<input id="summaryInput" class="line-input" placeholder="例如：摘要/用途/异常说明" />`
              }
            </div>
          </div>
          ${
            category === "eap"
              ? `<div class="doc-item" style="grid-column:1 / -1;">
                    <div class="k">同步策略</div>
                    <div class="v">
                      <select id="syncModeSelect" class="line-input" style="padding:7px 10px;">
                        <option value="delta">增量（推荐）</option>
                        <option value="full">全量（风险大）</option>
                      </select>
                    </div>
                  </div>`
              : ""
          }
        </div>

        <div class="lines-title">明细行（可编辑数量/价格）</div>
        <table class="lines-table" role="table" aria-label="lines table">
          <thead>
            <tr>
              <th style="width:22%;">物料</th>
              <th style="width:18%;">批次/工单</th>
              <th style="width:14%;">数量</th>
              <th style="width:10%;">单位</th>
              <th style="width:16%;">单价</th>
              <th style="width:20%;">金额</th>
            </tr>
          </thead>
          <tbody id="linesTbody">
            ${presets
              .map(
                (r, i) => `
              <tr class="line-row" data-i="${i}">
                <td><input class="line-input line-mat" value="${escapeHtml(r.mat)}" /></td>
                <td><input class="line-input line-batch" value="${escapeHtml(r.batch)}" /></td>
                <td><input class="line-input line-qty" type="number" min="0" step="1" value="${r.qty}" /></td>
                <td><span style="display:inline-block;padding:7px 0;color:rgba(255,255,255,0.85);font-size:13px;">${escapeHtml(r.uom)}</span></td>
                <td><input class="line-input line-price" type="number" min="0" step="0.01" value="${r.price}" /></td>
                <td><span class="line-amt" style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${(r.qty * r.price).toFixed(
                  2
                )}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="lines-foot">
          <div class="total-pill">合计数量：<span id="totalQty">0</span></div>
          <div class="total-pill">合计金额：<span id="totalAmt">0.00</span></div>
          <div style="display:flex;align-items:center;gap:10px;margin-left:auto;">
            ${
              category === "eap"
                ? ""
                : `<span style="color:rgba(255,255,255,0.65);font-size:12px;">备注</span><input id="remarkInput" class="line-input" style="min-width:200px;" placeholder="例如：批次/工单/异常说明" />`
            }
          </div>
        </div>
      </div>
    `;

    // 计算金额/合计
    const tbody = $("#linesTbody");
    const rows = $$(".line-row");

    function computeRowAmount(rowEl) {
      const qtyEl = rowEl.querySelector(".line-qty");
      const priceEl = rowEl.querySelector(".line-price");
      const amtEl = rowEl.querySelector(".line-amt");
      const qty = Number(qtyEl && qtyEl.value !== "" ? qtyEl.value : 0);
      const price = Number(priceEl && priceEl.value !== "" ? priceEl.value : 0);
      const amt = qty * price;
      if (amtEl) amtEl.textContent = amt.toFixed(2);
      return amt;
    }

    function computeTotals() {
      let totalQty = 0;
      let totalAmt = 0;
      for (const rowEl of rows) {
        const qtyEl = rowEl.querySelector(".line-qty");
        const amtEl = rowEl.querySelector(".line-amt");
        const qty = Number(qtyEl && qtyEl.value !== "" ? qtyEl.value : 0);
        const amt = Number(amtEl ? amtEl.textContent : 0);
        totalQty += qty;
        totalAmt += amt;
      }
      $("#totalQty").textContent = String(totalQty);
      $("#totalAmt").textContent = totalAmt.toFixed(2);
    }

    // 初次计算
    for (const rowEl of rows) computeRowAmount(rowEl);
    computeTotals();

    tbody.addEventListener("input", (e) => {
      const rowEl = e.target.closest(".line-row");
      if (!rowEl) return;
      computeRowAmount(rowEl);
      computeTotals();
    });
  }

  function renderOpModes(category) {
    const meta = TILES_TYPE_META[category] || TILES_TYPE_META.generic;
    opModeSel.innerHTML = "";
    for (const m of meta.opModes) {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      opModeSel.appendChild(opt);
    }
    opModeSel.value = meta.opModes[meta.opModes.length - 1];
  }

  function openModalForTile(tile) {
    modalTile = tile;
    const category = TILE_TYPE_TO_CATEGORY[tile.type] || "generic";
    modalTitle.textContent = tile.label;
    modalSub.textContent = `模拟入口：类型=${tile.type} · 类别=${category}（执行后生成日志）`;

    renderOpModes(category);
    renderFormFieldsForType(tile.type, category);

    btnExecute.disabled = false;
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    modalTile = null;
    // 不清空日志
  }

  // 新建单据功能
  function openCreateDocModal() {
    const modal = document.getElementById('createDocModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      // 设置默认日期为今天
      const today = new Date().toISOString().split('T')[0];
      const docDate = document.getElementById('docDate');
      if (docDate) {
        docDate.value = today;
      }
      // 生成默认单据编号
      const docNumber = document.getElementById('docNumber');
      if (docNumber) {
        const moduleName = state.moduleKey === 'inventory' ? 'RK' : 
                         state.moduleKey === 'sales' ? 'XS' : 
                         state.moduleKey === 'procurement' ? 'CG' : 'DJ';
        const dateStr = today.replace(/-/g, '');
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        docNumber.value = `${moduleName}${dateStr}${randomNum}`;
      }
    }
  }

  function closeCreateDocModal() {
    const modal = document.getElementById('createDocModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function addDocItem() {
    const docItems = document.getElementById('docItems');
    if (docItems) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" class="line-input" placeholder="商品编码" required></td>
        <td><input type="text" class="line-input" placeholder="商品名称" required></td>
        <td><input type="text" class="line-input" placeholder="规格型号"></td>
        <td><input type="number" class="line-input" placeholder="数量" step="0.01" min="0" required></td>
        <td><input type="number" class="line-input" placeholder="单价" step="0.01" min="0" required></td>
        <td><input type="number" class="line-input" placeholder="金额" step="0.01" min="0" readonly></td>
        <td><button type="button" class="small-btn danger">删除</button></td>
      `;
      docItems.appendChild(newRow);
      // 添加删除按钮事件
      addDeleteItemEvents();
      // 添加计算金额事件
      addCalculateAmountEvents();
    }
  }

  function addDeleteItemEvents() {
    const deleteButtons = document.querySelectorAll('#docItems .small-btn.danger');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        if (row) {
          row.remove();
        }
      });
    });
  }

  function addCalculateAmountEvents() {
    const quantityInputs = document.querySelectorAll('#docItems input[placeholder="数量"]');
    const priceInputs = document.querySelectorAll('#docItems input[placeholder="单价"]');
    
    function calculateAmount(row) {
      const quantityInput = row.querySelector('input[placeholder="数量"]');
      const priceInput = row.querySelector('input[placeholder="单价"]');
      const amountInput = row.querySelector('input[placeholder="金额"]');
      
      if (quantityInput && priceInput && amountInput) {
        const quantity = parseFloat(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const amount = quantity * price;
        amountInput.value = amount.toFixed(2);
      }
    }
    
    quantityInputs.forEach(input => {
      input.addEventListener('input', function() {
        const row = this.closest('tr');
        calculateAmount(row);
      });
    });
    
    priceInputs.forEach(input => {
      input.addEventListener('input', function() {
        const row = this.closest('tr');
        calculateAmount(row);
      });
    });
  }

  function submitCreateDoc() {
    // 表单验证
    const docType = document.getElementById('docType');
    const docDate = document.getElementById('docDate');
    const docNumber = document.getElementById('docNumber');
    const warehouse = document.getElementById('warehouse');
    const docItems = document.getElementById('docItems');
    
    if (!docType.value) {
      alert('请选择单据类型');
      docType.focus();
      return;
    }
    
    if (!docDate.value) {
      alert('请选择单据日期');
      docDate.focus();
      return;
    }
    
    if (!docNumber.value) {
      alert('请输入单据编号');
      docNumber.focus();
      return;
    }
    
    if (!warehouse.value) {
      alert('请选择仓库');
      warehouse.focus();
      return;
    }
    
    // 验证商品明细
    const itemRows = docItems.querySelectorAll('tr');
    if (itemRows.length === 0) {
      alert('请添加商品明细');
      return;
    }
    
    let hasValidItems = false;
    itemRows.forEach(row => {
      const codeInput = row.querySelector('input[placeholder="商品编码"]');
      const nameInput = row.querySelector('input[placeholder="商品名称"]');
      const quantityInput = row.querySelector('input[placeholder="数量"]');
      const priceInput = row.querySelector('input[placeholder="单价"]');
      
      if (codeInput.value && nameInput.value && quantityInput.value && priceInput.value) {
        hasValidItems = true;
      }
    });
    
    if (!hasValidItems) {
      alert('请填写完整的商品明细');
      return;
    }
    
    // 提交确认
    if (confirm('确定要提交单据吗？')) {
      // 模拟提交成功
      logLine('OK', `新建${docType.options[docType.selectedIndex].text}成功：${docNumber.value}`);
      closeCreateDocModal();
      
      // 显示成功提示
      alert('单据提交成功！');
    }
  }

  // 导入功能
  function openImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      // 重置表单
      document.getElementById('importType').value = '';
      document.getElementById('importFile').value = '';
      document.getElementById('fileInfo').textContent = '未选择文件';
      document.getElementById('overrideData').checked = false;
      document.getElementById('validateData').checked = true;
      document.getElementById('importPreview').innerHTML = '<div class="preview-placeholder">上传文件后将显示数据预览</div>';
    }
  }

  function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const fileInfo = document.getElementById('fileInfo');
      if (fileInfo) {
        fileInfo.textContent = file.name;
      }
      
      // 模拟文件预览
      const importPreview = document.getElementById('importPreview');
      if (importPreview) {
        importPreview.innerHTML = `
          <div class="preview-content">
            <h4>文件预览</h4>
            <p>文件名：${file.name}</p>
            <p>文件大小：${(file.size / 1024).toFixed(2)} KB</p>
            <p>文件类型：${file.type}</p>
            <div class="preview-table">
              <table class="lines-table">
                <thead>
                  <tr>
                    <th>编码</th>
                    <th>名称</th>
                    <th>规格</th>
                    <th>数量</th>
                    <th>单价</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td>商品1</td>
                    <td>标准</td>
                    <td>100</td>
                    <td>10.00</td>
                  </tr>
                  <tr>
                    <td>002</td>
                    <td>商品2</td>
                    <td>豪华</td>
                    <td>50</td>
                    <td>20.00</td>
                  </tr>
                  <tr>
                    <td>003</td>
                    <td>商品3</td>
                    <td>经济</td>
                    <td>200</td>
                    <td>5.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
    }
  }

  function submitImport() {
    const importType = document.getElementById('importType');
    const importFile = document.getElementById('importFile');
    
    if (!importType.value) {
      alert('请选择导入类型');
      importType.focus();
      return;
    }
    
    if (!importFile.files.length) {
      alert('请选择要导入的文件');
      importFile.focus();
      return;
    }
    
    // 模拟导入过程
    logLine('INFO', `开始导入${importType.options[importType.selectedIndex].text}`);
    
    // 模拟导入成功
    setTimeout(() => {
      logLine('OK', `导入${importType.options[importType.selectedIndex].text}成功，共导入3条记录`);
      closeImportModal();
      alert('导入成功！');
    }, 1500);
  }

  // 导出功能
  function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      // 重置表单
      document.getElementById('exportType').value = '';
      document.getElementById('exportFormat').value = '';
      document.querySelector('input[name="exportRange"][value="all"]').checked = true;
      document.querySelectorAll('input[name="exportField"]').forEach(checkbox => {
        checkbox.checked = true;
      });
      // 生成默认文件名
      const today = new Date().toISOString().split('T')[0];
      const exportFilename = document.getElementById('exportFilename');
      if (exportFilename) {
        exportFilename.value = `${state.moduleKey}_export_${today}`;
      }
    }
  }

  function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function submitExport() {
    const exportType = document.getElementById('exportType');
    const exportFormat = document.getElementById('exportFormat');
    const exportFilename = document.getElementById('exportFilename');
    
    if (!exportType.value) {
      alert('请选择导出类型');
      exportType.focus();
      return;
    }
    
    if (!exportFormat.value) {
      alert('请选择文件格式');
      exportFormat.focus();
      return;
    }
    
    if (!exportFilename.value) {
      alert('请输入文件名');
      exportFilename.focus();
      return;
    }
    
    // 获取选中的导出字段
    const selectedFields = [];
    document.querySelectorAll('input[name="exportField"]:checked').forEach(checkbox => {
      selectedFields.push(checkbox.value);
    });
    
    if (selectedFields.length === 0) {
      alert('请至少选择一个导出字段');
      return;
    }
    
    // 获取导出范围
    const exportRange = document.querySelector('input[name="exportRange"]:checked').value;
    
    // 模拟导出过程
    logLine('INFO', `开始导出${exportType.options[exportType.selectedIndex].text}，格式：${exportFormat.options[exportFormat.selectedIndex].text}`);
    
    // 模拟导出成功
    setTimeout(() => {
      logLine('OK', `导出${exportType.options[exportType.selectedIndex].text}成功，文件：${exportFilename.value}.${exportFormat.value}`);
      closeExportModal();
      alert('导出成功！文件已下载。');
    }, 1500);
  }

  function readModalForm() {
    const category = TILE_TYPE_TO_CATEGORY[modalTile.type] || "generic";
    const opMode = opModeSel.value;
    const docNoValue = $("#docNoInput") ? $("#docNoInput").value : "OPS-" + dateKey();
    const target = $("#targetSelect") ? $("#targetSelect").value : "-";
    const remark = $("#remarkInput") ? $("#remarkInput").value : "";
    const syncMode = $("#syncModeSelect") ? $("#syncModeSelect").value : undefined;
    const mo = $("#moInput") ? $("#moInput").value : undefined;

    const rows = $$(".line-row");
    const qty = rows.reduce((sum, r) => {
      const el = r.querySelector(".line-qty");
      const v = Number(el && el.value !== "" ? el.value : 0);
      return sum + v;
    }, 0);

    const totalAmt = rows.reduce((sum, r) => {
      const el = r.querySelector(".line-amt");
      const v = Number(el ? el.textContent : 0);
      return sum + v;
    }, 0);

    const lineCount = rows.length;
    const firstMat = rows[0] ? rows[0].querySelector(".line-mat")?.value : undefined;
    const material = firstMat || "-";

    return { category, opMode, docNo: docNoValue, target, material, qty, totalAmt, lineCount, remark, syncMode, mo };
  }

  function runSimulatedExecution(payload) {
    const categoryMeta = TILES_TYPE_META[payload.category] || TILES_TYPE_META.generic;
    const steps = categoryMeta.steps;

    // 根据操作方式决定“执行到哪一步”
    const opIdx = steps.findIndex((s) => s === payload.opMode) >= 0 ? steps.indexOf(payload.opMode) : steps.length - 1;

    const simulateLevels = (s, idx) => {
      if (payload.category === "eap" && s.includes("同步") && payload.syncMode === "full") return "WARN";
      if (s.includes("审核") && payload.opMode === "提交审核" && idx === opIdx) return "INFO";
      return "OK";
    };

    const lines = [];
    for (let i = 0; i <= opIdx; i++) {
      const s = steps[i];
      if (s === "保存草稿") {
        lines.push({
          level: "OK",
          msg: `${payload.docNo} 保存草稿成功：明细行=${payload.lineCount}，合计数量=${payload.qty}，合计金额=${payload.totalAmt.toFixed(2)}（目标/设备=${payload.target}）`,
        });
      } else if (s === "提交审核") {
        lines.push({ level: "OK", msg: `${payload.docNo} 提交审核：审批流触发（备注=${payload.remark || "-" }）` });
      } else if (s.includes("执行入库") || s.includes("执行出库")) {
        lines.push({
          level: "OK",
          msg: `${payload.docNo} ${s}完成：写入库存台账/出入库明细已落库（合计金额=${payload.totalAmt.toFixed(2)}）`,
        });
      } else if (s.includes("执行调拨")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 调拨执行成功：在途单已更新（目标=${payload.target}，明细行=${payload.lineCount}）` });
      } else if (s.includes("执行委外发料")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 委外发料执行完成：供应商端状态=已下发（合计数量=${payload.qty}）` });
      } else if (s.includes("执行报工")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 报工执行成功：工单=${payload.mo || "-"} 产量=${payload.qty}（明细行=${payload.lineCount}）` });
      } else if (s.includes("同步设备数据")) {
        const mode = payload.syncMode || "delta";
        lines.push({ level: mode === "full" ? "WARN" : "OK", msg: `${payload.docNo} 设备同步完成（策略=${mode}，设备=${payload.target}）` });
      } else if (s.includes("写入库存台账")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 写入库存台账：台账版本已更新（合计数量=${payload.qty}）` });
      } else if (s.includes("生成出库凭证")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 生成出库凭证：凭证号=AR-${Math.floor(1000 + Math.random() * 9000)}` });
      } else if (s.includes("回写库存/结算状态")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 回写结算状态：待结算=已标记（合计金额=${payload.totalAmt.toFixed(2)}）` });
      } else if (s.includes("回传 MES 结果/产量")) {
        lines.push({ level: "OK", msg: `${payload.docNo} 回传结果：MES→库存看板刷新成功（产量=${payload.qty}）` });
      } else {
        // fallback: generic step message
        lines.push({ level: simulateLevels(s, i), msg: `${payload.docNo} ${s}完成（target=${payload.target}，qty=${payload.qty}）` });
      }
    }

    // 在最后补一个“对账/校验”类日志增强真实感
    lines.push({
      level: payload.category === "eap" ? "OK" : "INFO",
      msg: `校验：接口幂等=OK；主数据一致性=通过（物料/编码=${payload.material}）`,
    });

    return lines;
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function executeModal() {
    if (!modalTile) return;
    
    try {
      const payload = readModalForm();
      const startMode = payload.opMode;

      // 验证数据
      if (payload.qty <= 0) {
        logLine("WARN", `执行失败：数量必须大于0`);
        return;
      }

      btnExecute.disabled = true;
      logLine("INFO", `开始执行（模拟）：${modalTile.label} · 操作方式=${startMode}`);

      const lines = runSimulatedExecution(payload);
      // 分段输出，更像“操作过程”
      for (let i = 0; i < lines.length; i++) {
        await delay(220 + Math.floor(Math.random() * 220));
        logLine(lines[i].level, lines[i].msg);
      }

      state.executedCount += 1;
      logLine("OK", `执行完成：${modalTile.label}（总执行次数=${state.executedCount}）`);
    } catch (error) {
      logLine("FAIL", `执行失败：${error.message || "未知错误"}`);
    } finally {
      btnExecute.disabled = false;
      closeModal();
    }
  }

  function wireEvents() {
    // 移动端菜单按钮点击事件
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
      
      // 点击侧边栏外部关闭侧边栏
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target) && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
    
    // sidebar
    $$(".side-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const key = item.dataset.module;
        if (!key) return;
        
        // 检查模块是否存在
        if (!MODULES[key]) {
          logLine("WARN", `模块不存在：${key}`);
          return;
        }
        
        state.moduleKey = key;
        
        // 重置所有菜单项的激活状态
        $$(".side-item").forEach((x) => x.classList.remove("active"));
        
        // 激活当前点击的菜单项
        item.classList.add("active");
        
        // 在移动设备上点击菜单项后关闭侧边栏
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('mobile-open');
        }
        
        syncHeader();
        renderTiles();

        const mod = MODULES[state.moduleKey];
        logLine("INFO", `切换模块：${mod ? mod.label : key}`);
      });
    });
    
    // 页面操作按钮事件
    const createDocBtn = document.querySelector('.page-actions .btn.primary');
    const importBtn = document.querySelectorAll('.page-actions .btn')[1];
    const exportBtn = document.querySelectorAll('.page-actions .btn')[2];
    
    if (createDocBtn) {
      createDocBtn.addEventListener('click', openCreateDocModal);
    }
    
    if (importBtn) {
      importBtn.addEventListener('click', openImportModal);
    }
    
    if (exportBtn) {
      exportBtn.addEventListener('click', openExportModal);
    }
    
    // 新建单据模态框事件
    const createDocModal = document.getElementById('createDocModal');
    const btnCreateDocClose = document.getElementById('btnCreateDocClose');
    const btnCreateDocCancel = document.getElementById('btnCreateDocCancel');
    const btnCreateDocSubmit = document.getElementById('btnCreateDocSubmit');
    const addItemBtn = document.getElementById('addItemBtn');
    
    if (btnCreateDocClose) {
      btnCreateDocClose.addEventListener('click', closeCreateDocModal);
    }
    
    if (btnCreateDocCancel) {
      btnCreateDocCancel.addEventListener('click', closeCreateDocModal);
    }
    
    if (btnCreateDocSubmit) {
      btnCreateDocSubmit.addEventListener('click', submitCreateDoc);
    }
    
    if (addItemBtn) {
      addItemBtn.addEventListener('click', addDocItem);
    }
    
    // 导入模态框事件
    const importModal = document.getElementById('importModal');
    const btnImportClose = document.getElementById('btnImportClose');
    const btnImportCancel = document.getElementById('btnImportCancel');
    const btnImportSubmit = document.getElementById('btnImportSubmit');
    const importFile = document.getElementById('importFile');
    
    if (btnImportClose) {
      btnImportClose.addEventListener('click', closeImportModal);
    }
    
    if (btnImportCancel) {
      btnImportCancel.addEventListener('click', closeImportModal);
    }
    
    if (btnImportSubmit) {
      btnImportSubmit.addEventListener('click', submitImport);
    }
    
    if (importFile) {
      importFile.addEventListener('change', handleFileUpload);
    }
    
    // 导出模态框事件
    const exportModal = document.getElementById('exportModal');
    const btnExportClose = document.getElementById('btnExportClose');
    const btnExportCancel = document.getElementById('btnExportCancel');
    const btnExportSubmit = document.getElementById('btnExportSubmit');
    
    if (btnExportClose) {
      btnExportClose.addEventListener('click', closeExportModal);
    }
    
    if (btnExportCancel) {
      btnExportCancel.addEventListener('click', closeExportModal);
    }
    
    if (btnExportSubmit) {
      btnExportSubmit.addEventListener('click', submitExport);
    }
    
    // 为现有商品行添加删除按钮事件
    addDeleteItemEvents();
    
    // 为数量和单价输入框添加计算金额事件
    addCalculateAmountEvents();
    
    // 初始化时激活库存管理
    const inventoryItem = $(".side-item[data-module='inventory']");
    if (inventoryItem) {
      inventoryItem.classList.add("active");
    }
    
    // 快速发起卡片点击事件
    $$(".quick-action-card").forEach((card) => {
      card.addEventListener("click", () => {
        const title = card.querySelector(".title").textContent;
        logLine("INFO", `点击快速发起：${title}`);
        
        // 根据卡片标题打开对应的功能
        let tileType = "generic";
        if (title.includes("入库")) tileType = "inbound_other";
        if (title.includes("出库")) tileType = "outbound_other";
        if (title.includes("移仓")) tileType = "transfer_direct";
        if (title.includes("调拨")) tileType = "transfer_out";
        
        // 模拟点击对应的功能卡片
        const tile = { label: title, type: tileType };
        openModalForTile(tile);
      });
    });
    
    // 待办事项卡片点击事件
    $$(".todo-card").forEach((card) => {
      card.addEventListener("click", () => {
        const title = card.querySelector(".todo-title").textContent;
        const countEl = card.querySelector(".todo-count");
        const currentCount = parseInt(countEl.textContent) || 0;
        
        // 模拟标记为已完成，将数量设置为0
        if (currentCount > 0) {
          countEl.textContent = "0";
          logLine("OK", `待办事项已完成：${title}`);
        } else {
          // 模拟重新打开待办事项
          countEl.textContent = "1";
          logLine("INFO", `待办事项已打开：${title}`);
        }
      });
    });
    
    // 实时数据卡片点击事件
    $$(".data-card").forEach((card) => {
      card.addEventListener("click", () => {
        const label = card.querySelector(".data-label").textContent;
        const value = card.querySelector(".data-value")?.textContent || card.querySelector(".data-action").textContent;
        
        // 模拟查看详细数据
        if (label === "经营日报") {
          logLine("INFO", `查看经营日报详情`);
          // 可以在这里添加打开详情页面的逻辑
        } else {
          // 模拟刷新数据
          const randomValue = (Math.random() * 1000).toFixed(2);
          const valueEl = card.querySelector(".data-value");
          if (valueEl) {
            valueEl.textContent = randomValue;
          }
          logLine("OK", `刷新实时数据：${label} = ${randomValue}`);
        }
      });
    });
    
    // 标签页切换事件
    $$(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        $$("button", parent).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        
        const tabName = btn.textContent;
        logLine("INFO", `切换标签页：${tabName}`);
      });
    });

    // search
    const searchInput = $("#searchInput");
    const searchDropdown = $("#searchDropdown");
    
    // 生成搜索结果
    function generateSearchResults(query) {
      const results = [];
      const seenLabels = new Set(); // 用于去重
      if (!query || query.trim() === "") {
        return results;
      }
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // 遍历所有模块和功能
      for (const [moduleKey, module] of Object.entries(MODULES)) {
        for (const group of module.groups) {
          for (const tile of group.tiles) {
            const tileContent = (tile.label + " " + (tile.keywords || []).join(" ")).toLowerCase();
            if (tileContent.includes(normalizedQuery) && !seenLabels.has(tile.label)) {
              seenLabels.add(tile.label);
              results.push({
                label: tile.label,
                module: module.label,
                moduleKey: moduleKey,
                tileType: tile.type
              });
            }
          }
        }
      }
      
      return results;
    }
    
    // 渲染搜索下拉菜单
    function renderSearchDropdown(results) {
      if (!results || results.length === 0) {
        searchDropdown.classList.add("hidden");
        return;
      }
      
      searchDropdown.innerHTML = "";
      
      results.forEach((result) => {
        const item = document.createElement("div");
        item.className = "search-dropdown-item";
        item.innerHTML = `
          <span>${result.label}</span>
          <span class="module">${result.module}</span>
        `;
        item.addEventListener("click", () => {
          // 切换到对应的模块
          state.moduleKey = result.moduleKey;
          
          // 重置所有菜单项的激活状态
          $$(".side-item").forEach((x) => x.classList.remove("active"));
          
          // 激活对应的菜单项
          const targetItem = $(`.side-item[data-module="${result.moduleKey}"]`);
          if (targetItem) {
            targetItem.classList.add("active");
            
            // 如果是子菜单项，激活父菜单项并展开子菜单
            const parentItem = targetItem.closest(".submenu").previousElementSibling;
            if (parentItem && parentItem.classList.contains("has-submenu")) {
              parentItem.classList.add("active");
              parentItem.nextElementSibling.classList.add("show");
            }
          }
          
          syncHeader();
          renderTiles();
          
          // 清空搜索框并隐藏下拉菜单
          searchInput.value = "";
          state.search = "";
          searchDropdown.classList.add("hidden");
        });
        searchDropdown.appendChild(item);
      });
      
      searchDropdown.classList.remove("hidden");
    }
    
    // 监听搜索输入
    searchInput.addEventListener("input", (e) => {
      try {
        const query = e.target.value || "";
        state.search = query;
        
        // 过滤后重渲染
        renderTiles();
        
        // 生成并显示搜索结果
        const results = generateSearchResults(query);
        renderSearchDropdown(results);
      } catch (error) {
        logLine("WARN", `搜索过程中出错：${error.message || "未知错误"}`);
      }
    });
    
    // 点击外部区域关闭下拉菜单
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.add("hidden");
      }
    });
    
    // 按ESC键关闭下拉菜单
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchDropdown.classList.add("hidden");
      }
    });

    // modal close
    btnCancel.addEventListener("click", closeModal);
    btnModalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    btnExecute.addEventListener("click", executeModal);

    // console actions
    $("#btnClearLog").addEventListener("click", clearLog);
    $("#btnExportLog").addEventListener("click", exportLog);
    $("#btnCopyLog").addEventListener("click", copyLog);

    // hotkey
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key || "").toLowerCase() === "k") {
        e.preventDefault();
        $("#searchInput").focus();
      }
      if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) closeModal();
    });
  }

  function init() {
    syncHeader();

    wireEvents();

    // 首次渲染
    renderTiles();
    logLine("INFO", "模拟台已启动：点击卡片开始演示操作流程");
  }

  function syncHeader() {
    const mod = MODULES[state.moduleKey];
    if (!mod) return;

    $("#breadcrumbModule").textContent = mod.label;
    
    // 更新页面标题
    const pageTitle = document.querySelector(".page-title h1");
    if (pageTitle) {
      pageTitle.textContent = mod.label;
    }
  }

  // start
  init();
})();