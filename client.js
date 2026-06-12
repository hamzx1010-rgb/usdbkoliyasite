/**
 * Premium Universal API & WebSocket Client (client.js)
 * Architecture: Automated Hybrid Route connecting to Node.js Backend or Sandbox Persisted storage
 * Designed explicitly for Gated University Campus ("Kulliya")
 */

// Host inference
const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('onrender') ? window.location.origin : '';

// Establish Socket connection if socket.io loaded
let socketClient = null;
if (window.io) {
  try {
    socketClient = window.io(API_BASE);
    socketClient.on('connect', () => console.log("✨ Fully synchronized with Real-time WebSocket Gateway"));
  } catch (e) {
    console.warn("WebSocket client offline fallback initialized", e);
  }
}

/**
 * Kulliya Complete Frontend SDK
 */
window.KulliyaClient = {
  getSocket: () => socketClient,

  // --- Identity Management ---
  getCurrentUser: () => {
    let u = JSON.parse(localStorage.getItem("kulliya_v2_current_user") || "null");
    if (!u) {
      // Breathtaking Prime Explorer Account starter
      u = {
        id: "usr-prime-100",
        full_name: "طالب باحث معتمد",
        username: "scholar_dz",
        badge: "طالب باحث",
        faculty: "جامعة العلوم والتكنولوجيا هواري بومدين USTHB · كلية الإعلام الآلي",
        bio: "طالب باحث في الذكاء الاصطناعي ونظم المعلومات 🌿\nممثل الدفعة الأكاديمية · مهتم بتطوير البرمجيات مفتوحة المصدر.",
        posts_count: 5,
        followers_count: 84,
        following_count: 62,
        verified: true,
        role: "student",
        avatar_icon: "👑",
        created_at: new Date().toLocaleDateString('ar-DZ')
      };
      localStorage.setItem("kulliya_v2_current_user", JSON.stringify(u));
    }
    return u;
  },

  setCurrentUser: (obj) => localStorage.setItem("kulliya_v2_current_user", JSON.stringify(obj)),

  logout: () => {
    localStorage.removeItem("kulliya_v2_current_user");
    localStorage.removeItem("kulliya_v2_logged_in");
    window.location.href = "index.html";
  },

  showToast: (msg, type = "gold", duration = 2800) => {
    let tEl = document.getElementById("kulliya-toast");
    if (!tEl) {
      tEl = document.createElement("div"); tEl.id = "kulliya-toast"; document.body.appendChild(tEl);
    }
    tEl.className = "kulliya-toast-box show " + type;
    tEl.innerHTML = `<span class="toast-icon">${type === 'red' ? '🚨' : (type === 'green' ? '✓' : '✨')}</span><span class="toast-txt">${msg}</span>`;
    setTimeout(() => tEl.classList.remove("show"), duration);
  },

  // --- Registration Engine ---
  register: async (full_name, username, password, faculty, bac_number, carte_number) => {
    const payload = { full_name, username, password, faculty, bac_number, carte_number };
    
    // Save to sandbox offline cache
    let pends = JSON.parse(localStorage.getItem("kulliya_v2_pending_list") || "[]");
    const reqObj = { id: "req-" + Date.now(), ...payload, status: "pending", time: "الآن مباشر" };
    pends.unshift(reqObj);
    localStorage.setItem("kulliya_v2_pending_list", JSON.stringify(pends));

    // Starter Account
    const newU = {
      id: "usr-" + Date.now(),
      full_name, username, faculty, badge: "طالب أكاديمي", bio: "طالب مسجل حديثاً · " + faculty,
      posts_count: 0, followers_count: 0, following_count: 0, verified: false, role: "student", avatar_icon: "👨‍🎓", created_at: new Date().toLocaleDateString('ar-DZ')
    };
    KulliyaClient.setCurrentUser(newU);
    localStorage.setItem("kulliya_v2_registered_success", "true");

    // Attempt actual HTTP API Endpoint
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/api/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch(e) {}
    }

    return reqObj;
  },

  // --- Posts Ecosystem ---
  getPosts: async () => {
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "null");
    if (!posts) {
      // Elite rich base starter
      posts = [
        {
          id: "post-1001",
          author: "📢 وزارة التعليم العالي والبحث العلمي", username: "mesrs_dz", badge: "رسمي سيادي",
          faculty: "الجزائر العاصمة · البث العام", time: "منذ ساعة",
          content: "📌 <strong>تعميم سيادي هام:</strong> إطلاق البوابة الرقمية الموحدة للخدمات الجامعية وتعميم بطاقة الطالب الذكية المزودة بشريحة RFID عبر كافة الأحياء الجامعية والمطاعم. يتوجب على جميع الطلبة استكمال إجراءات المطابقة قبل نهاية الشهر الجاري. 🎓🚀",
          type: "announcement", file_name: "", file_size: "", is_channel: true, likes: 1240, saved: false, comments: []
        },
        {
          id: "post-1002",
          author: "د. إبراهيم منصوري", username: "dr_mansouri", badge: "أستاذ باحث",
          faculty: "USTHB · كلية الرياضيات", time: "منذ 3 ساعات",
          content: "إلى طلبة السنة الثانية علوم وتكنولوجيا (ST): 📚\nتم رفع السلسلة الكاملة للتمارين المحلولة الخاصة بمقياس المعادلات التفاضلية العادية (ODE) مع نماذج مقترحة للامتحان النصفي. بالتوفيق للجميع في التحضير.\n#رياضيات_ST #USTHB",
          type: "pdf", file_name: "سلسلة_المعادلات_التفاضلية_شاملة.pdf", file_size: "3.8 MB", is_channel: false, likes: 342, saved: false, comments: []
        }
      ];
      localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));
    }

    // Try API fetch
    if(API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        if(res.ok) {
          const apiPosts = await res.json();
          if(apiPosts && apiPosts.length > 0) return apiPosts;
        }
      } catch(e) {}
    }

    return posts;
  },

  createPost: async (content, type = 'regular', file_name = '', file_size = '', is_channel = false) => {
    let curr = KulliyaClient.getCurrentUser();
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "[]");

    const newP = {
      id: "post-" + Date.now(),
      author: is_channel ? "📢 الإدارة الرسمية السيادية" : curr.full_name,
      username: is_channel ? "admin_kulliya" : curr.username,
      badge: is_channel ? "رسمي سيادي" : curr.badge,
      faculty: is_channel ? "البث العام الموحد" : curr.faculty,
      time: "الآن مباشر",
      content, type, file_name, file_size, is_channel, likes: 1, saved: false, comments: [], created_at: Date.now()
    };

    posts.unshift(newP);
    localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));

    if (!is_channel && curr.full_name === newP.author) {
      curr.posts_count = (curr.posts_count || 0) + 1; KulliyaClient.setCurrentUser(curr);
    }

    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/api/posts`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author: newP.author, username: newP.username, badge: newP.badge, faculty: newP.faculty, content, type, file_name, file_size, is_channel })
        });
      } catch(e) {}
    }

    return newP;
  },

  deletePost: async (postId) => {
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "[]");
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));

    if(API_BASE) {
      try { await fetch(`${API_BASE}/api/posts/${postId}`, { method: 'DELETE' }); } catch(e) {}
    }
  },

  likePost: async (postId, btnEl) => {
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "[]");
    let p = posts.find(i => i.id === postId);
    if(p) {
      let isLiked = btnEl.classList.toggle("liked");
      p.likes = isLiked ? (p.likes + 1) : Math.max(0, p.likes - 1);
      localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));
      const nEl = btnEl.querySelector(".cnt");
      if(nEl) nEl.textContent = p.likes;
      if(isLiked) KulliyaClient.showToast("✓ سُجل إعجابك بالمحتوى الأكاديمي", "gold");
    }

    if(API_BASE) {
      try { await fetch(`${API_BASE}/api/posts/${postId}/like`, { method: 'POST' }); } catch(e) {}
    }
  },

  savePost: (postId, btnEl) => {
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "[]");
    let p = posts.find(i => i.id === postId);
    if(p) {
      p.saved = !p.saved; btnEl.classList.toggle("saved", p.saved);
      localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));
      KulliyaClient.showToast(p.saved ? "🔖 تم تثبيت المحتوى في مكتبتك الرقمية ✓" : "تم إزالة المحتوى من المكتبة", p.saved ? "green" : "gold");
    }
  },

  addComment: async (postId, txt) => {
    let posts = JSON.parse(localStorage.getItem("kulliya_v2_posts") || "[]");
    let p = posts.find(i => i.id === postId);
    if(p) {
      let curr = KulliyaClient.getCurrentUser();
      const cItem = { id: "c-" + Date.now(), author: curr.full_name, text: txt, time: "الآن" };
      p.comments.push(cItem);
      localStorage.setItem("kulliya_v2_posts", JSON.stringify(posts));
      KulliyaClient.showToast("✨ تم إرفاق تعليقك الأكاديمي ✓", "green");
      return cItem;
    }
    return null;
  },

  // --- Admin Logic ---
  getPendingSignups: async () => {
    let list = JSON.parse(localStorage.getItem("kulliya_v2_pending_list") || "[]");
    if(API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/pending`);
        if(res.ok) {
          const apiPends = await res.json();
          if(apiPends && apiPends.length > 0) return apiPends;
        }
      } catch(e) {}
    }
    return list;
  },

  approveStudent: async (reqId) => {
    let list = JSON.parse(localStorage.getItem("kulliya_v2_pending_list") || "[]");
    let target = list.find(s => s.id === reqId);
    if (target) {
      target.status = "approved"; localStorage.setItem("kulliya_v2_pending_list", JSON.stringify(list));
      localStorage.setItem("kulliya_v2_approved_" + target.username, "true");
    }

    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/api/admin/approve`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ req_id: reqId })
        });
      } catch(e) {}
    }
    return target;
  },

  rejectStudent: async (reqId) => {
    let list = JSON.parse(localStorage.getItem("kulliya_v2_pending_list") || "[]");
    let target = list.find(s => s.id === reqId);
    if (target) {
      target.status = "rejected"; localStorage.setItem("kulliya_v2_pending_list", JSON.stringify(list));
    }
    if (API_BASE) {
      try { await fetch(`${API_BASE}/api/admin/reject`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ req_id: reqId }) }); } catch(e) {}
    }
    return target;
  }
};
