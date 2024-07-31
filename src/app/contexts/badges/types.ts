export type Badges = {
  id: string,
  title: string
  description: string
  imageUrl: string | null
  earnedBy: string[]
}

export type BadgesList = {
  badges: Badges[];
  badgesCount: number;
}

export type BadgesContextType= {
  data: BadgesList;
  isLoading: boolean;
  isError: boolean;
  registerBadge: (formData: any) => Promise<any>;
}