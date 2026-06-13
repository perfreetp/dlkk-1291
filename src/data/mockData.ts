import { User, School, Referral, Article, Notification, Certification, Application, Resume } from '@/types';

export const schools: School[] = [
  { id: '1', name: '清华大学', region: '北京' },
  { id: '2', name: '北京大学', region: '北京' },
  { id: '3', name: '复旦大学', region: '上海' },
  { id: '4', name: '上海交通大学', region: '上海' },
  { id: '5', name: '浙江大学', region: '浙江' },
  { id: '6', name: '南京大学', region: '江苏' },
  { id: '7', name: '中国科学技术大学', region: '安徽' },
  { id: '8', name: '哈尔滨工业大学', region: '黑龙江' },
  { id: '9', name: '西安交通大学', region: '陕西' },
  { id: '10', name: '同济大学', region: '上海' },
  { id: '11', name: '北京航空航天大学', region: '北京' },
  { id: '12', name: '中国人民大学', region: '北京' },
];

export const users: (User & { certification?: Certification })[] = [
  {
    id: '1',
    email: 'zhangsan@example.com',
    nickname: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    createdAt: '2024-01-15T08:00:00Z',
    certification: {
      id: 'c1',
      userId: '1',
      schoolName: '清华大学',
      studentId: '2019012345',
      graduationYear: 2023,
      department: '计算机科学与技术系',
      major: '软件工程',
      status: 'approved',
      certifiedAt: '2024-01-20T10:00:00Z',
    },
  },
  {
    id: '2',
    email: 'lisi@example.com',
    nickname: '李思',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    createdAt: '2024-02-10T09:00:00Z',
    certification: {
      id: 'c2',
      userId: '2',
      schoolName: '北京大学',
      studentId: '2018012345',
      graduationYear: 2022,
      department: '信息科学技术学院',
      major: '计算机应用',
      status: 'approved',
      certifiedAt: '2024-02-15T14:00:00Z',
    },
  },
  {
    id: '3',
    email: 'wangwu@example.com',
    nickname: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
    createdAt: '2024-03-05T10:00:00Z',
  },
  {
    id: '4',
    email: 'zhaoliu@example.com',
    nickname: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
    createdAt: '2024-03-20T11:00:00Z',
    certification: {
      id: 'c4',
      userId: '4',
      schoolName: '复旦大学',
      studentId: '2019012345',
      graduationYear: 2023,
      department: '软件学院',
      major: '软件工程',
      status: 'approved',
      certifiedAt: '2024-03-25T15:00:00Z',
    },
  },
  {
    id: '5',
    email: 'chenqi@example.com',
    nickname: '陈七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    createdAt: '2024-04-01T12:00:00Z',
    certification: {
      id: 'c5',
      userId: '5',
      schoolName: '上海交通大学',
      studentId: '2018012345',
      graduationYear: 2022,
      department: '电子信息与电气工程学院',
      major: '计算机科学与技术',
      status: 'approved',
      certifiedAt: '2024-04-05T16:00:00Z',
    },
  },
];

