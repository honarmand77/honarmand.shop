// src/pages/profile/components/AddressList.jsx
import { MapPin, Plus } from 'lucide-react';
import AddressItem from '../AddressItem/AddressItem';

const AddressList = ({ addresses, onAdd, onEdit, onDelete }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center py-12 bg-primary-foreground rounded-lg border border-gray-200/50">
        <MapPin className="h-14 w-14 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">هیچ آدرسی ثبت نشده است</p>
        <button
          onClick={onAdd}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-sm inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن آدرس جدید
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">آدرس‌های من</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-sm inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن آدرس جدید
        </button>
      </div>
      <div className="space-y-3">
        {addresses.map((address) => (
          <AddressItem 
            key={address.id} 
            address={address} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default AddressList;