import { useMemo } from 'react';
import type { AudienceComposition, Platform, PlatformConfig, Campaign, ForecastMonth } from '../data/types';
import { generateForecast, getTotalProjectedGrowth, getProjectedFollowers } from '../utils/forecastEngine';

export function useForecast(
  composition: AudienceComposition,
  platformConfigs: Record<Platform, PlatformConfig>,
  campaigns: Campaign[]
) {
  const forecast = useMemo(
    () => generateForecast(composition, platformConfigs, campaigns),
    [composition, platformConfigs, campaigns]
  );

  const totalGrowth = useMemo(() => getTotalProjectedGrowth(forecast), [forecast]);
  const projectedFollowers = useMemo(() => getProjectedFollowers(forecast), [forecast]);

  return { forecast, totalGrowth, projectedFollowers };
}
