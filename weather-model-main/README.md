# Weather Model

An interactive global hazard and resilience simulator. Select a natural or
environmental hazard, place it anywhere on the world map, combine multiple
events, and explore modeled impacts on people, power systems, health,
batteries, displacement, air quality, economic activity, and recovery.

> **Important:** Weather Model is an educational scenario sandbox. Its outputs
> are illustrative comparisons—not forecasts, emergency guidance, casualty
> predictions, engineering studies, insurance estimates, or investment advice.

## What you can simulate

- Hurricanes and tropical cyclones
- Blizzards and extreme cold
- Wildfires and smoke
- Heat domes and peak electricity demand
- Floods
- Earthquakes
- Drought and water-constrained generation
- Severe air-pollution events
- Compound events occurring in multiple regions

Try the included presets—such as a Florida hurricane, Alaska blizzard,
California wildfire, China air-quality event, Japan earthquake, Amazon drought,
or Australia heat event—or click anywhere on the map to create your own.

## Resilience controls

The simulator lets users change three mitigation inputs:

- Available grid-battery capacity in GWh
- Emergency medical readiness
- Clean-air and filtration coverage

The results update immediately so strategies can be compared consistently.

## Modeled outputs

- Population exposed
- Customers experiencing power interruption
- Peak grid stress
- Battery energy discharged
- Injury-burden proxy
- Mortality-risk proxy
- Direct economic-disruption proxy
- Temporary displacement
- Population-weighted degraded-air days
- Infrastructure recovery horizon

## How the prototype model works

Each hazard has a documented baseline consequence vector. Event intensity and a
broad regional exposure factor scale that vector. Multiple simultaneous events
receive a modest compound-risk multiplier. Resilience controls apply capped
reductions to the relevant outcomes: battery capacity reduces grid disruption,
medical readiness reduces health burden, and filtration reduces pollution- and
smoke-related health effects.

These coefficients are intentionally simple and live in `app/page.tsx`. They
make the prototype understandable and auditable, but not operationally valid.

## Development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

## Production-data roadmap

A calibrated version should use:

- NOAA, NASA, Copernicus, USGS and WMO hazard data
- EIA, ENTSO-E and regional system-operator grid data
- OpenStreetMap infrastructure
- WorldPop or equivalent population surfaces
- WHO health-response functions
- FEMA and peer-reviewed regional vulnerability/loss functions
- Explicit uncertainty ranges, provenance and versioned model assumptions

## Map attribution

The world-map base is loaded from Wikimedia Commons and derives from a
CC0/public-domain equirectangular map. See the in-app footer for attribution.

## License

No license has been selected yet. Add a license before accepting external
contributions or redistributing the project.
