// ===================================
// SAAHL — إعدادات Supabase المشتركة
// ===================================
const SUPABASE_URL = 'https://ytjrtflmqydnpepdyafa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0anJ0ZmxtcXlkbnBlcGR5YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Mzk1MjksImV4cCI6MjA5NTExNTUyOX0.8ObScEKDLhsBjmfgkBqFdadx5xA99pw0CkRWCzxASpw';

// تهيئة Supabase
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ===================================
// Auth Helpers
// ===================================

// تسجيل الدخول
async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// تسجيل الخروج
async function signOut() {
  await db.auth.signOut();
  window.location.href = 'login.html';
}

// الحصول على المستخدم الحالي
async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

// الحصول على بيانات الـ profile
async function getProfile(userId) {
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// حماية الصفحة — يُعيد للوحة التحكم المناسبة
async function requireAuth(requiredRole = null) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  const profile = await getProfile(user.id);
  if (requiredRole && profile.role !== requiredRole) {
    redirectByRole(profile.role);
    return null;
  }
  return { user, profile };
}

// توجيه حسب الدور
function redirectByRole(role) {
  const routes = {
    OFFICE: 'office-dashboard.html',
    SPONSOR: 'sponsor-dashboard.html',
    KAFALA: 'kafala.html',
    ADMIN: 'admin.html',
  };
  window.location.href = routes[role] || 'index.html';
}
