/**
 * Supreme Autonomous Platform Core Suite Engine (app.js)
 * Kulliya Platform ("كلية") — Gated University Social Ecosystem
 * 100% Self-Contained Frontend Persistence Layer optimized for Render
 */

window.KulliyaEngine = {
  // --- Storage Key Registry ---
  KEYS: {
    USER: "kulliya_v2_current_user",
    POSTS: "kulliya_v2_posts_ecosystem",
    PENDING: "kulliya_v2_pending_registrations",
    APPROVED: "kulliya_v2_approved_users",
    MESSAGES: "kulliya_v2_chat_messages",
    CONVS: "kulliya_v2_active_conversations",
    NOTIFS: "kulliya_v2_activity_notifications",
    STORIES: "kulliya_v2_story_highlights",
    ANN: "kulliya_v2_mandatory_circular"
  },

  // --- Initial Default Rich Academic Campus Seed Engine ---
  initSeed: () => {
    // Seed Active Posts
    let posts = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.POSTS) || "null");
    if (!posts) {
      posts = [
        {
          id: "post-1001",
          author: "📢 وزارة التعليم العالي والبحث العلمي",
          username: "mesrs_dz",
          badge: "رسمي سيادي",
          faculty: "الجزائر العاصمة · البث العام",
          time: "منذ ساعة",
          content: "📌 <strong>تعميم سيادي هام:</strong> إطلاق البوابة الرقمية الموحدة للخدمات الجامعية وتعميم بطاقة الطالب الذكية المزودة بشريحة RFID عبر كافة الأحياء الجامعية والمطاعم. يتوجب على جميع الطلبة استكمال إجراءات المطابقة قبل نهاية الشهر الجاري. 🎓🚀",
          type: "announcement",
          likes: 1240,
          saved: false,
          comments: [
            { id: "c-1", author: "ياسين سليماني", text: "خطوة ممتازة جداً! هل ستشمل بطاقة النقل الجامعي Cous كذلك؟", time: "10:14" },
            { id: "c-2", author: "وزارة التعليم العالي", text: "نعم، البطاقة مدمجة وشاملة لكافة الخدمات بما فيها النقل والمكتبات الرقمية.", time: "10:20" }
          ]
        },
        {
          id: "post-1002",
          author: "د. إبراهيم منصوري",
          username: "dr_mansouri",
          badge: "أستاذ باحث",
          faculty: "USTHB · كلية الرياضيات",
          time: "منذ 3 ساعات",
          content: "إلى طلبة السنة الثانية علوم وتكنولوجيا (ST): 📚\nتم رفع السلسلة الكاملة للتمارين المحلولة الخاصة بمقياس المعادلات التفاضلية العادية (ODE) مع نماذج مقترحة للامتحان النصفي. بالتوفيق للجميع في التحضير.\n<span class='hashtag'>#رياضيات_ST</span> <span class='hashtag'>#USTHB</span>",
          type: "pdf",
          file_name: "سلسلة_المعادلات_التفاضلية_شاملة.pdf",
          file_size: "3.8 MB",
          likes: 342,
          saved: false,
          comments: [
            { id: "c-3", author: "سلمى جابري", text: "جزاك الله خيراً أستاذنا الفاضل 🌟 التمارين واضحة جداً.", time: "11:00" }
          ]
        },
        {
          id: "post-1003",
          author: "حمزة بن بوزيد",
          username: "hamza_dev",
          badge: "طالب باحث",
          faculty: "ESI · المدرسة الوطنية العليا للإعلام الآلي",
          time: "منذ 5 ساعات",
          content: "سؤال موجه لمهندسي البرمجيات في الحرم: 💻⚡\nنحن بصدد بناء نظام موزع (Distributed System) لمعالجة البيانات الضخمة في بحث التخرج. ما هي أفضل أدوات المراسلة الفورية للأداء العالي: هل نستخدم RabbitMQ أم Apache Kafka؟ نحتاج مبررات معمارية.\n<span class='hashtag'>#هندسة_البرمجيات</span> <span class='hashtag'>#بحث_التخرج</span>",
          type: "question",
          likes: 89,
          saved: false,
          comments: [
            { id: "c-4", author: "كريم زياني", text: "إذا كنت تحتاج لمعالجة مستمرة وتخزين دائم مع إعادة التشغيل (Replay) استخدم Kafka بلا تردد. RabbitMQ ممتاز للمراسلات اللحظية السريعة.", time: "13:12" }
          ]
        },
        {
          id: "post-1004",
          author: "فاطمة الزهراء براهيمي",
          username: "fatima_bio",
          badge: "طالب باحث",
          faculty: "جامعة وهران 1 · كلية علوم الطبيعة والحياة",
          time: "منذ 8 ساعات",
          content: "الحمد لله الذي بنعمته تتم الصالحات! 🎉🔬\nتم اليوم استكمال ومناقشة مذكرة الماجستير في تخصص البيوتكنولوجيا الجزيئية والحصول على تقدير ممتاز مع تهنئة اللجنة. شكراً لكل من ساعدني في هذا المسار الأكاديمي.\n<span class='hashtag'>#مناقشة_تخرج</span> <span class='hashtag'>#بيوتكنولوجيا</span>",
          type: "milestone",
          likes: 762,
          saved: false,
          comments: [
            { id: "c-5", author: "مريم قاسمي", text: "ألف مبروك فاطمة! تستحقين كل خير وعقبال الدكتوراه إن شاء الله 🌹", time: "15:30" }
          ]
        }
      ];
      localStorage.setItem(window.KulliyaEngine.KEYS.POSTS, JSON.stringify(posts));
    }

    // Seed Active Conversations
    let convs = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.CONVS) || "null");
    if (!convs) {
      convs = [
        { id: "cv-1", name: "مجموعة الخوارزميات والبرمجة", icon: "💻", type: "group", last_msg: "كريم: تم رفع كود الـ TP في المستودع", time: "16:42", unread: 2 },
        { id: "cv-2", name: "ياسين سليماني", icon: "👨‍🎓", type: "dm", last_msg: "شكراً جزيلاً على المساعدة 🙏", time: "14:10", unread: 0 },
        { id: "cv-3", name: "سلمى جابري", icon: "👩‍🎓", type: "dm", last_msg: "أنت: إن شاء الله نلتقي في المكتبة غداً", time: "أمس", unread: 0 },
        { id: "cv-4", name: "نادي الروبوتيك والذكاء الاصطناعي", icon: "🤖", type: "channel", last_msg: "📢 إعلان عن بدء التسجيل في الورشة التطبيقية", time: "منذ 3 أيام", unread: 0 }
      ];
      localStorage.setItem(window.KulliyaEngine.KEYS.CONVS, JSON.stringify(convs));
    }

    // Seed Chat Messages
    let msgs = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.MESSAGES) || "null");
    if (!msgs) {
      msgs = {
        'مجموعة الخوارزميات والبرمجة': [
          { me: false, author: "سلمى جابري", text: "السلام عليكم يا جماعة، هل حللتم التمرين الرابع من السلسلة؟", time: "16:00", icon: "👩‍🎓" },
          { me: false, author: "ياسين سليماني", text: "نعم، الحل يعتمد على البرمجة الديناميكية (Dynamic Programming) لتفادي التكرار.", time: "16:15", icon: "👨‍🎓" },
          { me: true, author: "أنت", text: "كذلك، وسأشارك معكم الحل المكتوب بلغة Python بعد قليل 👍", time: "16:20", icon: "👑" },
          { me: false, author: "كريم زياني", text: "تم رفع كود الـ TP في المستودع المشترك للقسم 🚀", time: "16:42", icon: "👨‍💻" }
        ],
        'ياسين سليماني': [
          { me: false, author: "ياسين سليماني", text: "مرحباً أخي! هل يمكنك إعارتي كتاب الخوارزميات المتقدمة؟", time: "14:00", icon: "👨‍🎓" },
          { me: true, author: "أنت", text: "أهلاً ياسين، بكل سرور. سأحضره معي غداً إلى قاعة المحاضرات 😊", time: "14:05", icon: "👑" },
          { me: false, author: "ياسين سليماني", text: "شكراً جزيلاً على المساعدة 🙏", time: "14:10", icon: "👨‍🎓" }
        ]
      };
      localStorage.setItem(window.KulliyaEngine.KEYS.MESSAGES, JSON.stringify(msgs));
    }

    // Seed Activity Notifications
    let notifs = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.NOTIFS) || "null");
    if (!notifs) {
      notifs = [
        { id: "n-1", author: "ياسين سليماني", text: "أرسل طلباً للانضمام إلى شبكة أصدقائك المعتمدين في الكلية", type: "request", time: "منذ 15 دقيقة", user_uni: "USTHB · هندسة المعلوماتية", icon: "👨‍🎓" },
        { id: "n-2", author: "د. إبراهيم منصوري", text: "أُعجب بإسهامك الأكاديمي حول النظم الموزعة", type: "like", time: "منذ ساعتين", icon: "🌟" },
        { id: "n-3", author: "سلمى جابري", text: "قامت بالإشارة إليك في تعليق: 'أفضل مرجع رأيته حتى الآن 👌'", type: "mention", time: "منذ 4 ساعات", icon: "💬" }
      ];
      localStorage.setItem(window.KulliyaEngine.KEYS.NOTIFS, JSON.stringify(notifs));
    }

    // Seed Active Custom Highlights
    let stories = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.STORIES) || "null");
    if (!stories) {
      stories = [
        { id: "st-1", title: "دروس ومراجع", icon: "📚", slides: ["📚 ملخصات ومراجع مقياس الخوارزميات (س3)", "📄 كشف التمارين المحلولة وسلاسل الأعمال الموجهة TP", "⚡ نصائح لتحقيق العلامة الكاملة في الامتحان"] },
        { id: "st-2", title: "مشاريع الويب", icon: "💻", slides: ["💻 مشروع تطوير منصة الجامعة المغلقة (Kulliya)", "🚀 بناء معمارية مستقلة بالكامل تعمل على خوادم Render", "🌟 كود إنتاجي نقي وسريع للغاية"] },
        { id: "st-3", title: "تلخيصات AI", icon: "🤖", slides: ["🤖 مقدمة معمارية في الشبكات العصبية العميقة", "⚗️ الفروق الجوهرية بين التعلم الخاضع للرقابة وغير الخاضع", "📌 تحميلات المراجع الرقمية المعتمدة"] }
      ];
      localStorage.setItem(window.KulliyaEngine.KEYS.STORIES, JSON.stringify(stories));
    }

    // Seed Verified Approved Base List
    let approved = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.APPROVED) || "null");
    if (!approved) {
      approved = [
        { id: "usr-p-1", full_name: "أمينة بن عمر", username: "aminab", faculty: "USTHB · كلية الإعلام الآلي", verified: true, role: "student", created_at: "10/01/2026" },
        { id: "usr-p-2", full_name: "ياسين سليماني", username: "yacine_s", faculty: "USTHB · هندسة البرمجيات", verified: true, role: "student", created_at: "12/01/2026" },
        { id: "usr-p-3", full_name: "سلمى جابري", username: "salma_j", faculty: "ENP · هندسة مدنية", verified: true, role: "student", created_at: "15/01/2026" }
      ];
      localStorage.setItem(window.KulliyaEngine.KEYS.APPROVED, JSON.stringify(approved));
    }
  },

  // --- Current User Management ---
  getUser: () => {
    let u = JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.USER) || "null");
    if (!u) {
      u = {
        id: "usr-prime-1",
        full_name: "طالب باحث معتمد",
        username: "scholar_dz",
        badge: "طالب باحث",
        faculty: "جامعة العلوم والتكنولوجيا هواري بومدين USTHB · هندسة المعلوماتية",
        bio: "طالب باحث في الذكاء الاصطناعي ونظم المعلومات 🌿\nممثل الدفعة الأكاديمية · مهتم بتطوير البرمجيات مفتوحة المصدر.",
        posts_count: 5,
        followers_count: 84,
        following_count: 62,
        verified: true,
        role: "student",
        avatar_icon: "👑",
        joined_at: "01/01/2026"
      };
      localStorage.setItem(window.KulliyaEngine.KEYS.USER, JSON.stringify(u));
    }
    return u;
  },

  setUser: (obj) => localStorage.setItem(window.KulliyaEngine.KEYS.USER, JSON.stringify(obj)),

  showToast: (msg, type = "gold", duration = 2800) => {
    let tEl = document.getElementById("kulliya-toast");
    if (!tEl) {
      tEl = document.createElement("div");
      tEl.id = "kulliya-toast";
      document.body.appendChild(tEl);
    }
    tEl.className = "kulliya-toast-box show " + type;
    tEl.innerHTML = `<span class="toast-icon">${type === 'red' ? '🚨' : (type === 'green' ? '✓' : '✨')}</span><span class="toast-txt">${msg}</span>`;
    setTimeout(() => tEl.classList.remove("show"), duration);
  },

  // --- Data Logic Wrappers ---
  getPosts: () => JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.POSTS) || "[]"),
  setPosts: (arr) => localStorage.setItem(window.KulliyaEngine.KEYS.POSTS, JSON.stringify(arr)),

  createPost: (postObj) => {
    let arr = KulliyaEngine.getPosts();
    let curr = KulliyaEngine.getUser();
    const item = {
      id: "post-" + Date.now() + Math.floor(Math.random()*100),
      author: postObj.author || curr.full_name,
      username: postObj.username || curr.username,
      badge: postObj.badge || curr.badge,
      faculty: postObj.faculty || curr.faculty,
      time: "الآن مباشر",
      content: postObj.content,
      type: postObj.type || "regular",
      file_name: postObj.file_name || "",
      file_size: postObj.file_size || "",
      likes: 1,
      saved: false,
      comments: []
    };
    arr.unshift(item); KulliyaEngine.setPosts(arr);

    if(item.author === curr.full_name) {
      curr.posts_count = arr.filter(p => p.author === curr.full_name).length;
      KulliyaEngine.setUser(curr);
    }
    KulliyaEngine.showToast("✨ تم إرسال ونشر إسهامك الأكاديمي بنجاح ✓", "green");
    return item;
  },

  deletePost: (id) => {
    let arr = KulliyaEngine.getPosts();
    arr = arr.filter(p => p.id !== id);
    KulliyaEngine.setPosts(arr);
    let curr = KulliyaEngine.getUser();
    curr.posts_count = arr.filter(p => p.author === curr.full_name).length;
    KulliyaEngine.setUser(curr);
    KulliyaEngine.showToast("🗑️ تم سحب المحتوى وإزالته نهائياً ✓", "gold");
  },

  likePost: (id, el) => {
    let arr = KulliyaEngine.getPosts();
    let p = arr.find(i => i.id === id);
    if (p) {
      let isLiked = el.classList.toggle("liked");
      p.likes = isLiked ? (p.likes + 1) : Math.max(0, p.likes - 1);
      KulliyaEngine.setPosts(arr);
      const nEl = el.querySelector(".cnt");
      if (nEl) nEl.textContent = p.likes;
      if (isLiked) KulliyaEngine.showToast("✓ سُجل إعجابك بالمحتوى", "gold");
    }
  },

  savePost: (id, el) => {
    let arr = KulliyaEngine.getPosts();
    let p = arr.find(i => i.id === id);
    if(p) {
      p.saved = !p.saved;
      el.classList.toggle("saved", p.saved);
      KulliyaEngine.setPosts(arr);
      KulliyaEngine.showToast(p.saved ? "🔖 تم تثبيت المحتوى في مكتبتك الرقمية ✓" : "تم إزالة المحتوى من المكتبة", p.saved ? "green" : "gold");
    }
  },

  addComment: (postId, txt) => {
    let arr = KulliyaEngine.getPosts();
    let p = arr.find(i => i.id === postId);
    if (p) {
      let curr = KulliyaEngine.getUser();
      const cItem = { id: "c-" + Date.now(), author: curr.full_name, text: txt, time: "الآن" };
      p.comments.push(cItem);
      KulliyaEngine.setPosts(arr);
      KulliyaEngine.showToast("✨ تم إرفاق تعليقك الأكاديمي ✓", "green");
      return cItem;
    }
    return null;
  },

  // --- Secure Registration & Moderation Pipeline ---
  getPending: () => JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.PENDING) || "[]"),
  setPending: (arr) => localStorage.setItem(window.KulliyaEngine.KEYS.PENDING, JSON.stringify(arr)),

  getApproved: () => JSON.parse(localStorage.getItem(window.KulliyaEngine.KEYS.APPROVED) || "[]"),
  setApproved: (arr) => localStorage.setItem(window.KulliyaEngine.KEYS.APPROVED, JSON.stringify(arr)),

  registerStudent: (full_name, username, faculty, bac_number, carte_number, pass) => {
    let pends = KulliyaEngine.getPending();
    const newReq = {
      id: "req-" + Date.now(),
      full_name,
      username,
      faculty,
      bac_number,
      carte_number,
      pass,
      status: "pending",
      time: "الآن مباشر"
    };
    pends.unshift(newReq); KulliyaEngine.setPending(pends);

    // Initial strictly zero account created
    let u = {
      id: "usr-" + Date.now(),
      full_name, username, faculty, badge: "طالب أكاديمي", bio: "طالب مسجل حديثاً · " + faculty,
      posts_count: 0, followers_count: 0, following_count: 0, verified: false, role: "student", avatar_icon: "👨‍🎓", joined_at: new Date().toLocaleDateString('ar-DZ')
    };
    KulliyaEngine.setUser(u);
    localStorage.setItem("kulliya_v2_registered_success", "true");
  },

  approveReq: (reqId) => {
    let pends = KulliyaEngine.getPending();
    let target = pends.find(r => r.id === reqId);
    if (target) {
      target.status = "approved"; KulliyaEngine.setPending(pends);
      
      // Move to approved list
      let approvedUsrs = KulliyaEngine.getApproved();
      if(!approvedUsrs.some(u => u.username === target.username)) {
        approvedUsrs.unshift({
          id: "usr-" + target.id,
          full_name: target.full_name,
          username: target.username,
          faculty: target.faculty,
          verified: true,
          role: "student",
          created_at: target.time
        });
        KulliyaEngine.setApproved(approvedUsrs);
      }

      localStorage.setItem("kulliya_v2_approved_" + target.username, "true");
      KulliyaEngine.showToast(`✨ ✓ تم اعتماد وتوثيق حساب ${target.full_name} بنجاح!`, "green");
      return target;
    }
    return null;
  },

  rejectReq: (reqId) => {
    let pends = KulliyaEngine.getPending();
    let target = pends.find(r => r.id === reqId);
    if (target) {
      target.status = "rejected"; KulliyaEngine.setPending(pends);
      KulliyaEngine.showToast(`✕ تم رفض طلب ${target.full_name}`, "red");
      return target;
    }
    return null;
  }
};

// --- Execute initial seed ---
window.KulliyaEngine.initSeed();
