export type Badge = {
  id: string,
  title: string
  description: string
  imageUrl: string | null
  earnedBy: string[]
}

export type BadgesList = {
  badges: Badge[];
  badgesCount: number;
}

export type BadgesContextType= {
  data: BadgesList;
  isLoading: boolean;
  isError: boolean;
  registerBadge: (formData: any) => Promise<any>;
  deleteBadge: (id: string) => Promise<any>;
  updateBadge: ({id, formData}:{id: string, formData: any}) => Promise<any>;
}