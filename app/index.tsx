import { useUserLocal } from '@/contexts/user-local-context';
import { useUsersQuery } from '@/hooks/use-users-query';
import { User } from '@/types/user';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { data, isLoading, isError, isFetching, refetch } = useUsersQuery();
  const { favorites, selectedIds, toggleFavorite, toggleSelectedOrdered } = useUserLocal();
  const users = data || [];
  const favoriteUsers = users.filter((user) => favorites[user.id]);

  function onSelectUser(user: User) {
    const changed = toggleSelectedOrdered(user.id, users);

    if (!changed) {
      Alert.alert('Aviso', 'Selecciona en orden alfabetico por el apellido');
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0B6B63" />
        <Text style={styles.message}>Cargando usuarios...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>No se pudo cargar</Text>
        <Text style={styles.message}>Revisa tu conexion e intenta otra vez.</Text>
        <Pressable style={styles.mainButton} onPress={() => refetch()}>
          <Text style={styles.mainButtonText}>Reintentar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <FavoriteList users={favoriteUsers} />
            <Text style={styles.title}>Home</Text>
            <Text style={styles.message}>Bienvenido</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.message}>No hay usuarios para mostrar.</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            isFavorite={Boolean(favorites[item.id])}
            isSelected={selectedIds.includes(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
            onSelectPress={() => onSelectUser(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

function FavoriteList({ users }: { users: User[] }) {
  return (
    <View style={styles.favoritesBox}>
      <Text style={styles.sectionTitle}>Favoritos</Text>

      {users.length === 0 ? (
        <Text style={styles.emptyFavoriteText}>Aun no tienes favoritos.</Text>
      ) : (
        <FlatList
          data={users}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.favoriteCard}
              onPress={() => {}}>
              <Image source={{ uri: item.photo }} style={styles.favoritePhoto} />
              <View style={styles.favoriteInfo}>
                <Text numberOfLines={1} style={styles.favoriteName}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={styles.favoriteLastName}>
                  {item.lastName}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function UserCard({
  user,
  isFavorite,
  isSelected,
  onFavoritePress,
  onSelectPress,
}: {
  user: User;
  isFavorite: boolean;
  isSelected: boolean;
  onFavoritePress: () => void;
  onSelectPress: () => void;
}) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.checkBox} onPress={onSelectPress}>
        <Text style={styles.checkText}>{isSelected ? '✓' : ''}</Text>
      </Pressable>

      <Image source={{ uri: user.photo }} style={styles.photo} />

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.lastName}, {user.name}
        </Text>
        <Text style={styles.smallText}>{user.email}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.starButton} onPress={onFavoritePress}>
          <Text style={styles.starText}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>

        <Pressable
          style={styles.detailButton}
          onPress={() => {}}>
          <Text style={styles.detailText}>Ver</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F4F7F6',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
  },
  message: {
    marginTop: 6,
    fontSize: 15,
    color: '#667085',
  },
  favoritesBox: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  emptyFavoriteText: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    padding: 12,
    color: '#667085',
  },
  favoriteCard: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  favoritePhoto: {
    width: 42,
    height: 42,
    borderRadius: 8,
    marginRight: 8,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    color: '#101828',
    fontWeight: '700',
  },
  favoriteLastName: {
    marginTop: 2,
    color: '#667085',
    fontSize: 12,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  mainButton: {
    marginTop: 16,
    backgroundColor: '#0B6B63',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkText: {
    color: '#0B6B63',
    fontSize: 12,
    fontWeight: '700',
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  smallText: {
    marginTop: 2,
    fontSize: 12,
    color: '#667085',
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 22,
    color: '#D99211',
  },
  detailButton: {
    backgroundColor: '#101828',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
