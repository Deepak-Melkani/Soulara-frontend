import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { MatchUser } from '../app/(main)/(matches)/find-match/types';
import { MatchFilters } from '../app/(main)/(matches)/find-match/types/filter.types';

interface FetchUsersResponse {
  success: boolean;
  message: string;
  data: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const useMatchFinder = () => {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MatchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const calculateAge = (dob: string | Date): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const transformBackendUser = (backendUser: any): MatchUser => {
    return {
      _id: backendUser._id,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      age: backendUser.dob ? calculateAge(backendUser.dob) : 0,
      profilePicture: backendUser.profilePicture || backendUser.avatar,
      bio: backendUser.bio,
      location: {
        city: backendUser.location?.city,
        country: backendUser.location?.country,
      },
      occupation: backendUser.occupation,
      education: backendUser.education,
      interests: backendUser.interests || [],
      // These would come from a matching algorithm in a real app
      compatibility: Math.floor(Math.random() * 30) + 70, // 70-99%
      distance: Math.floor(Math.random() * 50) + 1, // 1-50 km
    };
  };

  const buildQueryString = (filters: MatchFilters, page: number, limit: number): string => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filters to query params
    if (filters.ageRange) {
      params.append('ageMin', filters.ageRange.min.toString());
      params.append('ageMax', filters.ageRange.max.toString());
    }

    if (filters.gender) {
      params.append('gender', filters.gender);
    }

    if (filters.genderPreference) {
      params.append('genderPreference', filters.genderPreference);
    }

    if (filters.lookingFor) {
      params.append('lookingFor', filters.lookingFor);
    }

    if (filters.heightRange) {
      params.append('heightMin', filters.heightRange.min.toString());
      params.append('heightMax', filters.heightRange.max.toString());
    }

    if (filters.education && filters.education.length > 0) {
      params.append('education', filters.education.join(','));
    }

    if (filters.smoking && filters.smoking.length > 0) {
      params.append('smoking', filters.smoking.join(','));
    }

    if (filters.drinking && filters.drinking.length > 0) {
      params.append('drinking', filters.drinking.join(','));
    }

    if (filters.children && filters.children.length > 0) {
      params.append('children', filters.children.join(','));
    }

    if (filters.relationshipStatus && filters.relationshipStatus.length > 0) {
      params.append('relationshipStatus', filters.relationshipStatus.join(','));
    }

    if (filters.interests && filters.interests.length > 0) {
      params.append('interests', filters.interests.join(','));
    }

    if (filters.religion) {
      params.append('religion', filters.religion);
    }

    if (filters.languages && filters.languages.length > 0) {
      params.append('languages', filters.languages.join(','));
    }

    if (filters.isVerified !== undefined) {
      params.append('isVerified', filters.isVerified.toString());
    }

    if (filters.lastActiveWithin) {
      params.append('lastActiveWithin', filters.lastActiveWithin.toString());
    }

    if (filters.minProfileCompleteness !== undefined) {
      params.append('minProfileCompleteness', filters.minProfileCompleteness.toString());
    }

    if (filters.location) {
      if (filters.location.city) {
        params.append('city', filters.location.city);
      }
      if (filters.location.country) {
        params.append('country', filters.location.country);
      }
      if (filters.location.radius) {
        params.append('radius', filters.location.radius.toString());
      }
    }

    return params.toString();
  };

  const fetchMatches = async (page: number = 1, limit: number = 10, currentFilters: MatchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryString(currentFilters, page, limit);
      const response = await apiRequest<FetchUsersResponse>(
        `/users/all?${queryString}`,
        {
          method: 'GET',
        }
      );

      if (response.success) {
        const transformedUsers = response.data.map(transformBackendUser);
        
        // For pagination, replace or append based on page
        if (page === 1) {
          setMatches(transformedUsers);
        } else {
          setMatches(prev => [...prev, ...transformedUsers]);
        }

        setPagination({
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasNextPage && !loading) {
      fetchMatches(pagination.page + 1, pagination.limit, filters);
    }
  };

  const refresh = () => {
    fetchMatches(1, pagination.limit, filters);
  };

  const applyFilters = (newFilters: MatchFilters) => {
    setFilters(newFilters);
    fetchMatches(1, pagination.limit, newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: MatchFilters = {};
    setFilters(emptyFilters);
    fetchMatches(1, pagination.limit, emptyFilters);
  };

  const handleLike = async (userId: string) => {
    try {
      // TODO: Implement like API call
      console.log('Liked user:', userId);
      
      // Remove user from matches locally for now
      setMatches(prev => prev.filter(match => match._id !== userId));
      
      // Here you would make an API call to record the like
      // await api.post('/matches/like', { userId });
    } catch (err) {
      console.error('Error liking user:', err);
    }
  };

  const handlePass = async (userId: string) => {
    try {
      // TODO: Implement pass API call
      console.log('Passed user:', userId);
      
      // Remove user from matches locally for now
      setMatches(prev => prev.filter(match => match._id !== userId));
      
      // Here you would make an API call to record the pass
      // await api.post('/matches/pass', { userId });
    } catch (err) {
      console.error('Error passing user:', err);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    filters,
    pagination,
    fetchMatches,
    loadMore,
    refresh,
    handleLike,
    handlePass,
    applyFilters,
    clearFilters,
  };
};