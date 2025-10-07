import React from 'react';
import { Filter, Grid3X3, Star, Zap, Smile, Meh, Frown, Clock, TrendingUp, X } from 'lucide-react';

const FilterChips = ({ activeFilters, onFilterChange }) => {
  const filterOptions = [
    { id: 'all', label: 'All Tests', icon: <Grid3X3 size={14} /> },
    { id: 'faang', label: 'FAANG', icon: <Star size={14} /> },
    { id: 'mango', label: 'Mango', icon: <Zap size={14} /> },
    { id: 'easy', label: 'Easy', icon: <Smile size={14} /> },
    { id: 'medium', label: 'Medium', icon: <Meh size={14} /> },
    { id: 'hard', label: 'Hard', icon: <Frown size={14} /> },
    { id: 'recent', label: 'Recent', icon: <Clock size={14} /> },
    { id: 'popular', label: 'Popular', icon: <TrendingUp size={14} /> }
  ];

  const handleFilterClick = (filterId) => {
    if (filterId === 'all') {
      onFilterChange([]);
    } else {
      const newFilters = activeFilters?.includes(filterId)
        ? activeFilters?.filter(f => f !== filterId)
        : [...activeFilters, filterId];
      onFilterChange(newFilters);
    }
  };

  const removeFilter = (filterId) => {
    const newFilters = activeFilters?.filter(f => f !== filterId);
    onFilterChange(newFilters);
  };

  const isActive = (filterId) => {
    if (filterId === 'all') {
      return activeFilters?.length === 0;
    }
    return activeFilters?.includes(filterId);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filter Tests</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filterOptions?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => handleFilterClick(filter?.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive(filter?.id)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter?.icon}
            <span>{filter?.label}</span>
          </button>
        ))}
      </div>
      {activeFilters?.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-1">
            {activeFilters?.map((filterId) => {
              const filter = filterOptions?.find(f => f?.id === filterId);
              return (
                <span
                  key={filterId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {filter?.label}
                  <button
                    onClick={() => removeFilter(filterId)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X size={10} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterChips;