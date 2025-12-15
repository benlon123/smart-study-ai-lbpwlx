
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Superwall from 'expo-superwall';
import { useAuth } from './AuthContext';

interface SuperwallContextType {
  isInitialized: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const SuperwallContext = createContext<SuperwallContextType | undefined>(undefined);

export const useSuperwall = () => {
  const context = useContext(SuperwallContext);
  if (!context) {
    throw new Error('useSuperwall must be used within a SuperwallProvider');
  }
  return context;
};

export const SuperwallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    initializeSuperwall();
  }, []);

  const initializeSuperwall = async () => {
    try {
      console.log('Initializing Superwall...');
      
      // Configure Superwall with your API key
      // Note: Replace 'YOUR_SUPERWALL_API_KEY' with your actual API key from the Superwall dashboard
      // Get your API key from: https://superwall.com/dashboard
      await Superwall.configure({
        apiKey: 'YOUR_SUPERWALL_API_KEY', // TODO: Replace with your actual Superwall API key
      });

      // Set user attributes if logged in
      if (user) {
        await Superwall.setUserAttributes({
          userId: user.id,
          email: user.email,
          name: user.name,
          isPremium: user.isPremium,
        });
      }

      // Listen for purchase events
      Superwall.addEventListener('purchase', handlePurchaseSuccess);
      Superwall.addEventListener('restore', handleRestoreSuccess);
      Superwall.addEventListener('purchaseFailed', handlePurchaseFailed);

      setIsInitialized(true);
      console.log('Superwall initialized successfully');
    } catch (error) {
      console.error('Error initializing Superwall:', error);
      // Set initialized to true anyway to allow testing
      setIsInitialized(true);
    }
  };

  const handlePurchaseSuccess = async (event: any) => {
    console.log('Purchase successful:', event);
    
    // Grant premium access to the user
    if (user) {
      updateUser({ isPremium: true });
      
      Alert.alert(
        'Welcome to Premium! 🎉',
        'You now have access to all premium features including unlimited lessons, advanced AI explanations, exam simulator, and more!',
        [{ text: 'Get Started', style: 'default' }]
      );
    }
  };

  const handleRestoreSuccess = async (event: any) => {
    console.log('Restore successful:', event);
    
    // Check if user has active premium subscription
    if (event.hasPremium && user) {
      updateUser({ isPremium: true });
      
      Alert.alert(
        'Purchases Restored',
        'Your premium access has been restored successfully!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'No Purchases Found',
        'No previous purchases were found to restore.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePurchaseFailed = (event: any) => {
    console.error('Purchase failed:', event);
    
    if (event.error?.code !== 'userCancelled') {
      Alert.alert(
        'Purchase Failed',
        'There was an error processing your purchase. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const purchasePremium = async () => {
    try {
      if (!isInitialized) {
        Alert.alert(
          'Not Ready',
          'Payment system is still initializing. Please try again in a moment.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Initiating purchase for product: SmartstudyPremium');

      // Register the paywall and trigger purchase
      // The product ID "SmartstudyPremium" should match your App Store Connect in-app purchase ID
      // Make sure you have:
      // 1. Created the in-app purchase in App Store Connect with ID: SmartstudyPremium
      // 2. Configured the product in your Superwall dashboard
      // 3. Linked the product to a paywall in Superwall
      await Superwall.register('premium_paywall', {
        params: {
          productId: 'SmartstudyPremium',
        },
      });

      console.log('Purchase flow initiated successfully');

    } catch (error: any) {
      console.error('Error purchasing premium:', error);
      
      if (error.code === 'userCancelled' || error.message?.includes('cancel')) {
        console.log('User cancelled the purchase');
        // Don't show error for user cancellation
        return;
      }
      
      Alert.alert(
        'Purchase Error',
        'Unable to complete the purchase. Please check your payment method and try again.\n\nMake sure you have:\n- A valid payment method in your Apple ID\n- An active internet connection\n- The latest version of iOS',
        [{ text: 'OK' }]
      );
    }
  };

  const restorePurchases = async () => {
    try {
      if (!isInitialized) {
        Alert.alert(
          'Not Ready',
          'Payment system is still initializing. Please try again in a moment.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Restoring purchases...');
      
      // Restore purchases through Superwall
      await Superwall.restorePurchases();
      
      console.log('Restore purchases completed');
      
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert(
        'Restore Error',
        'Unable to restore purchases. Please try again or contact support if the issue persists.',
        [{ text: 'OK' }]
      );
    }
  };

  // Update user attributes when user changes
  useEffect(() => {
    if (isInitialized && user) {
      Superwall.setUserAttributes({
        userId: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
      }).catch(error => {
        console.error('Error updating user attributes:', error);
      });
    }
  }, [user, isInitialized]);

  return (
    <SuperwallContext.Provider
      value={{
        isInitialized,
        purchasePremium,
        restorePurchases,
      }}
    >
      {children}
    </SuperwallContext.Provider>
  );
};
