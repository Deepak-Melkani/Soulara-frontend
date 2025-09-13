export interface MatchUser {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
  };
  occupation?: string;
  education?: string;
  interests?: string[];
  compatibility?: number;
  distance?: number;
}

export interface MatchCardProps {
  user: MatchUser;
  onLike?: (userId: string) => void;
  onPass?: (userId: string) => void;
  onUserClick?: (userId: string) => void;
  className?: string;
}