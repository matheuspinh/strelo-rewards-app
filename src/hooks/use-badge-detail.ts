import { useQuery } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { Badge } from "src/app/contexts/badges/types";

export const useBadge = (badgeId: string) => useQuery({
  queryKey: ['badge', badgeId],
  enabled: !!badgeId,
  queryFn: async () => {
    const res = await axios.get(`${endpoints.badges.detail}/${badgeId}`);
    return res.data as Badge;
  }
})