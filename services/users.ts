import { RandomUserResponse, User } from '@/types/user';

const API_URL = 'https://randomuser.me/api/?results=30&seed=sipy';

function formatUser(user: RandomUserResponse['results'][0]): User {
  // datos para las cards y detalle
  return {
    id: user.login.uuid,
    name: user.name.first,
    lastName: user.name.last,
    email: user.email,
    phone: user.phone,
    age: user.dob.age,
    photo: user.picture.large,
    country: user.location.country,
    city: user.location.city,
    address: `${user.location.street.number} ${user.location.street.name}`,
  };
}

export async function getUsers() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los usuarios');
  }

  const data: RandomUserResponse = await response.json();
  const users = data.results.map(formatUser);

  // orden por apellido
  users.sort((a, b) => a.lastName.localeCompare(b.lastName));

  return users;
}
