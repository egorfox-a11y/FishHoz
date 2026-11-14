import { Platform } from 'react-native';

export const LOCAL_IP = '192.168.0.107'; 

export const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000/api/v1'
  : `http://${LOCAL_IP}:3000/api/v1`;