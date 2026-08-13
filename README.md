# Weather Model

> **Magic2U case study 01:** Weather Model is the first product-brand implementation of the [Magic2U design-system platform](https://magic2u.org). It uses a shared semantic token contract while retaining its own weather-risk identity.

An interactive global hazard and resilience simulator. Select a natural or
environmental hazard, place it anywhere on the world map, combine multiple
events, and explore modeled impacts on people, power systems, health,
batteries, displacement, air quality, economic activity, and recovery.

> **Important:** Weather Model is an educational scenario sandbox. Its outputs
> are illustrative comparisons—not forecasts, emergency guidance, casualty
> predictions, engineering studies, insurance estimates, or investment advice.

## Brand and product positioning

Weather Model is positioned as **illustrative climate-risk intelligence** for portfolio conversations, resilience planning, and executive education. Its visual direction draws on the urgency and hierarchy of an editorial weather desk while remaining original to Weather Model.

- Deep navy communicates institutional trust and analytical depth.
- Data cyan identifies models, resilience, and positive action.
- Alert coral marks editorial urgency and primary actions.
- Paper-white surfaces keep dense scenario information readable.
- Short risk-language modules make outputs useful to insurance and resilience audiences without implying underwriting validity.

The partner-content card is intentionally brand-neutral. An insurer, consulting firm, infrastructure provider, or workforce partner may supply an authorized name and logo later. No third-party endorsement is implied.

## How Weather Model uses Magic2U

Magic2U provides the semantic roles; Weather Model supplies the product-specific foundation values.

| Magic2U layer | Weather Model implementation |
| --- | --- |
| Foundation | Navy, cyan, coral, sand, spacing, radii, and elevation values |
| Semantic | Page, panel, inverse, primary text, secondary text, action, alert, and border roles |
| Components | Weather desk, scenario controls, metric cards, risk brief, partner card, and case-study panel |
| Output | Responsive web application |

The token source is [`app/weather-model.tokens.css`](app/weather-model.tokens.css). The product theme is [`app/weather-model.theme.css`](app/weather-model.theme.css). Components consume semantic variables instead of inventing independent values, so future Magic2U governance can update the product without erasing its brand.

```text
Magic2U semantic contract
          ↓
Weather Model foundation theme
          ↓
Scenario lab · risk brief · partner content · metrics
```

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
