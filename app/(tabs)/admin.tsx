
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, getAllUsers, findUserByEmailOrName, grantPremiumToUser, revokePremiumFromUser } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useSettings } from '@/contexts/SettingsContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { User } from '@/types/lesson';

type AdminTab = 'users' | 'premium' | 'notifications' | 'analytics' | 'settings';

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { sendNotification, appSettings, updateAppSettings } = useAdmin();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  
  // User management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Premium grant
  const [grantSearchTerm, setGrantSearchTerm] = useState('');
  const [isPermanent, setIsPermanent] = useState(true);
  const [expiryDays, setExpiryDays] = useState('30');
  const [grantReason, setGrantReason] = useState('');
  
  // Notifications
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'announcement' | 'update' | 'reminder' | 'alert'>('announcement');
  const [notifTarget, setNotifTarget] = useState<'all' | 'premium' | 'free'>('all');
  
  // App settings
  const [aiLimit, setAiLimit] = useState(appSettings.aiGenerationLimit.toString());
  const [taskCount, setTaskCount] = useState(appSettings.defaultTaskCount.toString());
  const [maintenanceMode, setMaintenanceMode] = useState(appSettings.maintenanceMode);

  if (!isAdmin) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="lock.shield"
          android_material_icon_name="admin-panel-settings"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Access Denied
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          This page is only accessible to administrators
        </Text>
      </View>
    );
  }

  const handleSearchUsers = () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }
    
    const foundUser = findUserByEmailOrName(searchTerm.trim());
    if (foundUser) {
      setSelectedUser(foundUser);
    } else {
      Alert.alert('Not Found', 'No user found with that email or name');
      setSelectedUser(null);
    }
  };

  const handleGrantPremium = () => {
    if (!grantSearchTerm.trim()) {
      Alert.alert('Error', 'Please enter a user email or name');
      return;
    }
    
    const foundUser = findUserByEmailOrName(grantSearchTerm.trim());
    if (!foundUser) {
      Alert.alert('Not Found', 'No user found with that email or name');
      return;
    }
    
    if (foundUser.isPremium) {
      Alert.alert('Already Premium', 'This user already has premium access');
      return;
    }
    
    const expiresAt = isPermanent ? undefined : new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000);
    
    const success = grantPremiumToUser(
      foundUser.id,
      user!.email,
      isPermanent,
      expiresAt,
      grantReason.trim() || undefined
    );
    
    if (success) {
      Alert.alert(
        'Success',
        `Premium access granted to ${foundUser.name} (${foundUser.email})${isPermanent ? ' permanently' : ` for ${expiryDays} days`}`
      );
      setGrantSearchTerm('');
      setGrantReason('');
    } else {
      Alert.alert('Error', 'Failed to grant premium access');
    }
  };

  const handleRevokePremium = (userId: string, userName: string) => {
    Alert.alert(
      'Revoke Premium',
      `Are you sure you want to revoke premium access from ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            const success = revokePremiumFromUser(userId);
            if (success) {
              Alert.alert('Success', 'Premium access revoked');
              if (selectedUser?.id === userId) {
                setSelectedUser(null);
              }
            } else {
              Alert.alert('Error', 'Failed to revoke premium access');
            }
          },
        },
      ]
    );
  };

  const handleSendNotification = () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      Alert.alert('Error', 'Please enter both title and message');
      return;
    }
    
    sendNotification(notifTitle, notifMessage, notifType, notifTarget);
    Alert.alert('Success', `Notification sent to ${notifTarget} users`);
    setNotifTitle('');
    setNotifMessage('');
  };

  const handleUpdateAppSettings = () => {
    const newLimit = parseInt(aiLimit);
    const newTaskCount = parseInt(taskCount);
    
    if (isNaN(newLimit) || newLimit < 1) {
      Alert.alert('Error', 'AI generation limit must be a positive number');
      return;
    }
    
    if (isNaN(newTaskCount) || newTaskCount < 1) {
      Alert.alert('Error', 'Task count must be a positive number');
      return;
    }
    
    updateAppSettings({
      aiGenerationLimit: newLimit,
      defaultTaskCount: newTaskCount,
      maintenanceMode,
    });
    
    Alert.alert('Success', 'App settings updated');
  };

  const allUsers = getAllUsers();
  const premiumUsers = allUsers.filter(u => u.isPremium);
  const freeUsers = allUsers.filter(u => !u.isPremium);

  const containerStyle = settings.theme.mode === 'dark'
    ? [commonStyles.container, styles.darkContainer]
    : commonStyles.container;

  const textColor = settings.theme.mode === 'dark' ? '#FFFFFF' : colors.text;
  const cardBg = settings.theme.mode === 'dark' ? '#1a1a1a' : colors.card;

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="Search by email or name..."
          placeholderTextColor={colors.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={buttonStyles.primary} onPress={handleSearchUsers}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={18}
            color="#FFFFFF"
          />
          <Text style={buttonStyles.textWhite}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: textColor }]}>{allUsers.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{premiumUsers.length}</Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.textSecondary }]}>{freeUsers.length}</Text>
          <Text style={styles.statLabel}>Free</Text>
        </View>
      </View>

      {selectedUser && (
        <View style={[styles.userDetailCard, { backgroundColor: cardBg }]}>
          <View style={styles.userDetailHeader}>
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account-circle"
              size={48}
              color={colors.primary}
            />
            <View style={styles.userDetailInfo}>
              <Text style={[styles.userDetailName, { color: textColor }]}>{selectedUser.name}</Text>
              <Text style={styles.userDetailEmail}>{selectedUser.email}</Text>
            </View>
            {selectedUser.isPremium && (
              <View style={styles.premiumBadge}>
                <IconSymbol
                  ios_icon_name="crown.fill"
                  android_material_icon_name="workspace-premium"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            )}
          </View>

          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, { color: textColor }]}>Signup Date:</Text>
            <Text style={[styles.userDetailValue, { color: textColor }]}>
              {new Date(selectedUser.signupDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, { color: textColor }]}>Status:</Text>
            <Text style={[styles.userDetailValue, { color: selectedUser.isPremium ? colors.success : colors.textSecondary }]}>
              {selectedUser.isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>

          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, { color: textColor }]}>Streak:</Text>
            <Text style={[styles.userDetailValue, { color: textColor }]}>{selectedUser.streak} days</Text>
          </View>

          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, { color: textColor }]}>Points:</Text>
            <Text style={[styles.userDetailValue, { color: textColor }]}>{selectedUser.points}</Text>
          </View>

          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, { color: textColor }]}>Lessons:</Text>
            <Text style={[styles.userDetailValue, { color: textColor }]}>{selectedUser.lessons?.length || 0}</Text>
          </View>

          {selectedUser.isPremium && selectedUser.premiumGrant && (
            <View style={styles.premiumGrantInfo}>
              <Text style={[styles.premiumGrantTitle, { color: textColor }]}>Premium Grant Details:</Text>
              <Text style={styles.premiumGrantText}>
                Granted by: {selectedUser.premiumGrant.grantedBy}
              </Text>
              <Text style={styles.premiumGrantText}>
                Granted on: {new Date(selectedUser.premiumGrant.grantedAt).toLocaleDateString()}
              </Text>
              <Text style={styles.premiumGrantText}>
                Type: {selectedUser.premiumGrant.isPermanent ? 'Permanent' : 'Temporary'}
              </Text>
              {selectedUser.premiumGrant.expiresAt && (
                <Text style={styles.premiumGrantText}>
                  Expires: {new Date(selectedUser.premiumGrant.expiresAt).toLocaleDateString()}
                </Text>
              )}
              {selectedUser.premiumGrant.reason && (
                <Text style={styles.premiumGrantText}>
                  Reason: {selectedUser.premiumGrant.reason}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.userListContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>All Users ({allUsers.length})</Text>
        {allUsers.map((u, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.userListItem, { backgroundColor: cardBg }]}
            onPress={() => setSelectedUser(u)}
          >
            <View style={styles.userListLeft}>
              <IconSymbol
                ios_icon_name="person.circle"
                android_material_icon_name="account-circle"
                size={32}
                color={colors.primary}
              />
              <View style={styles.userListInfo}>
                <Text style={[styles.userListName, { color: textColor }]}>{u.name}</Text>
                <Text style={styles.userListEmail}>{u.email}</Text>
              </View>
            </View>
            {u.isPremium && (
              <View style={[styles.premiumBadge, { width: 32, height: 32 }]}>
                <IconSymbol
                  ios_icon_name="crown.fill"
                  android_material_icon_name="workspace-premium"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPremium = () => (
    <View style={styles.tabContent}>
      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Grant Premium Access</Text>
        
        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="User email or name..."
          placeholderTextColor={colors.textSecondary}
          value={grantSearchTerm}
          onChangeText={setGrantSearchTerm}
        />

        <View style={styles.premiumTypeContainer}>
          <TouchableOpacity
            style={[
              styles.premiumTypeButton,
              isPermanent && styles.premiumTypeButtonActive,
            ]}
            onPress={() => setIsPermanent(true)}
          >
            <Text style={[
              styles.premiumTypeText,
              isPermanent && styles.premiumTypeTextActive,
              { color: isPermanent ? '#FFFFFF' : textColor }
            ]}>
              Permanent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.premiumTypeButton,
              !isPermanent && styles.premiumTypeButtonActive,
            ]}
            onPress={() => setIsPermanent(false)}
          >
            <Text style={[
              styles.premiumTypeText,
              !isPermanent && styles.premiumTypeTextActive,
              { color: !isPermanent ? '#FFFFFF' : textColor }
            ]}>
              Temporary
            </Text>
          </TouchableOpacity>
        </View>

        {!isPermanent && (
          <TextInput
            style={[commonStyles.input, { color: textColor }]}
            placeholder="Expiry days (e.g., 30)"
            placeholderTextColor={colors.textSecondary}
            value={expiryDays}
            onChangeText={setExpiryDays}
            keyboardType="number-pad"
          />
        )}

        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="Reason (optional)"
          placeholderTextColor={colors.textSecondary}
          value={grantReason}
          onChangeText={setGrantReason}
          multiline
        />

        <TouchableOpacity style={buttonStyles.primary} onPress={handleGrantPremium}>
          <IconSymbol
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace-premium"
            size={18}
            color="#FFFFFF"
          />
          <Text style={buttonStyles.textWhite}>Grant Premium</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Premium Users ({premiumUsers.length})</Text>
        
        {premiumUsers.map((u, index) => (
          <View key={index} style={[styles.premiumUserCard, { backgroundColor: colors.background }]}>
            <View style={styles.premiumUserInfo}>
              <Text style={[styles.premiumUserName, { color: textColor }]}>{u.name}</Text>
              <Text style={styles.premiumUserEmail}>{u.email}</Text>
              {u.premiumGrant && (
                <Text style={styles.premiumUserGrant}>
                  {u.premiumGrant.isPermanent ? 'Permanent' : `Expires: ${u.premiumGrant.expiresAt ? new Date(u.premiumGrant.expiresAt).toLocaleDateString() : 'N/A'}`}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[buttonStyles.outline, { borderColor: colors.error }]}
              onPress={() => handleRevokePremium(u.id, u.name)}
            >
              <Text style={[buttonStyles.text, { color: colors.error }]}>Revoke</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.statsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{premiumUsers.length}</Text>
          <Text style={styles.statLabel}>Premium Users</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {Math.round((premiumUsers.length / Math.max(allUsers.length, 1)) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Conversion Rate</Text>
        </View>
      </View>
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.tabContent}>
      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Send Notification</Text>
        
        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="Notification title..."
          placeholderTextColor={colors.textSecondary}
          value={notifTitle}
          onChangeText={setNotifTitle}
        />

        <TextInput
          style={[commonStyles.input, { color: textColor, minHeight: 100 }]}
          placeholder="Notification message..."
          placeholderTextColor={colors.textSecondary}
          value={notifMessage}
          onChangeText={setNotifMessage}
          multiline
        />

        <Text style={[styles.label, { color: textColor }]}>Type:</Text>
        <View style={styles.notifTypeContainer}>
          {(['announcement', 'update', 'reminder', 'alert'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.notifTypeButton,
                notifType === type && styles.notifTypeButtonActive,
              ]}
              onPress={() => setNotifType(type)}
            >
              <Text style={[
                styles.notifTypeText,
                notifType === type && styles.notifTypeTextActive,
                { color: notifType === type ? '#FFFFFF' : textColor }
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: textColor }]}>Target:</Text>
        <View style={styles.notifTargetContainer}>
          {(['all', 'premium', 'free'] as const).map((target) => (
            <TouchableOpacity
              key={target}
              style={[
                styles.notifTargetButton,
                notifTarget === target && styles.notifTargetButtonActive,
              ]}
              onPress={() => setNotifTarget(target)}
            >
              <Text style={[
                styles.notifTargetText,
                notifTarget === target && styles.notifTargetTextActive,
                { color: notifTarget === target ? '#FFFFFF' : textColor }
              ]}>
                {target.charAt(0).toUpperCase() + target.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={buttonStyles.primary} onPress={handleSendNotification}>
          <IconSymbol
            ios_icon_name="paperplane.fill"
            android_material_icon_name="send"
            size={18}
            color="#FFFFFF"
          />
          <Text style={buttonStyles.textWhite}>Send Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <View style={[styles.statsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: textColor }]}>{allUsers.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{premiumUsers.length}</Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {Math.round((premiumUsers.length / Math.max(allUsers.length, 1)) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Conversion</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>User Activity</Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Average Streak: {Math.round(allUsers.reduce((sum, u) => sum + u.streak, 0) / Math.max(allUsers.length, 1))} days
        </Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Average Points: {Math.round(allUsers.reduce((sum, u) => sum + u.points, 0) / Math.max(allUsers.length, 1))}
        </Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Total Lessons Created: {allUsers.reduce((sum, u) => sum + (u.lessons?.length || 0), 0)}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Premium Analytics</Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Premium Users: {premiumUsers.length}
        </Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Free Users: {freeUsers.length}
        </Text>
        <Text style={[styles.analyticsText, { color: textColor }]}>
          Conversion Rate: {Math.round((premiumUsers.length / Math.max(allUsers.length, 1)) * 100)}%
        </Text>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>App Settings</Text>
        
        <Text style={[styles.label, { color: textColor }]}>AI Generation Limit (per user):</Text>
        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="50"
          placeholderTextColor={colors.textSecondary}
          value={aiLimit}
          onChangeText={setAiLimit}
          keyboardType="number-pad"
        />

        <Text style={[styles.label, { color: textColor }]}>Default Task Count:</Text>
        <TextInput
          style={[commonStyles.input, { color: textColor }]}
          placeholder="10"
          placeholderTextColor={colors.textSecondary}
          value={taskCount}
          onChangeText={setTaskCount}
          keyboardType="number-pad"
        />

        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: textColor }]}>Maintenance Mode:</Text>
          <Switch
            value={maintenanceMode}
            onValueChange={setMaintenanceMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={buttonStyles.primary} onPress={handleUpdateAppSettings}>
          <IconSymbol
            ios_icon_name="checkmark.circle.fill"
            android_material_icon_name="check-circle"
            size={18}
            color="#FFFFFF"
          />
          <Text style={buttonStyles.textWhite}>Update Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={containerStyle}>
      <View style={[styles.header, settings.theme.mode === 'dark' && styles.darkHeader]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: textColor }]}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>Welcome, {user?.name}</Text>
          </View>
          <View style={styles.adminBadge}>
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="admin-panel-settings"
              size={20}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBar, { backgroundColor: cardBg }]}
        contentContainerStyle={styles.tabBarContent}
      >
        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'users' && styles.adminTabActive]}
          onPress={() => setActiveTab('users')}
        >
          <IconSymbol
            ios_icon_name="person.2"
            android_material_icon_name="people"
            size={20}
            color={activeTab === 'users' ? colors.primary : colors.textSecondary}
          />
          <Text style={[
            styles.adminTabText,
            activeTab === 'users' && styles.adminTabTextActive,
            { color: activeTab === 'users' ? colors.primary : colors.textSecondary }
          ]}>
            Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'premium' && styles.adminTabActive]}
          onPress={() => setActiveTab('premium')}
        >
          <IconSymbol
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace-premium"
            size={20}
            color={activeTab === 'premium' ? colors.primary : colors.textSecondary}
          />
          <Text style={[
            styles.adminTabText,
            activeTab === 'premium' && styles.adminTabTextActive,
            { color: activeTab === 'premium' ? colors.primary : colors.textSecondary }
          ]}>
            Premium
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'notifications' && styles.adminTabActive]}
          onPress={() => setActiveTab('notifications')}
        >
          <IconSymbol
            ios_icon_name="bell.fill"
            android_material_icon_name="notifications"
            size={20}
            color={activeTab === 'notifications' ? colors.primary : colors.textSecondary}
          />
          <Text style={[
            styles.adminTabText,
            activeTab === 'notifications' && styles.adminTabTextActive,
            { color: activeTab === 'notifications' ? colors.primary : colors.textSecondary }
          ]}>
            Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'analytics' && styles.adminTabActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <IconSymbol
            ios_icon_name="chart.bar.fill"
            android_material_icon_name="analytics"
            size={20}
            color={activeTab === 'analytics' ? colors.primary : colors.textSecondary}
          />
          <Text style={[
            styles.adminTabText,
            activeTab === 'analytics' && styles.adminTabTextActive,
            { color: activeTab === 'analytics' ? colors.primary : colors.textSecondary }
          ]}>
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'settings' && styles.adminTabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <IconSymbol
            ios_icon_name="gearshape.fill"
            android_material_icon_name="settings"
            size={20}
            color={activeTab === 'settings' ? colors.primary : colors.textSecondary}
          />
          <Text style={[
            styles.adminTabText,
            activeTab === 'settings' && styles.adminTabTextActive,
            { color: activeTab === 'settings' ? colors.primary : colors.textSecondary }
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'premium' && renderPremium()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333333',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  adminBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  adminTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderRadius: 12,
  },
  adminTabActive: {
    backgroundColor: colors.primary + '15',
  },
  adminTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminTabTextActive: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  tabContent: {
    gap: 20,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  userDetailCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  userDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userDetailInfo: {
    flex: 1,
  },
  userDetailName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  userDetailEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  premiumBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  userDetailValue: {
    fontSize: 14,
    color: colors.text,
  },
  premiumGrantInfo: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.highlight + '15',
    gap: 4,
  },
  premiumGrantTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  premiumGrantText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userListContainer: {
    gap: 12,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  userListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userListInfo: {
    flex: 1,
  },
  userListName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  userListEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  premiumTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  premiumTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  premiumTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  premiumTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  premiumTypeTextActive: {
    color: '#FFFFFF',
  },
  premiumUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  premiumUserInfo: {
    flex: 1,
  },
  premiumUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  premiumUserEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  premiumUserGrant: {
    fontSize: 12,
    color: colors.highlight,
    marginTop: 4,
  },
  notifTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  notifTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  notifTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  notifTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  notifTypeTextActive: {
    color: '#FFFFFF',
  },
  notifTargetContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  notifTargetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  notifTargetButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  notifTargetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notifTargetTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  analyticsText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
});
