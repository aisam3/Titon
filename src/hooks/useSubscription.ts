import { useState, useEffect } from 'react';
import { subscriptionService, UserSubscription, UsageStats } from '@/services/subscriptionService';
import { supabase } from '@/lib/supabase';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const [subData, usageData] = await Promise.all([
        subscriptionService.getUserPlan(),
        subscriptionService.getUsageStats()
      ]);
      setSubscription(subData);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();

    // Set up real-time listener for profile changes (e.g. upgrades)
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        fetchSubscriptionData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, []);

  const upgrade = async () => {
    const success = await subscriptionService.upgradeToPro();
    if (success) {
      await fetchSubscriptionData();
    }
    return success;
  };

  return {
    subscription,
    usage,
    loading,
    upgrade,
    refresh: fetchSubscriptionData
  };
};
