import { Colors } from '@/components/tokens';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.salatText, 
        tabBarInactiveTintColor: Colors.GreenPlaceHolder,
        tabBarStyle: {
          backgroundColor: Colors.DarkGreenBack, 
          borderTopWidth: 1,
          borderTopColor: Colors.GreenInput,
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="ponds"
        options={{
          title: 'Пруды',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="water" 
              size={24} 
              color={focused ? Colors.salatText : Colors.GreenPlaceHolder} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Финансы',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="cash" 
              size={24} 
              color={focused ? Colors.salatText : Colors.GreenPlaceHolder} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="person" 
              size={24} 
              color={focused ? Colors.salatText : Colors.GreenPlaceHolder} 
            />
          ),
        }}
      />
    </Tabs>
  );
}