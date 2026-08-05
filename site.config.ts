// site.config.ts
export default {
  // ===== 站点信息 =====
  SITE_NAME: '清花MC服务器',
  SITE_URL: 'https://mcs.lestday233.eu.org',
  SITE_SINCE: '2026',
  SITE_AUTHOR: 'lestday233',

  // ===== API 接口配置 =====
  API_ENDPOINTS: {
    SERVER_STATUS: 'https://api.hanximeng.com/mc/?server_addr={ip}&server_port={port}',
    AVATAR_BY_UUID: 'https://mc-heads.net/avatar/{uuid}/36',
    AVATAR_BY_NAME: 'https://mc-heads.net/avatar/{name}/36'
  },

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
      core: "Paper",
      version: "1.21.10",
      tag: '核心主服',
      tagColor: 'red',
      icon: 'fa-solid fa-globe'
    },
    {
      id: 'mod',
      name: '整合包服',
      shortname: '模组服',
      ip: 'fun.r55770545.nyat.app',
      port: 29568,
      core: "NeoForge",
      version: "1.21.1",
      tag: '趣味模组',
      tagColor: 'purple',
      icon: 'fa-solid fa-cube'
    },
    {
      id: 'build',
      name: '生存与建造服',
      shortname: '生建服',
      ip: 'play.simpfun.cn',
      port: 19532,
      core: "Paper",
      version: "1.21.10",
      tag: '建造体验',
      tagColor: 'blue',
      icon: 'fa-solid fa-hammer'
    },
    {
      id: 'old',
      name: '怀旧服',
      ip: 'free-c1.tudouai.cn',
      port: 20005,
      core: "Purpur",
      version: "1.21.10",
      tag: '经典复古',
      tagColor: 'amber',
      icon: 'fa-solid fa-hourglass-half'
    }
  ]
}
