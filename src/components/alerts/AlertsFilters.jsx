import React from 'react';
import { AlertService } from '../../services/alertService';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiX } = FiIcons;

/**
 * Filters component for alerts with org context
 */
const AlertsFilters = ({ 
  filters, 
  onFiltersChange, 
  isProductAdmin, 
  selectedOrgId, 
  onOrgChange 
}) => {
  const filterOptions = AlertService.getFilterOptions();

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({
      severity: undefined,
      status: undefined,
      source: undefined,
      cloud_provider: undefined,
      search: undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search alerts..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            value={filters.severity || ''}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All severities</option>
            {filterOptions.severity.map(severity => (
              <option key={severity} value={severity}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {filterOptions.status.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            value={filters.source || ''}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All sources</option>
            {filterOptions.source.map(source => (
              <option key={source} value={source}>
                {source.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Cloud Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cloud Provider
          </label>
          <select
            value={filters.cloud_provider || ''}
            onChange={(e) => handleFilterChange('cloud_provider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All providers</option>
            {filterOptions.cloud_provider.map(provider => (
              <option key={provider} value={provider}>
                {provider.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Admin Org Selector */}
      {isProductAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization (Product Admin)
              </label>
              <select
                value={selectedOrgId || ''}
                onChange={(e) => onOrgChange(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select organization</option>
                {/* This would be populated from an orgs API call */}
                <option value="org1">Organization 1</option>
                <option value="org2">Organization 2</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsFilters;