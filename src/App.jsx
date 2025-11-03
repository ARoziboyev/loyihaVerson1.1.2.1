import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import {
  Github,
  Mail,
  Phone,
  MessageCircle,
  Users,
  Video,
  Camera,
  Settings,
  Globe,
  Menu,
  X,
  ChevronDown,
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  Play,
  MoreVertical,
  Edit3,
  Trash2,
  Reply,
  Send,
  Upload,
  Languages,
  Palette,
  Moon,
  Sun,
  LogOut,
  UserPlus,
  UserCheck,
  ChevronRight,
} from "lucide-react";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCel99mhm_Hs4ZrlN3u6nR36yKCBH5lKrY",
  authDomain: "vediomove-87ede.firebaseapp.com",
  projectId: "vediomove-87ede",
  storageBucket: "vediomove-87ede.firebasestorage.app",
  messagingSenderId: "24496346656",
  appId: "1:24496346656:web:6730a35a387e1627aa0e45",
  measurementId: "G-XC3SCWT4DL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Auth form data
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });

  // Contact form data
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    issueType: "",
    message: "",
  });

  // Profile data
  const [profile, setProfile] = useState({
    username: "",
    displayName: "",
    bio: "",
    avatar: "",
    followers: 0,
    following: 0,
    posts: 0,
  });

  // Stories and posts
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);

  // Chat functionality
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);

  // Search functionality
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Settings and preferences
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [backgroundTheme, setBackgroundTheme] = useState("default");
  const [darkMode, setDarkMode] = useState(false);

  // Modals
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Language translations
  const translations = {
    uz: {
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      email: "Elektron pochta",
      password: "Parol",
      name: "Ism",
      username: "Foydalanuvchi nomi",
      home: "Asosiy",
      explore: "Kashf qilish",
      create: "Yaratish",
      messages: "Xabarlar",
      profile: "Profil",
      contactSupport: "Qo'llab-quvvatlashga murojaat qilish",
      send: "Yuborish",
      logout: "Chiqish",
      editProfile: "Profilni tahrirlash",
      bio: "Bio",
      save: "Saqlash",
      cancel: "Bekor qilish",
      search: "Qidirish",
      live: "Jonli efir",
      stories: "Hikoyalar",
      reels: "Reels",
      posts: "Postlar",
      follow: "Obuna bo'lish",
      following: "Obuna bo'lingan",
      followers: "Obunachilar",
      settings: "Sozlamalar",
      language: "Til",
      theme: "Mavzu",
      darkMode: "Qora rejim",
      lightMode: "Yorug' rejim",
      background: "Orqa fon",
      upload: "Yuklash",
      like: "Yoqdi",
      comment: "Izoh qoldirish",
      share: "Ulashish",
      addAccount: "Hisob qo'shish",
      googleLogin: "Google orqali kirish",
    },
    en: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Name",
      username: "Username",
      home: "Home",
      explore: "Explore",
      create: "Create",
      messages: "Messages",
      profile: "Profile",
      contactSupport: "Contact Support",
      send: "Send",
      logout: "Logout",
      editProfile: "Edit Profile",
      bio: "Bio",
      save: "Save",
      cancel: "Cancel",
      search: "Search",
      live: "Live",
      stories: "Stories",
      reels: "Reels",
      posts: "Posts",
      follow: "Follow",
      following: "Following",
      followers: "Followers",
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      background: "Background",
      upload: "Upload",
      like: "Like",
      comment: "Comment",
      share: "Share",
      addAccount: "Add Account",
      googleLogin: "Sign in with Google",
    },
    ru: {
      login: "Вход",
      register: "Регистрация",
      email: "Электронная почта",
      password: "Пароль",
      name: "Имя",
      username: "Имя пользователя",
      home: "Главная",
      explore: "Обзор",
      create: "Создать",
      messages: "Сообщения",
      profile: "Профиль",
      contactSupport: "Обратиться в поддержку",
      send: "Отправить",
      logout: "Выйти",
      editProfile: "Редактировать профиль",
      bio: "О себе",
      save: "Сохранить",
      cancel: "Отмена",
      search: "Поиск",
      live: "Прямой эфир",
      stories: "Истории",
      reels: "Рилсы",
      posts: "Посты",
      follow: "Подписаться",
      following: "Подписки",
      followers: "Подписчики",
      settings: "Настройки",
      language: "Язык",
      theme: "Тема",
      darkMode: "Темная тема",
      lightMode: "Светлая тема",
      background: "Фон",
      upload: "Загрузить",
      like: "Нравится",
      comment: "Комментировать",
      share: "Поделиться",
      addAccount: "Добавить аккаунт",
      googleLogin: "Войти через Google",
    },
  };

  const t = (key) => translations[language]?.[key] || key;

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setShowAuth(false);
        // Load user profile
        const userDoc = await getDocs(
          query(collection(db, "users"), where("uid", "==", user.uid))
        );
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setProfile({
            username: userData.username,
            displayName: userData.displayName,
            bio: userData.bio || "",
            avatar:
              userData.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.displayName || user.email.split("@")[0]
              )}&background=59A52C&color=fff`,
            followers: userData.followers || 0,
            following: userData.following || 0,
            posts: userData.posts || 0,
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadStories();
      loadPosts();
      loadReels();
      loadLiveStreams();
      loadChats();
    }
  }, [currentUser]);

  const loadStories = async () => {
    const storiesSnapshot = await getDocs(collection(db, "stories"));
    const storiesData = storiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStories(storiesData);
  };

  const loadPosts = async () => {
    const postsSnapshot = await getDocs(
      query(collection(db, "posts"), where("type", "==", "post"))
    );
    const postsData = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData.sort((a, b) => b.timestamp - a.timestamp));
  };

  const loadReels = async () => {
    const reelsSnapshot = await getDocs(
      query(collection(db, "posts"), where("type", "==", "reel"))
    );
    const reelsData = reelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReels(reelsData.sort((a, b) => b.timestamp - a.timestamp));
  };

  const loadLiveStreams = async () => {
    const liveSnapshot = await getDocs(
      query(collection(db, "live"), where("isActive", "==", true))
    );
    const liveData = liveSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLiveStreams(liveData);
  };

  const loadChats = async () => {
    if (!currentUser) return;
    const chatsSnapshot = await getDocs(
      query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid)
      )
    );
    const chatsData = chatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setChats(chatsData);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (authMode === "login") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        setCurrentUser(userCredential.user);
        setSuccess("Successfully logged in!");
      } else {
        // Check if username already exists
        const usernameQuery = query(
          collection(db, "users"),
          where("username", "==", authData.username)
        );
        const usernameSnapshot = await getDocs(usernameQuery);
        if (!usernameSnapshot.empty) {
          setError("Username already exists. Please choose another.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        await updateProfile(userCredential.user, {
          displayName: authData.name,
        });
        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: authData.email,
          displayName: authData.name,
          username: authData.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            authData.name
          )}&background=59A52C&color=fff`,
          bio: "",
          followers: 0,
          following: 0,
          posts: 0,
          createdAt: serverTimestamp(),
        });
        setCurrentUser(userCredential.user);
        setProfile({
          username: authData.username,
          displayName: authData.name,
          bio: "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            authData.name
          )}&background=59A52C&color=fff`,
          followers: 0,
          following: 0,
          posts: 0,
        });
        setSuccess("Account created successfully!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Check if user exists in Firestore
      const userDoc = await getDocs(
        query(collection(db, "users"), where("uid", "==", user.uid))
      );
      if (userDoc.empty) {
        // Create new user document
        const username = user.email.split("@")[0];
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || username,
          username: username,
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || username)}&background=59A52C&color=fff`,
          bio: "",
          followers: 0,
          following: 0,
          posts: 0,
          createdAt: serverTimestamp(),
        });
        setProfile({
          username: username,
          displayName: user.displayName || username,
          bio: "",
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || username)}&background=59A52C&color=fff`,
          followers: 0,
          following: 0,
          posts: 0,
        });
      } else {
        const userData = userDoc.docs[0].data();
        setProfile({
          username: userData.username,
          displayName: userData.displayName,
          bio: userData.bio || "",
          avatar: userData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || user.email.split("@")[0])}&background=59A52C&color=fff`,
          followers: userData.followers || 0,
          following: userData.following || 0,
          posts: userData.posts || 0,
        });
      }
      setCurrentUser(user);
      setShowAuth(false);
      setSuccess("Signed in with Google!");
    } catch (err) {
      setError("Google sign-in failed: " + err.message);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "support"), {
        ...contactData,
        userId: currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });
      setSuccess("Support request submitted! We'll contact you soon.");
      setContactData({ name: "", email: "", issueType: "", message: "" });
    } catch (err) {
      setError("Failed to submit support request.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setActiveTab("home");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (fileInputRef.current?.files?.length > 0) {
      const file = fileInputRef.current.files[0];
      
      // Validate video duration (client-side check for demo)
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = async () => {
          const duration = video.duration;
          if (duration > 90) {
            setError("Video duration must be 1.5 minutes (90 seconds) or less.");
            return;
          }
          await uploadPost(file, "reel");
        };
        video.src = URL.createObjectURL(file);
      } else {
        await uploadPost(file, "post");
      }
    }
  };

  const uploadPost = async (file, type) => {
    try {
      const postUrl = URL.createObjectURL(file);
      const newPost = {
        userId: currentUser.uid,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        content: postUrl,
        type: type,
        likes: 0,
        comments: 0,
        caption: "",
        timestamp: Date.now(),
      };
      const docRef = await addDoc(collection(db, "posts"), newPost);
      if (type === "reel") {
        setReels((prev) => [newPost, ...prev]);
      } else {
        setPosts((prev) => [newPost, ...prev]);
      }
      setShowCreatePost(false);
      fileInputRef.current.value = "";
    } catch (err) {
      setError("Failed to upload post.");
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "users", currentUser.uid), {
      following: arrayUnion(targetUserId),
    });
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayUnion(currentUser.uid),
    });
    setProfile((prev) => ({ ...prev, following: prev.following + 1 }));
  };

  const handleUnfollow = async (targetUserId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "users", currentUser.uid), {
      following: arrayRemove(targetUserId),
    });
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayRemove(currentUser.uid),
    });
    setProfile((prev) => ({ ...prev, following: prev.following - 1 }));
  };

  const handleLike = async (postId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "posts", postId), {
      likes: arrayUnion(currentUser.uid),
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    const messageData = {
      chatId: selectedChat.id,
      senderId: currentUser.uid,
      senderName: profile.displayName,
      senderAvatar: profile.avatar,
      content: newMessage,
      timestamp: serverTimestamp(),
      edited: false,
    };
    await addDoc(collection(db, "messages"), messageData);
    setNewMessage("");
  };

  const startLiveStream = async () => {
    if (!currentUser) return;
    const liveData = {
      userId: currentUser.uid,
      username: profile.username,
      displayName: profile.displayName,
      avatar: profile.avatar,
      title: "Live Stream",
      viewers: 0,
      isActive: true,
      startedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "live"), liveData);
    setIsStreaming(true);
    setShowLiveModal(true);
  };

  const endLiveStream = async () => {
    if (!currentUser) return;
    const liveQuery = query(
      collection(db, "live"),
      where("userId", "==", currentUser.uid),
      where("isActive", "==", true)
    );
    const liveSnapshot = await getDocs(liveQuery);
    if (!liveSnapshot.empty) {
      const liveDoc = liveSnapshot.docs[0];
      await updateDoc(doc(db, "live", liveDoc.id), { isActive: false });
    }
    setIsStreaming(false);
    setShowLiveModal(false);
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const usersQuery = query(
      collection(db, "users"),
      where("username", ">=", query.toLowerCase()),
      where("username", "<=", query.toLowerCase() + "\uf8ff")
    );
    const usersSnapshot = await getDocs(usersQuery);
    const usersData = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSearchResults(usersData);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const Navigation = () => (
    <nav className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        {/* Navigation Items */}
        <div className="flex-1 py-4 space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "home"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <Home className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("home")}</span>}
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "reels"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <Play className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("reels")}</span>}
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "explore"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <Search className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("explore")}</span>}
          </button>
          <button
            onClick={() => setShowCreatePost(true)}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "create"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <PlusSquare className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("create")}</span>}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "messages"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <MessageCircle className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("messages")}</span>}
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === "profile"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}>
            <User className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("profile")}</span>}
          </button>
        </div>
        {/* Bottom Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-4 font-medium">{t("settings")}</span>}
          </button>
        </div>
      </div>
    </nav>
  );

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {authMode === "login" ? t("login") : t("register")}
            </h2>
            <button
              onClick={() => setShowAuth(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm dark:bg-green-900 dark:text-green-200">
              {success}
            </div>
          )}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t("name")}
                    value={authData.name}
                    onChange={(e) =>
                      setAuthData({ ...authData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    {t("username")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t("username")}
                    value={authData.username}
                    onChange={(e) =>
                      setAuthData({ ...authData, username: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {t("email")}
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t("email")}
                value={authData.email}
                onChange={(e) =>
                  setAuthData({ ...authData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {t("password")}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={t("password")}
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300">
              {authMode === "login" ? t("login") : t("register")}
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <Globe className="w-5 h-5" />
              {t("googleLogin")}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 dark:text-red-400 dark:hover:text-red-300">
              {authMode === "login" ? `${t("register")}?` : `${t("login")}?`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactSupportForm = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
          {t("contactSupport")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("contactSupport")} {t("contactSupport").toLowerCase()}
        </p>
      </div>
      <form onSubmit={handleContactSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {t("name")}
          </label>
          <input
            type="text"
            id="contact-name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={t("name")}
            value={contactData.name}
            onChange={(e) =>
              setContactData({ ...contactData, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {t("email")}
          </label>
          <input
            type="email"
            id="contact-email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={t("email")}
            value={contactData.email}
            onChange={(e) =>
              setContactData({ ...contactData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor="contact-issue"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            Issue Type
          </label>
          <select
            id="contact-issue"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={contactData.issueType}
            onChange={(e) =>
              setContactData({ ...contactData, issueType: e.target.value })
            }
            required>
            <option value="">Select an issue type</option>
            <option value="technical">Technical Issue</option>
            <option value="account">Account Problem</option>
            <option value="feature">Feature Request</option>
            <option value="billing">Billing Question</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {t("message")}
          </label>
          <textarea
            id="contact-message"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Describe your issue in detail..."
            value={contactData.message}
            onChange={(e) =>
              setContactData({ ...contactData, message: e.target.value })
            }
            required></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300">
          {t("send")}
        </button>
      </form>
    </div>
  );

  const VideoCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fadeIn dark:bg-gray-800 dark:border-gray-700">
      <div className="relative">
        {post.type === "reel" ? (
          <video
            src={post.content}
            controls
            className="w-full h-96 object-cover"
            poster="https://placehold.co/400x400?text=Video+Thumbnail"
          />
        ) : (
          <img
            src={post.content}
            alt="Post"
            className="w-full h-64 object-cover"
          />
        )}
        {post.type === "reel" && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-2">
            <Play className="w-6 h-6 text-white" />
          </div>
        )}
        {liveStreams.some((stream) => stream.userId === post.userId) && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            LIVE
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={post.avatar}
              alt={post.displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900 dark:text-white">
              @{post.username}
            </span>
          </div>
          <button
            onClick={() => handleLike(post.id)}
            className="text-gray-500 hover:text-red-500 transition-colors dark:text-gray-400 dark:hover:text-red-400">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 mb-2 dark:text-gray-300">
          {post.caption || "Amazing content!"}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            {post.likes || 0} {t("like")}
          </span>
          <span className="mx-2">•</span>
          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Video className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Vido
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Move
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
              The ultimate social video platform for creators and viewers
            </p>
          </div>
          <div className="space-y-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
              className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              {t("login")}
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setShowAuth(true);
              }}
              className="w-full bg-transparent border-2 border-white text-white py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-xl">
              {t("register")}
            </button>
          </div>
          <p className="text-gray-400 mt-8 text-sm">
            Join millions of creators sharing their stories
          </p>
        </div>
        {showAuth && <AuthModal />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      <Navigation />
      <div className="flex-1 ml-0 md:ml-[72px] lg:ml-[240px] transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              VidoMove
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={startLiveStream}
              className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              <Play className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
        {/* Main Content */}
        <main className="p-4 md:p-6">
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Stories */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">
                  {t("stories")}
                </h3>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  <div className="flex flex-col items-center min-w-max">
                    <div className="w-16 h-16 rounded-full border-2 border-red-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <PlusSquare className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      Your Story
                    </span>
                  </div>
                  {stories.slice(0, 5).map((story, index) => (
                    <div
                      key={story.id}
                      className="flex flex-col items-center min-w-max">
                      <div className="w-16 h-16 rounded-full border-2 border-red-500 p-0.5">
                        <img
                          src={story.avatar}
                          alt={story.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 truncate max-w-16">
                        {story.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Posts */}
              {posts.map((post) => (
                <VideoCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {activeTab === "reels" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
                {t("reels")}
              </h2>
              {reels.map((reel) => (
                <VideoCard key={reel.id} post={reel} />
              ))}
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 mb-6 dark:bg-gray-800">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.displayName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="absolute bottom-0 right-0 bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
                      {profile.displayName}
                    </h2>
                    <p className="text-gray-600 mb-4 dark:text-gray-400">
                      @{profile.username}
                    </p>
                    <p className="text-gray-700 mb-4 dark:text-gray-300">
                      {profile.bio}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-gray-900 font-bold text-lg dark:text-white">
                          {profile.posts}
                        </div>
                        <div className="text-gray-600 text-sm dark:text-gray-400">
                          {t("posts")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 font-bold text-lg dark:text-white">
                          {profile.followers}
                        </div>
                        <div className="text-gray-600 text-sm dark:text-gray-400">
                          {t("followers")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 font-bold text-lg dark:text-white">
                          {profile.following}
                        </div>
                        <div className="text-gray-600 text-sm dark:text-gray-400">
                          {t("following")}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300">
                      {t("editProfile")}
                    </button>
                  </div>
                </div>
              </div>
              <ContactSupportForm />
            </div>
          )}
          {activeTab === "explore" && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 dark:text-gray-400" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
                Discover Content
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Search for videos, creators, and trending content
              </p>
            </div>
          )}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
                {t("messages")}
              </h2>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        chat.avatar ||
                        "https://ui-avatars.com/api/?name=User&background=59A52C&color=fff"
                      }
                      alt={chat.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {chat.displayName}
                      </h3>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAuth && <AuthModal />}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("create")}
                </h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-600">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-500" />
                  <p className="text-gray-600 mb-4 dark:text-gray-400">
                    Upload your photo or video (max 1.5 minutes)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium">
                    {t("upload")}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("editProfile")}
                </h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    {t("username")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={profile.username || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={profile.displayName || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, displayName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    {t("bio")}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }></textarea>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300">
                    {t("save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("search")}
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        @{user.username}
                      </h3>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {user.displayName}
                      </p>
                    </div>
                  </div>
                ))}
                {searchResults.length === 0 && searchQuery && (
                  <p className="text-gray-600 text-center py-4 dark:text-gray-400">
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("settings")}
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <span className="text-gray-900 dark:text-white">
                    {t("language")}
                  </span>
                  <Languages className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setShowBackgroundModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <span className="text-gray-900 dark:text-white">
                    {t("background")}
                  </span>
                  <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <span className="text-gray-900 dark:text-white">
                    {darkMode ? t("lightMode") : t("darkMode")}
                  </span>
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowAuth(true);
                    setAuthMode("register");
                  }}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:hover:bg-blue-900/30">
                  <span className="text-blue-700 dark:text-blue-400">
                    {t("addAccount")}
                  </span>
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/30">
                  <span className="text-red-700 dark:text-red-400">
                    {t("logout")}
                  </span>
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("language")}
                </h2>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(translations).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${language === code
                        ? "bg-red-500 text-white dark:bg-red-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                      }`}>
                    {lang.login.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Live Stream</h2>
            <p className="text-gray-300">You are currently live</p>
          </div>
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl h-96 flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <p className="text-white">Live camera feed would appear here</p>
            </div>
          </div>
          <button
            onClick={endLiveStream}
            className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center">
            <Play className="w-5 h-5 mr-2" />
            End Live
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
