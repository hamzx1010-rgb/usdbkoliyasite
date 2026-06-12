/**
 * Core Core Suite Configuration & Universal Database Engine (config.js)
 * Architecture: Hybrid Supabase Postgres + Sandbox Persisted LocalStorage Engine
 * Gated University Social Network ("Kulliya")
 */

const SUPABASE_URL = "https://bcvcfnefyqheuhawagdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdmNmbmVmeXFoZXVoYXdhZ2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjk4MTAsImV4cCI6MjA5Njg0NTgxMH0.2MwsmSKQ3jOHP2n833hynQp4pngT8LCXDLNmxzrNrPU";

// Shared SDK Client
let supaClient = null;

// Initialize Supabase if CDN loaded
if (window.supabase) {
  supaClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Universal Database Wrapper & Synchronizer
 * Guarantees 100% seamless performance whether online with Supabase or offline in Arena preview
 */
window.KulliyaDB = {
  getClient: () => supaClient,

  // --- Authentication & Current User Management ---
  getCurrentUser: () => {
    let user = JSON.parse(localStorage.getItem("kulliya_current_user") || "null");
    if (!user) {
      // Default brand new ecosystem starter user
      user = {
        id: "usr-" + Date.now(),
        full_name: "طالب جامعي مستجد",
        username: "user",
        faculty: "جامعة العلوم والتكنولوجيا هواري بومدين USTHB",
        bio: "طالب مستجد · بانتظار مشاركة أولى إسهاماتك الأكاديمية 🎓\nشبكة كلية الخاصة بالجامعات",
        posts_count: 0,
        followers_count: 0,
        following_count: 0,
        verified: true,
        role: "student",
        created_at: new Date().toLocaleDateString('ar-DZ')
      };
      localStorage.setItem("kulliya_current_user", JSON.stringify(user));
    }
    return user;
  },

  setCurrentUser: (userObj) => {
    localStorage.setItem("kulliya_current_user", JSON.stringify(userObj));
  },

  logout: () => {
    localStorage.removeItem("kulliya_current_user");
    localStorage.removeItem("kulliya_logged_in");
    window.location.href = "index.html";
  },

  // --- Toast Notification Engine ---
  letToastTimer: null,
  showToast: (msg, duration = 2800) => {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(window.KulliyaDB.letToastTimer);
    window.KulliyaDB.letToastTimer = setTimeout(() => toast.classList.remove("show"), duration);
  },

  // --- Posts Data Ecosystem ---
  getAllPosts: () => {
    let posts = JSON.parse(localStorage.getItem("kulliya_all_posts") || "null");
    if (!posts) {
      posts = []; // Brand new pristine state
      localStorage.setItem("kulliya_all_posts", JSON.stringify(posts));
    }
    return posts;
  },

  saveAllPosts: (postsArray) => {
    localStorage.setItem("kulliya_all_posts", JSON.stringify(postsArray));
  },

  createPost: async (contentObj) => {
    const posts = KulliyaDB.getAllPosts();
    const newPost = {
      id: "post-" + Date.now() + "-" + Math.floor(Math.random()*1000),
      author: contentObj.author || KulliyaDB.getCurrentUser().full_name,
      username: contentObj.username || KulliyaDB.getCurrentUser().username,
      faculty: contentObj.faculty || KulliyaDB.getCurrentUser().faculty,
      time: "الآن مباشر",
      content: contentObj.content,
      has_pdf: contentObj.has_pdf || false,
      pdf_name: contentObj.pdf_name || "",
      is_channel: contentObj.is_channel || false,
      likes: 1,
      comments: [],
      created_at: Date.now()
    };

    posts.unshift(newPost);
    KulliyaDB.saveAllPosts(posts);

    // Update user stats
    let currUser = KulliyaDB.getCurrentUser();
    if (newPost.author === currUser.full_name) {
      currUser.posts_count = (currUser.posts_count || 0) + 1;
      KulliyaDB.setCurrentUser(currUser);
    }

    // Attempt real Supabase insert
    if (supaClient && !newPost.is_channel) {
      try {
        await supaClient.from('posts').insert([{ content: newPost.content }]);
      } catch (e) {}
    }

    return newPost;
  },

  deletePost: async (postId) => {
    let posts = KulliyaDB.getAllPosts();
    posts = posts.filter(p => p.id !== postId);
    KulliyaDB.saveAllPosts(posts);

    // Sync stats
    let currUser = KulliyaDB.getCurrentUser();
    currUser.posts_count = posts.filter(p => p.author === currUser.full_name).length;
    KulliyaDB.setCurrentUser(currUser);

    // Attempt real Supabase delete
    if (supaClient) {
      try { await supaClient.from('posts').delete().eq('id', postId); } catch(e) {}
    }
  },

  likePost: (postId, btnEl) => {
    let posts = KulliyaDB.getAllPosts();
    let target = posts.find(p => p.id === postId);
    if (target) {
      let isLiked = btnEl.classList.toggle('liked');
      if (isLiked) {
        target.likes = (target.likes || 0) + 1;
        KulliyaDB.showToast("✓ أُعجبت بالمنشور");
      } else {
        target.likes = Math.max(0, (target.likes || 1) - 1);
      }
      KulliyaDB.saveAllPosts(posts);
      const numEl = btnEl.querySelector('.like-num');
      if (numEl) numEl.textContent = target.likes;
    }
  },

  addComment: (postId, commentText) => {
    let posts = KulliyaDB.getAllPosts();
    let target = posts.find(p => p.id === postId);
    if (target) {
      const commObj = {
        id: "comm-" + Date.now(),
        name: KulliyaDB.getCurrentUser().full_name,
        text: commentText,
        time: "الآن"
      };
      target.comments.push(commObj);
      KulliyaDB.saveAllPosts(posts);
      KulliyaDB.showToast("✨ تم نشر تعليقك الأكاديمي بنجاح ✓");
      return commObj;
    }
    return null;
  },

  // --- Registration & Pending Students Engine (For Admin) ---
  getPendingStudents: () => {
    let list = JSON.parse(localStorage.getItem("kulliya_pending_requests") || "null");
    if (!list) {
      list = []; // Brand new clean starter
      localStorage.setItem("kulliya_pending_requests", JSON.stringify(list));
    }
    return list;
  },

  addPendingStudent: async (studentObj) => {
    let list = KulliyaDB.getPendingStudents();
    const newReq = {
      id: studentObj.id || ("pend-" + Date.now()),
      full_name: studentObj.full_name,
      username: studentObj.username,
      bac_number: studentObj.bac_number,
      carte_number: studentObj.carte_number || "2026-USTHB-" + Math.floor(100+Math.random()*900),
      faculty: studentObj.faculty,
      status: "pending",
      submitted_at: "الآن مباشر"
    };
    list.unshift(newReq);
    localStorage.setItem("kulliya_pending_requests", JSON.stringify(list));

    // Attempt Supabase Insert
    if (supaClient) {
      try {
        await supaClient.from('pending_students').insert([{
          id: newReq.id.startsWith('pend-') ? undefined : newReq.id,
          full_name: newReq.full_name,
          username: newReq.username,
          bac_number: newReq.bac_number,
          student_card_url: `https://kulliya.dz/cards/${newReq.carte_number}.jpg`,
          faculty: newReq.faculty,
          status: "pending"
        }]);
      } catch(e) {}
    }
    return newReq;
  },

  approveStudent: async (reqId) => {
    let list = KulliyaDB.getPendingStudents();
    let target = list.find(s => s.id === reqId);
    if (target) {
      target.status = "approved";
      localStorage.setItem("kulliya_pending_requests", JSON.stringify(list));
      localStorage.setItem("kulliya_approved_user_" + target.username, "true");

      if (supaClient) {
        try {
          await supaClient.from('pending_students').update({ status: 'approved' }).eq('username', target.username);
          await supaClient.from('users').insert([{
            full_name: target.full_name,
            username: target.username,
            faculty: target.faculty,
            verified: true,
            role: "student"
          }]);
        } catch(e) {}
      }
      return target;
    }
    return null;
  },

  rejectStudent: async (reqId) => {
    let list = KulliyaDB.getPendingStudents();
    let target = list.find(s => s.id === reqId);
    if (target) {
      target.status = "rejected";
      localStorage.setItem("kulliya_pending_requests", JSON.stringify(list));
      if (supaClient) {
        try { await supaClient.from('pending_students').update({ status: 'rejected' }).eq('username', target.username); } catch(e) {}
      }
      return target;
    }
    return null;
  },

  // --- Telegram-Style Direct Messages Engine ---
  getChatConversations: () => {
    let convs = JSON.parse(localStorage.getItem("kulliya_active_convs") || "null");
    if (!convs) {
      convs = []; // Clean pristine starter
      localStorage.setItem("kulliya_active_convs", JSON.stringify(convs));
    }
    return convs;
  },

  getChatMessages: () => {
    let msgs = JSON.parse(localStorage.getItem("kulliya_chat_messages") || "null");
    if (!msgs) {
      msgs = {}; // Clean pristine starter
      localStorage.setItem("kulliya_chat_messages", JSON.stringify(msgs));
    }
    return msgs;
  },

  saveChatMessages: (msgsObj) => {
    localStorage.setItem("kulliya_chat_messages", JSON.stringify(msgsObj));
  },

  startNewConversation: (name, gradient, avatar, isGroup = false) => {
    let convs = KulliyaDB.getChatConversations();
    let target = convs.find(c => c.name === name);
    if (!target) {
      target = {
        id: "conv-" + Date.now(),
        name,
        gradient: gradient || "#3a1a1a,#6e4e2d",
        avatar: avatar || name.charAt(0),
        status: isGroup ? "مجموعة دراسية نشطة" : "متصل مباشر",
        is_group: isGroup,
        last_msg: isGroup ? "مجموعة جديدة جاهزة" : "محادثة مستجدة",
        updated_at: Date.now()
      };
      convs.unshift(target);
      localStorage.setItem("kulliya_active_convs", JSON.stringify(convs));
    }
    return target;
  }
};
