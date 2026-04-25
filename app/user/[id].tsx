import { useUserLocal } from '@/contexts/user-local-context';
import { useUsersQuery } from '@/hooks/use-users-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useUsersQuery();
  const { localPhones, updateLocalPhone } = useUserLocal();
  const users = data || [];
  const user = users.find((item) => item.id === id);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [phoneLoaded, setPhoneLoaded] = useState('');

  useEffect(() => {
    if (user && phoneLoaded !== user.id) {
      // telefono local guardado
      setPhone(localPhones[user.id] || '');
      setPhoneLoaded(user.id);
    }
  }, [user, localPhones, phoneLoaded]);

  function savePhone() {
    const phoneText = phone.trim();

    if (phoneText.length === 0) {
      setPhoneError('Ingresa un telefono');
      return;
    }

    if (phoneText.length < 7) {
      setPhoneError('Minimo 7 caracteres');
      return;
    }

    updateLocalPhone(user!.id, phoneText);
    setPhone('');
    setPhoneError('');
    setSavedMessage('Telefono guardado');
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0B6B63" />
        <Text style={styles.message}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Usuario no encontrado</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Image source={{ uri: user.photo }} style={styles.photo} />
          <Text style={styles.title}>
            {user.name} {user.lastName}
          </Text>
          <Text style={styles.message}>{user.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <InfoRow label="Apellido" value={user.lastName} />
          <InfoRow label="Telefono" value={user.phone} />
          <InfoRow label="Telefono local" value={localPhones[user.id] || 'Sin telefono local'} />
          <InfoRow label="Edad" value={`${user.age} anos`} />
          <InfoRow label="Pais" value={user.country} />
          <InfoRow label="Ciudad" value={user.city} />
          <InfoRow label="Direccion" value={user.address} />
        </View>

        {/* telefono local */}
        <View style={styles.phoneBox}>
          <Text style={styles.phoneTitle}>Telefono local</Text>
          <TextInput
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setPhoneError('');
              setSavedMessage('');
            }}
            placeholder="Telefono"
            keyboardType="phone-pad"
            style={[styles.input, phoneError ? styles.inputError : null]}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          {savedMessage ? <Text style={styles.savedText}>{savedMessage}</Text> : null}
          <Pressable style={styles.saveButton} onPress={savePhone}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  backText: {
    color: '#101828',
    fontWeight: '700',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    padding: 16,
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  message: {
    marginTop: 6,
    color: '#667085',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    padding: 14,
    marginTop: 14,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  label: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    color: '#101828',
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0B6B63',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  phoneBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    padding: 14,
    marginTop: 14,
  },
  phoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#101828',
  },
  inputError: {
    borderColor: '#B42318',
  },
  errorText: {
    marginTop: 6,
    color: '#B42318',
    fontSize: 12,
  },
  savedText: {
    marginTop: 6,
    color: '#0B6B63',
    fontSize: 12,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#0B6B63',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
