import { User } from '@/types/user';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type UserLocalContextType = {
  favorites: Record<string, boolean>;
  selectedIds: string[];
  localPhones: Record<string, string>;
  toggleFavorite: (userId: string) => void;
  addManyFavorites: (userIds: string[]) => void;
  toggleSelectedOrdered: (userId: string, users: User[]) => boolean;
  selectAll: (users: User[]) => void;
  updateLocalPhone: (userId: string, phone: string) => void;
  clearSelection: () => void;
};

const UserLocalContext = createContext<UserLocalContextType | null>(null);

export function UserLocalProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [localPhones, setLocalPhones] = useState<Record<string, string>>({});

  function toggleFavorite(userId: string) {
    setFavorites({
      ...favorites,
      [userId]: !favorites[userId],
    });
  }

  function addManyFavorites(userIds: string[]) {
    const newFavorites = { ...favorites };

    userIds.forEach((userId) => {
      newFavorites[userId] = true;
    });

    setFavorites(newFavorites);
  }

  function toggleSelectedOrdered(userId: string, users: User[]) {
    const userIndex = users.findIndex((user) => user.id === userId);
    const isSelected = selectedIds.includes(userId);

    if (userIndex === -1) {
      return false;
    }

    if (isSelected) {
      const lastSelectedId = selectedIds[selectedIds.length - 1];

      // solo se puede quitar el ultimo marcado
      if (lastSelectedId !== userId) {
        return false;
      }

      setSelectedIds(selectedIds.slice(0, -1));
      return true;
    }

    // solo se puede marcar el siguiente de la lista
    if (userIndex !== selectedIds.length) {
      return false;
    }

    setSelectedIds([...selectedIds, userId]);
    return true;
  }

  function selectAll(users: User[]) {
    const ids = users.map((user) => user.id);
    setSelectedIds(ids);
  }

  function updateLocalPhone(userId: string, phone: string) {
    setLocalPhones({
      ...localPhones,
      [userId]: phone,
    });
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  return (
    <UserLocalContext.Provider
      value={{
        favorites,
        selectedIds,
        localPhones,
        toggleFavorite,
        addManyFavorites,
        toggleSelectedOrdered,
        selectAll,
        updateLocalPhone,
        clearSelection,
      }}>
      {children}
    </UserLocalContext.Provider>
  );
}

export function useUserLocal() {
  const context = useContext(UserLocalContext);

  if (!context) {
    throw new Error('Error en UserLocalProvider');
  }

  return context;
}
