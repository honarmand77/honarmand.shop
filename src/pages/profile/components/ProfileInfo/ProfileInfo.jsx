// src/pages/profile/components/ProfileInfo.jsx
import { User, Phone, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value, verified }) => (
  <div className="p-5 bg-primary-foreground rounded-lg border border-gray-200/50 hover:border-primary/20 transition">
    <div className="flex items-center gap-2 mb-1.5">
      <Icon className="h-4 w-4 text-primary" />
      <p className="text-xs text-gray-500">{label}</p>
    </div>
    <p className="font-medium text-gray-800 flex items-center gap-2">
      {value || '—'}
      {verified !== undefined && (
        verified ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )
      )}
    </p>
  </div>
);

const ProfileInfo = ({ user, registeredAt }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem 
          icon={User} 
          label="نام و نام خانوادگی" 
          value={user?.display_name || user?.name} 
        />
        <InfoItem 
          icon={Phone} 
          label="شماره موبایل" 
          value={user?.phone} 
          verified={user?.phone_verified} 
        />
        <InfoItem 
          icon={Mail} 
          label="ایمیل" 
          value={user?.email} 
        />
      </div>

      {registeredAt && (
        <div className="mt-4 p-5 bg-primary-foreground rounded-lg border border-gray-200/50">
          <p className="text-xs text-gray-500">تاریخ ثبت‌نام</p>
          <p className="font-medium text-gray-800 mt-1">
            {new Date(registeredAt).toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;