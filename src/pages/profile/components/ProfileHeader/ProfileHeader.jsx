// src/pages/profile/components/ProfileHeader.jsx
import { LogOut, Edit2, CheckCircle } from 'lucide-react';

const ProfileHeader = ({ user, onLogout, onEditToggle, isEditing }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-lg p-6 text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary-foreground/30">
            <span className="text-3xl font-bold text-primary-foreground">
              {user?.display_name?.[0] || user?.name?.[0] || 'U'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-primary-foreground">
                {user?.display_name || user?.name || 'کاربر'}
              </h2>
              {user?.phone_verified && (
                <CheckCircle className="h-5 w-5 text-green-300" />
              )}
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {user?.phone || 'شماره ثبت نشده'}
            </p>
            <span className={`inline-block text-xs px-3 py-0.5 rounded-full mt-1 ${
              user?.role === 'administrator' 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-primary-foreground/10 text-primary-foreground/90'
            }`}>
              {user?.role === 'administrator' ? 'مدیر' : user?.role || 'کاربر'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEditToggle}
            className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground rounded-xl hover:bg-primary-foreground/30 transition-all duration-300 border border-primary-foreground/20"
          >
            <Edit2 className="h-4 w-4" />
            {isEditing ? 'لغو ویرایش' : 'ویرایش پروفایل'}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-white/20"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;