import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import {
  Beach,
  BeachPosition,
  Forecast,
  ForecastProcessingInternalError,
} from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  const beaches: Beach[] = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      userId: 'fake-id',
    },
  ];

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const expectedResponse = [
      {
        time: '2024-02-15T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.E,
            rating: 1,
            time: '2024-02-15T00:00:00+00:00',
            waveHeight: 0.24,
            waveDirection: 179.37,
            swellDirection: 160.04,
            swellHeight: 0.07,
            swellPeriod: 2.94,
            windDirection: 149.14,
            windSpeed: 1.41,
          },
        ],
      },
      {
        time: '2024-02-15T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.E,
            rating: 1,
            time: '2024-02-15T01:00:00+00:00',
            waveHeight: 0.23,
            waveDirection: 178.6,
            swellDirection: 163.52,
            swellHeight: 0.12,
            swellPeriod: 2.97,
            windDirection: 154.39,
            windSpeed: 1.35,
          },
        ],
      },
      {
        time: '2024-02-15T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.E,
            rating: 1,
            time: '2024-02-15T02:00:00+00:00',
            waveHeight: 0.22,
            waveDirection: 177.83,
            swellDirection: 166.99,
            swellHeight: 0.16,
            swellPeriod: 3.01,
            windDirection: 159.63,
            windSpeed: 1.29,
          },
        ],
      },
      {
        time: '2024-02-15T03:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.E,
            rating: 1,
            time: '2024-02-15T03:00:00+00:00',
            waveHeight: 0.21,
            waveDirection: 177.06,
            swellDirection: 170.47,
            swellHeight: 0.21,
            swellPeriod: 3.04,
            windDirection: 164.88,
            windSpeed: 1.23,
          },
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);
    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error Fetching Data'
    );

    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});