export const referrals: Referral[] = [
  {
    id: '1',
    posterId: '1',
    poster: users[0],
    jobTitle: '后端开发实习生',
    companyName: '字节跳动',
    companyLogo: 'https://logo.clearbit.com/bytedance.com',
    city: '北京',
    jobType: 'internship',
    gradeRequired: 2025,
    majorRequired: '计算机相关专业',
    requirements: '1. 本科及以上在读，计算机相关专业\n2. 熟悉Go/Python/Java至少一种后端语言\n3. 了解MySQL、Redis等数据库\n4. 每周可实习4天以上',
    salary: '300-400/天',
    deadline: '2026-07-15',
    resumeRange: '希望接收计算机、软件工程等相关专业，24届及之后的同学简历',
    applicantCount: 23,
    status: 'active',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: '2',
    posterId: '2',
    poster: users[1],
    jobTitle: '算法工程师',
    companyName: '腾讯',
    companyLogo: 'https://logo.clearbit.com/tencent.com',
    city: '深圳',
    jobType: 'campus',
    gradeRequired: 2024,
    majorRequired: '人工智能、计算机、数学',
    requirements: '1. 硕士及以上学历\n2. 熟悉机器学习、深度学习算法\n3. 有NLP/CV相关项目经验优先\n4. 熟悉TensorFlow/PyTorch',
    salary: '25-40K·16薪',
    deadline: '2026-06-30',
    resumeRange: '985/211高校优先，硕士学历，有AI项目经验的同学',
    applicantCount: 45,
    status: 'active',
    createdAt: '2026-06-08T14:00:00Z',
  },
  {
    id: '3',
    posterId: '4',
    poster: users[3],
    jobTitle: '前端开发工程师',
    companyName: '阿里巴巴',
    companyLogo: 'https://logo.clearbit.com/alibaba.com',
    city: '杭州',
    jobType: 'campus',
    gradeRequired: 2024,
    majorRequired: '计算机、软件、设计相关',
    requirements: '1. 本科及以上学历\n2. 熟悉React/Vue等前端框架\n3. 掌握HTML/CSS/JavaScript\n4. 有项目经验或作品集优先',
    salary: '20-35K·15薪',
    deadline: '2026-07-01',
    resumeRange: '欢迎有前端项目经验的同学投递，需要有作品展示',
    applicantCount: 67,
    status: 'active',
    createdAt: '2026-06-05T09:00:00Z',
  },
  {
    id: '4',
    posterId: '5',
    poster: users[4],
    jobTitle: '产品经理实习生',
    companyName: '美团',
    companyLogo: 'https://logo.clearbit.com/meituan.com',
    city: '北京',
    jobType: 'internship',
    gradeRequired: 2026,
    majorRequired: '不限专业',
    requirements: '1. 本科及以上在读\n2. 对互联网产品有热情\n3. 逻辑清晰，沟通能力强\n4. 每周实习3天以上',
    salary: '200-250/天',
    deadline: '2026-07-20',
    resumeRange: '不限专业，欢迎理工科背景的同学，有学生会/社团经验优先',
    applicantCount: 89,
    status: 'active',
    createdAt: '2026-06-12T11:00:00Z',
  },
  {
    id: '5',
    posterId: '1',
    poster: users[0],
    jobTitle: '数据分析师',
    companyName: '网易',
    companyLogo: 'https://logo.clearbit.com/netease.com',
    city: '杭州',
    jobType: 'campus',
    gradeRequired: 2024,
    majorRequired: '统计学、数学、计算机',
    requirements: '1. 本科及以上学历\n2. 熟悉SQL/Python数据分析\n3. 有数据分析项目经验\n4. 统计学背景优先',
    salary: '18-30K·14薪',
    deadline: '2026-06-25',
    resumeRange: '统计学、数学、计算机背景的同学，有数据分析经验优先',
    applicantCount: 34,
    status: 'active',
    createdAt: '2026-06-09T15:00:00Z',
  },
  {
    id: '6',
    posterId: '2',
    poster: users[1],
    jobTitle: '测试开发工程师',
    companyName: '京东',
    companyLogo: 'https://logo.clearbit.com/jd.com',
    city: '北京',
    jobType: 'campus',
    gradeRequired: 2024,
    majorRequired: '计算机相关',
    requirements: '1. 本科及以上学历\n2. 熟悉Python/Java编程\n3. 了解软件测试理论\n4. 有自动化测试经验优先',
    salary: '20-28K·15薪',
    deadline: '2026-07-10',
    resumeRange: '计算机相关专业，有测试或开发经验的同学',
    applicantCount: 18,
    status: 'active',
    createdAt: '2026-06-11T13:00:00Z',
  },
  {
    id: '7',
    posterId: '4',
    poster: users[3],
    jobTitle: 'UI设计师实习生',
    companyName: '小红书',
    companyLogo: 'https://logo.clearbit.com/xiaohongshu.com',
    city: '上海',
    jobType: 'internship',
    gradeRequired: 2026,
    majorRequired: '设计、美术相关',
    requirements: '1. 本科及以上在读，设计相关专业\n2. 精通Figma/Sketch等设计工具\n3. 有APP或Web设计经验\n4. 请附上作品集链接',
    salary: '180-250/天',
    deadline: '2026-07-05',
    resumeRange: '设计相关专业，有UI设计作品和经验的同学',
    applicantCount: 56,
    status: 'active',
    createdAt: '2026-06-13T10:00:00Z',
  },
  {
    id: '8',
    posterId: '5',
    poster: users[4],
    jobTitle: 'DevOps工程师',
    companyName: '华为',
    companyLogo: 'https://logo.clearbit.com/huawei.com',
    city: '深圳',
    jobType: 'social',
    gradeRequired: 2023,
    majorRequired: '计算机、网络相关',
    requirements: '1. 本科及以上学历\n2. 熟悉Linux系统\n3. 了解Docker/Kubernetes\n4. 有运维或云平台经验优先',
    salary: '25-45K·14薪',
    deadline: '2026-06-28',
    resumeRange: '有运维经验或云计算背景的同学，有相关证书优先',
    applicantCount: 12,
    status: 'active',
    createdAt: '2026-06-07T16:00:00Z',
  },
];

