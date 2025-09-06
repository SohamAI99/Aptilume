import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, placeholder = "Search tests, companies, or topics..." }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        <Icon
          name="Search"
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-3 z-10">
          <div className="p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Icon name="Search" size={14} />
              <span>Searching for "{searchQuery}"</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Press Enter to search or continue typing...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;