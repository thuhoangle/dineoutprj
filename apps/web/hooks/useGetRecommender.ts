import { useState } from "react";
import { supabase } from '@/utils';
import { toastHelper } from "@/components";
import { RecommendResult } from "@/services";

export const useGetRecommender = () => {
    const [recommender, setRecommender] = useState<RecommendResult[]>([]);

    const getRecommender = async (userId: string) => {
        const { data, error } = await supabase.rpc('get_recommendations_for_user', {
            customer_id: userId,
        });
        if (error) {
            console.log(error.message);
            return [];
        } else {
            setRecommender(data);
        }
    }

    return {
        recommender,
        getRecommender,
    }
}