export const articles: Article[] = [
  {
    id: '1',
    authorId: '1',
    author: users[0],
    title: '字节跳动后端实习面经分享',
    content: `收到offer啦！来分享一下面试经验给学弟学妹们参考。

**一面（技术面）**
- 自我介绍
- 项目经历详细介绍
- 算法题：二叉树层序遍历
- 问了一些数据库索引的原理

**二面（技术面）**
- 聊项目中的难点和解决方案
- 设计题：如何设计一个短链接系统
- 算法题：合并K个有序链表
- 系统设计相关问题

**三面（HR面）**
- 为什么选择字节
- 职业规划
- 期望薪资

整体体验很好，面试官都很专业。建议提前刷一下算法题，项目一定要非常熟悉！`,
    category: 'experience',
    likeCount: 156,
    commentCount: 23,
    createdAt: '2026-06-12T18:00:00Z',
  },
  {
    id: '2',
    authorId: '2',
    author: users[1],
    title: '感谢学长的内推，让我成功入职腾讯！',
    content: `在这里特别感谢@李思 学长帮我内推腾讯算法岗！

从投递到面试，学长一直很耐心地解答我的问题，还帮我看了简历，给了很多建议。最终顺利拿到了offer！

也想跟学弟学妹们说，有内推机会一定要抓住，真的会加分很多。校友之间的互帮互助真的很温暖！

最后，祝的平台越办越好，帮助更多校友找到心仪的工作！`,
    category: 'thanks',
    likeCount: 89,
    commentCount: 15,
    createdAt: '2026-06-11T20:00:00Z',
  },
  {
    id: '3',
    authorId: '4',
    author: users[3],
    title: '阿里面经：前端工程师校招全流程',
    content: `刚刚完成阿里面试，分享一下完整的面试流程和经验。

**流程时间线**
- 3月15日：内推投递
- 3月18日：一面
- 3月22日：二面
- 3月28日：三面（交叉面）
- 4月5日：HR面
- 4月10日：offer

**面试内容**
- 一面二面主要是技术面，会深入问项目、框架原理、手写代码
- 三面是技术主管面，更关注思维能力和解决实际问题的能力
- HR面主要是聊职业发展和文化匹配

**建议**
1. HTML/CSS/JS基础一定要扎实
2. React/Vue至少精通一个
3. 项目要能讲出深度和自己的思考
4. 保持好心态，不要紧张`,
    category: 'experience',
    likeCount: 234,
    commentCount: 42,
    createdAt: '2026-06-10T15:00:00Z',
  },
  {
    id: '4',
    authorId: '5',
    author: users[4],
    title: '内推感悟：帮助他人的快乐',
    content: `最近帮几位学弟学妹内推了公司，反馈都还不错。

说实话，帮忙内推其实是一件双赢的事情：
- 对求职者来说，多了一个机会，简历更容易被看到
- 对内推人来说，有些公司有内推奖励，也积累人脉
- 对公司来说，推荐的人质量更有保障

我自己当年找工作时也受到过学长学姐的帮助，现在工作了也想回馈母校。

建议大家都来发布内推岗位，帮助学弟学妹的同时也是在拓展自己的人脉圈！`,
    category: 'insight',
    likeCount: 67,
    commentCount: 8,
    createdAt: '2026-06-09T12:00:00Z',
  },
  {
    id: '5',
    authorId: '1',
    author: users[0],
    title: '美团产品实习面试复盘',
    content: `刚结束美团产品经理实习面试，来记录一下。

**面试问题**
1. 自我介绍（2分钟）
2. 为什么想做产品经理
3. 介绍一个最成功的项目
4. 如果让你设计一个XX功能，你会怎么做
5. 你平时使用什么APP，有什么改进建议
6. 反问环节

**面试技巧**
- 产品经理最重要的是逻辑思维和沟通能力
- 要多关注互联网行业动态
- 准备几个产品分析案例
- 保持真诚，不要背答案`,
    category: 'experience',
    likeCount: 98,
    commentCount: 19,
    createdAt: '2026-06-08T14:00:00Z',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: '3',
    type: 'deadline',
    title: '内推即将截止提醒',
    content: '您收藏的「字节跳动后端开发实习生」内推将在3天后截止，请尽快申请！',
    link: '/referrals/1',
    isRead: false,
    createdAt: '2026-06-13T10:00:00Z',
  },
  {
    id: 'n2',
    userId: '3',
    type: 'application',
    title: '申请有新进展',
    content: '您申请的「腾讯算法工程师」岗位，推荐人已查看您的简历',
    link: '/applications',
    isRead: false,
    createdAt: '2026-06-12T16:00:00Z',
  },
  {
    id: 'n3',
    userId: '3',
    type: 'new_referral',
    title: '新内推上线',
    content: '您关注的「阿里巴巴前端开发工程师」发布了新内推，速来申请！',
    link: '/referrals/3',
    isRead: true,
    createdAt: '2026-06-12T09:00:00Z',
  },
  {
    id: 'n4',
    userId: '3',
    type: 'system',
    title: '认证审核通过',
    content: '恭喜！您的校友认证已通过审核，现在可以发布内推岗位了。',
    link: '/certification',
    isRead: true,
    createdAt: '2026-06-11T14:00:00Z',
  },
  {
    id: 'n5',
    userId: '3',
    type: 'application',
    title: '内推成功',
    content: '您申请的「字节跳动后端开发实习生」已被推荐给HR，请保持手机畅通！',
    link: '/applications',
    isRead: true,
    createdAt: '2026-06-10T11:00:00Z',
  },
];

