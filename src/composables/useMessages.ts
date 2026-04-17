import { computed, ref } from 'vue'

export interface Message {
  id: number
  title: string
  content: string
  type: 'approval' | 'system' | 'review' | 'fund' | 'meeting'
  read: boolean
  date: string
}

const messages = ref<Message[]>([
  { id: 1, title: '项目审批通过通知', content: '您提交的"基于深度学习的医学图像分析研究"项目已通过院级审批，请及时查看审批意见并准备后续材料。', type: 'approval', read: false, date: '2026-04-17 09:15' },
  { id: 2, title: '科研经费到账通知', content: '国家级项目(编号: NSFC-2026-1234)经费 ¥850,000 已拨付到账，请登录财务系统确认到账信息。', type: 'fund', read: false, date: '2026-04-17 08:30' },
  { id: 3, title: '论文成果审核通过', content: '您提交的论文成果"基于Transformer的多模态融合方法研究"已通过学术委员会审核。', type: 'review', read: false, date: '2026-04-16 16:45' },
  { id: 4, title: '系统维护通知', content: '系统将于2026年4月19日 22:00至次日06:00进行例行维护升级，届时系统将暂停服务，请提前做好安排。', type: 'system', read: false, date: '2026-04-16 14:20' },
  { id: 5, title: '项目中期检查会议通知', content: '2026年度科研项目中期检查会议定于4月25日14:00在行政楼302会议室召开，请各项目负责人准时参加。', type: 'meeting', read: false, date: '2026-04-16 10:00' },
  { id: 6, title: '项目变更审批通知', content: '您提交的"智能交通信号优化系统"项目成员变更申请已通过审批，新增成员李明已加入项目组。', type: 'approval', read: false, date: '2026-04-15 17:30' },
  { id: 7, title: '横向课题经费通知', content: '企业合作项目(编号: HZ-2026-056)第二期经费 ¥200,000 已到账，请及时确认。', type: 'fund', read: false, date: '2026-04-15 09:10' },
  { id: 8, title: '专利申请审核通知', content: '您提交的发明专利"一种基于图神经网络的数据处理方法"已通过形式审查，已提交至国家知识产权局。', type: 'review', read: false, date: '2026-04-14 15:40' },
  { id: 9, title: '系统版本更新通知', content: '科研管理系统V2.8.0已发布，本次更新优化了项目申报流程，新增成果在线展示功能，请查看更新日志。', type: 'system', read: true, date: '2026-04-14 11:20' },
  { id: 10, title: '学术交流会议通知', content: '第三届人工智能与计算科学学术研讨会将于5月10日在学术报告厅举行，欢迎各位老师参加。', type: 'meeting', read: true, date: '2026-04-13 16:00' },
  { id: 11, title: '结项审批通过通知', content: '您提交的"知识图谱构建与推理研究"项目结项申请已通过审批，结项报告已归档。', type: 'approval', read: true, date: '2026-04-13 10:30' },
  { id: 12, title: '省级项目经费通知', content: '省部级项目(编号: PROV-2025-089)尾款 ¥120,000 已到账，请确认后办理结题手续。', type: 'fund', read: true, date: '2026-04-12 14:15' },
  { id: 13, title: '软件著作权审核通知', content: '您提交的软件著作权"智能数据分析平台V1.0"已通过审核，证书将在15个工作日内发放。', type: 'review', read: true, date: '2026-04-12 09:00' },
  { id: 14, title: '数据备份完成通知', content: '系统数据已于4月11日凌晨完成全量备份，备份文件大小 23.6GB，备份状态正常。', type: 'system', read: true, date: '2026-04-11 16:50' },
  { id: 15, title: '科研工作推进会通知', content: '2026年度科研工作推进会定于4月20日9:00在综合楼报告厅召开，请各院所科研秘书通知相关教师参会。', type: 'meeting', read: true, date: '2026-04-11 11:20' },
  { id: 16, title: '项目延期审批通知', content: '您提交的"量子计算算法优化研究"项目延期6个月申请已获批准，新截止日期为2026年12月31日。', type: 'approval', read: true, date: '2026-04-10 15:30' },
  { id: 17, title: '科研奖励发放通知', content: '2025年度科研奖励已核算完成，您获得的论文发表奖励 ¥15,000 将于本月底发放至工资账户。', type: 'fund', read: true, date: '2026-04-10 09:45' },
  { id: 18, title: '教材出版审核通知', content: '您提交的教材《机器学习基础与实践》出版申请已通过审核，已移交出版社进入排版流程。', type: 'review', read: true, date: '2026-04-09 14:00' },
  { id: 19, title: '账号安全提醒', content: '检测到您的账号于4月9日从新设备登录，如非本人操作请及时修改密码并联系管理员。', type: 'system', read: true, date: '2026-04-09 10:15' },
  { id: 20, title: '课题开题报告评审会通知', content: '2026年度新立项课题开题报告评审会定于5月5日举行，请各课题负责人准备15分钟PPT汇报。', type: 'meeting', read: true, date: '2026-04-08 16:30' },
  { id: 21, title: '设备采购审批通知', content: '您提交的高性能计算服务器采购申请(预算 ¥350,000)已通过审批，请联系设备处办理采购手续。', type: 'approval', read: true, date: '2026-04-08 11:00' },
  { id: 22, title: '科研平台使用费通知', content: '2026年第一季度高性能计算平台使用费 ¥4,500 已生成，请于4月30日前完成缴费。', type: 'fund', read: true, date: '2026-04-07 14:40' },
  { id: 23, title: '技术标准审核通知', content: '您参与起草的团体标准"人工智能模型评估规范"已通过专家组审核，即将发布。', type: 'review', read: true, date: '2026-04-07 09:20' },
  { id: 24, title: '年度考核通知', content: '2025年度科研人员考核工作即将启动，请于4月20日前登录系统填写年度科研工作总结。', type: 'system', read: true, date: '2026-04-06 15:00' },
  { id: 25, title: '校庆学术报告会通知', content: '建校70周年校庆学术报告会将于5月18日举行，现征集报告选题，请有意向的教师于4月25日前提交。', type: 'meeting', read: true, date: '2026-04-05 10:30' },
])

const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

function markAsRead(id: number) {
  const msg = messages.value.find(m => m.id === id)
  if (msg) msg.read = true
}

function markAllAsRead() {
  messages.value.forEach(m => {
    m.read = true
  })
}

export function useMessages() {
  return { messages, unreadCount, markAsRead, markAllAsRead }
}
