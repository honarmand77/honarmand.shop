// src/pages/profile/components/AddressItem.jsx
import { Edit2, XCircle } from 'lucide-react';

const AddressItem = ({ address, onEdit, onDelete }) => {
  return (
    <div className="p-5 bg-primary-foreground rounded-lg border border-gray-200/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-800">{address.title}</h4>
            {address.isDefault && (
              <span className="text-xs px-3 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                پیش‌فرض
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">{address.address}</p>
          <p className="text-sm text-gray-500 mt-1">تلفن: {address.phone}</p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit && onEdit(address)}
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete && onDelete(address.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;