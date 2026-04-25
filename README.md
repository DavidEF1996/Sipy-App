# Davidegas- Sipy App

Aplicacion movil hecha para listar usuarios, manejar favoritos y editar un telefono local.

## Stack usado

- React Native
- Expo
- TypeScript
- Expo Router
- Tanstack React Query
- React Context
- StyleSheet

## API

Se usa Random User API con seed fijo:

```txt
https://randomuser.me/api/?results=30&seed=sipy
```

## Instalacion

```bash
npm install
```

## Ejecutar app

```bash
npm run start
```

Probar el app en un emulador de android o en un dispositivo físico

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Funcionalidades

- Listado de usuarios ordenada por apellidos y en cards
- Pull to refresh.
- Loading, error y mensaje cuando no hay datos.
- Favoritos en una lista horizontal, agregar y quitar favoritos desde la lista
- Seleccion de usuarios con checkbox.
- Opcion para agregar seleccion a favoritos.
- Opcion para seleccionar todos.
- Pantalla de detalle por usuario.
- Editar telefono local.

## Regla de seleccion

Los usuarios se muestran ordenados por apellido.

Para seleccionar usuarios se debe seguir ese mismo orden. No se puede saltar un usuario de la lista.    

## Estructura

```txt
app/        pantallas
contexts/   estado local
hooks/      hooks de la app
services/   consumo de API
types/      tipos de TypeScript
```
