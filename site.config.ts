// site.config.ts
export default {
  // ===== 站点信息 =====
  SITE_NAME: '清花MC服务器',
  SITE_URL: 'https://mcs.lestday233.eu.org',
  SITE_SINCE: '2026',
  SITE_AUTHOR: 'lestday233',

  // ===== 管理员 OP =====
  MC_SERVER_STAFF: [
    'lestday233',
    'Reeqeekouton',
    'Enchanter07'
  ],

  // ===== 服务器列表 =====
  MC_SERVERS: [
    {
      id: 'main',
      name: '主服',
      ip: 'mc.r55770545.nyat.app',
      port: 61482,
      tag: '核心主服',
      tagClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: 'fa-solid fa-server'
    },
    {
      id: 'survival',
      name: '生存与建造服',
      ip: 'play.simpfun.cn',
      port: 19532,
      tag: '纯净生存',
      tagClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: 'fa-solid fa-cubes'
    },
    {
      id: 'classic',
      name: '怀旧服',
      ip: 'free-c1.tudouai.cn',
      port: 20005,
      tag: '经典复古',
      tagClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: 'fa-solid fa-clock-rotate-left'
    }
  ],

  // 兼容旧字段（防止其他地方引用报错）
  MC_SERVER_IP: 'mc.r55770545.nyat.app',
  MC_SERVER_PORT: 61482
}