export const cities = [
  '北京', '上海', '深圳', '杭州', '广州', '成都', '南京', '武汉', '西安', '苏州'
];

export const jobTypes = [
  { value: 'internship', label: '实习' },
  { value: 'campus', label: '校招' },
  { value: 'social', label: '社招' },
];

export const grades = [
  { value: 2027, label: '2027届（准大一）' },
  { value: 2026, label: '2026届（大三/研一）' },
  { value: 2025, label: '2025届（大四/研二）' },
  { value: 2024, label: '2024届（已毕业）' },
  { value: 2023, label: '2023届（已毕业）' },
];

export const stats = {
  totalUsers: 12580,
  totalReferrals: 3456,
  successfulReferrals: 892,
  totalCities: 42,
};

export const applications: Application[] = [
  {
    id: 'a1',
    referralId: '1',
    referral: referrals[0],
    applicantId: '3',
    resumeId: 'r1',
    status: 'recommended',
    scheduledTime: '2026-06-20T14:00:00Z',
    notes: '希望能够获得面试机会',
    createdAt: '2026-06-10T15:00:00Z',
    updatedAt: '2026-06-12T10:00:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-06-10T15:00:00Z' },
      { status: 'viewed', timestamp: '2026-06-11T10:00:00Z' },
      { status: 'recommended', timestamp: '2026-06-12T10:00:00Z' },
    ],
  },
  {
    id: 'a2',
    referralId: '2',
    referral: referrals[1],
    applicantId: '3',
    resumeId: 'r1',
    status: 'pending',
    notes: '您好，我对算法工程师岗位非常感兴趣',
    createdAt: '2026-06-11T09:00:00Z',
    updatedAt: '2026-06-11T09:00:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-06-11T09:00:00Z' },
    ],
  },
  {
    id: 'a3',
    referralId: '3',
    referral: referrals[2],
    applicantId: '3',
    resumeId: 'r2',
    status: 'rejected',
    notes: '感谢您发布内推，我想申请这个岗位',
    createdAt: '2026-06-09T14:00:00Z',
    updatedAt: '2026-06-10T11:00:00Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-06-09T14:00:00Z' },
      { status: 'viewed', timestamp: '2026-06-10T09:00:00Z' },
      { status: 'rejected', timestamp: '2026-06-10T11:00:00Z' },
    ],
  },
];

export const resumes: Resume[] = [
  {
    id: 'r1',
    userId: '3',
    title: '王五-计算机科学-简历',
    fileUrl: '/resumes/wangwu_resume.pdf',
    isDefault: true,
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'r2',
    userId: '3',
    title: '王五-实习简历-精简版',
    fileUrl: '/resumes/wangwu_intern.pdf',
    isDefault: false,
    createdAt: '2024-04-20T15:00:00Z',
  },
];
