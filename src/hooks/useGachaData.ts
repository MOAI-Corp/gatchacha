import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { GachaTemplate, GachaItem, createGachaItems } from '@/lib/gacha';
import { gachaTemplates } from '@/lib/templates';

export interface DatabaseTemplate {
  id: string;
  name: string;
  theme: string;
  tier1_count: number;
  tier2_count: number;
  tier3_count: number;
  tier4_count: number;
  tier5_count: number;
  is_system: boolean;
  user_id?: string;
}

export function useGachaData() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<GachaTemplate[]>(gachaTemplates);
  const [loading, setLoading] = useState(false);

  // Load templates from database
  const loadTemplates = async () => {
    if (!user) {
      setTemplates(gachaTemplates);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gacha_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const dbTemplates: GachaTemplate[] = data.map((template: DatabaseTemplate) => ({
        id: template.id,
        name: template.name,
        theme: template.theme,
        items: createGachaItems(
          template.tier1_count,
          template.tier2_count,
          template.tier3_count,
          template.tier4_count,
          template.tier5_count
        )
      }));

      setTemplates(dbTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(gachaTemplates);
    } finally {
      setLoading(false);
    }
  };

  // Save gacha result
  const saveGachaResult = async (templateId: string, templateName: string, item: GachaItem) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gacha_results')
        .insert({
          user_id: user.id,
          template_id: templateId,
          template_name: templateName,
          item_name: item.name,
          tier: item.tier
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving gacha result:', error);
    }
  };

  // Get gacha history
  const getGachaHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('gacha_results')
        .select('*')
        .eq('user_id', user.id)
        .order('drawn_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading gacha history:', error);
      return [];
    }
  };

  // Create custom template
  const createTemplate = async (
    name: string,
    theme: string,
    tier1: number,
    tier2: number,
    tier3: number,
    tier4: number,
    tier5: number,
    isPublic: boolean = false
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('gacha_templates')
        .insert({
          user_id: user.id,
          name,
          theme,
          tier1_count: tier1,
          tier2_count: tier2,
          tier3_count: tier3,
          tier4_count: tier4,
          tier5_count: tier5,
          is_public: isPublic,
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;

      const newTemplate: GachaTemplate = {
        id: data.id,
        name: data.name,
        theme: data.theme,
        items: createGachaItems(tier1, tier2, tier3, tier4, tier5)
      };

      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [user]);

  return {
    templates,
    loading,
    saveGachaResult,
    getGachaHistory,
    createTemplate,
    loadTemplates
  };
}