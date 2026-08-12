"use client";

import { useMemo, useRef, useState } from "react";

type Hazard = {
  id: string; code: string; name: string; category: string; color: string;
  outage: number; injuries: number; fatalities: number; damage: number;
  stress: number; battery: number; displaced: number; airDays: number; recovery: number;
};

type Event = { id: number; hazardId: string; x: number; y: number; place: string; intensity: number };

const hazards: Hazard[] = [
  { id:"hurricane", code:"CY", name:"Hurricane", category:"Wind + surge", color:"#ff6438", outage:2.4, injuries:2800, fatalities:46, damage:34, stress:16, battery:48, displaced:180000, airDays:0, recovery:34 },
  { id:"blizzard", code:"BZ", name:"Blizzard", category:"Snow + extreme cold", color:"#88d9ff", outage:1.1, injuries:1700, fatalities:28, damage:8, stress:21, battery:66, displaced:42000, airDays:0, recovery:16 },
  { id:"wildfire", code:"WF", name:"Wildfire", category:"Fire + smoke", color:"#ffad32", outage:.72, injuries:920, fatalities:19, damage:13, stress:8, battery:22, displaced:97000, airDays:16, recovery:52 },
  { id:"heat", code:"HT", name:"Heat dome", category:"Heat + peak demand", color:"#f44336", outage:1.5, injuries:7600, fatalities:115, damage:6, stress:29, battery:82, displaced:12000, airDays:5, recovery:12 },
  { id:"flood", code:"FL", name:"Flood", category:"Rain + inundation", color:"#37a7ff", outage:.8, injuries:1200, fatalities:31, damage:19, stress:7, battery:18, displaced:230000, airDays:0, recovery:46 },
  { id:"earthquake", code:"EQ", name:"Earthquake", category:"Ground motion", color:"#c290ff", outage:2.8, injuries:14500, fatalities:390, damage:88, stress:19, battery:55, displaced:410000, airDays:3, recovery:130 },
  { id:"drought", code:"DR", name:"Drought", category:"Water + generation", color:"#e4c067", outage:.35, injuries:620, fatalities:21, damage:17, stress:13, battery:36, displaced:68000, airDays:8, recovery:180 },
  { id:"pollution", code:"AQ", name:"Air pollution", category:"PM2.5 + ozone", color:"#a6a59a", outage:.05, injuries:11800, fatalities:180, damage:4, stress:2, battery:2, displaced:6000, airDays:27, recovery:24 },
];

const presets = [
  { label:"Florida hurricane", hazard:"hurricane", x:24, y:42, place:"Florida, USA" },
  { label:"Alaska blizzard", hazard:"blizzard", x:8, y:23, place:"Alaska, USA" },
  { label:"China air event", hazard:"pollution", x:78, y:39, place:"Eastern China" },
  { label:"California fire", hazard:"wildfire", x:17, y:39, place:"California, USA" },
  { label:"Japan earthquake", hazard:"earthquake", x:88, y:40, place:"Japan" },
  { label:"Amazon drought", hazard:"drought", x:34, y:66, place:"Amazon Basin" },
  { label:"Australia heat", hazard:"heat", x:85, y:75, place:"Eastern Australia" },
];

const regionAt = (x:number, y:number) => {
  if (x < 28 && y < 32) return { name:"Northern North America", factor:.72 };
  if (x < 30 && y < 57) return { name:"North America", factor:1.0 };
  if (x < 42 && y >= 57) return { name:"South America", factor:.91 };
  if (x >= 43 && x < 60 && y < 48) return { name:"Europe / Mediterranean", factor:1.08 };
  if (x >= 42 && x < 66 && y >= 48) return { name:"Africa", factor:1.18 };
  if (x >= 60 && x < 84 && y < 57) return { name:"Central / East Asia", factor:1.42 };
  if (x >= 84 && y < 58) return { name:"Pacific Asia", factor:1.27 };
  if (x >= 69 && y >= 58) return { name:"Oceania", factor:.83 };
  return { name:"Open ocean / remote region", factor:.35 };
};

const fmt = (n:number, digits=0) => new Intl.NumberFormat("en-US", { maximumFractionDigits:digits }).format(n);

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hazardId, setHazardId] = useState("hurricane");
  const [intensity, setIntensity] = useState(3);
  const [events, setEvents] = useState<Event[]>([{ id:1, hazardId:"hurricane", x:24, y:42, place:"Florida, USA", intensity:3 }]);
  const [batteryGwh, setBatteryGwh] = useState(80);
  const [medical, setMedical] = useState(55);
  const [filtration, setFiltration] = useState(40);

  const addEvent = (x:number, y:number, place?:string, forcedHazard?:string) => {
    const region = regionAt(x,y);
    setEvents(current => [...current, { id:Date.now()+Math.random(), hazardId:forcedHazard || hazardId, x, y, place:place || region.name, intensity }]);
  };

  const placeOnMap = (event:React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    addEvent(Math.max(1,Math.min(99,((event.clientX-rect.left)/rect.width)*100)), Math.max(2,Math.min(98,((event.clientY-rect.top)/rect.height)*100)));
  };

  const outcome = useMemo(() => {
    const raw = events.reduce((acc,event) => {
      const h = hazards.find(item=>item.id===event.hazardId)!;
      const regional = regionAt(event.x,event.y).factor;
      const scale = (.34 + event.intensity*.22) * regional;
      acc.outage += h.outage*scale; acc.injuries += h.injuries*scale; acc.fatalities += h.fatalities*scale;
      acc.damage += h.damage*scale; acc.stress += h.stress*scale; acc.battery += h.battery*scale;
      acc.displaced += h.displaced*scale; acc.airDays += h.airDays*scale; acc.recovery = Math.max(acc.recovery,h.recovery*scale);
      acc.exposed += 2.7*scale*(event.hazardId==="pollution"?4.4:1);
      return acc;
    }, { outage:0, injuries:0, fatalities:0, damage:0, stress:0, battery:0, displaced:0, airDays:0, recovery:0, exposed:0 });
    const compound = 1 + Math.max(0,events.length-1)*.08;
    const batterySpent = Math.min(batteryGwh, raw.battery*compound);
    const gridRelief = raw.battery ? Math.min(.52,batterySpent/raw.battery*.46) : 0;
    const medicalRelief = medical/100*.42;
    const airRelief = filtration/100*.55;
    return { ...raw, batterySpent, gridRelief,
      outage:raw.outage*compound*(1-gridRelief), stress:raw.stress*compound*(1-gridRelief*.62),
      injuries:raw.injuries*compound*(1-medicalRelief)*(1-airRelief*(raw.airDays>0?.45:0)),
      fatalities:raw.fatalities*compound*(1-medicalRelief*.74)*(1-airRelief*(raw.airDays>0?.36:0)),
      damage:raw.damage*compound*(1-gridRelief*.18), displaced:raw.displaced*compound,
      airDays:raw.airDays*(1-airRelief*.28), recovery:raw.recovery*compound*(1-gridRelief*.16), exposed:raw.exposed*compound
    };
  },[events,batteryGwh,medical,filtration]);

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">W</span><span>WEATHER MODEL</span></a><div className="status"><span className="status-dot"/>Illustrative scenario engine</div></header>
    <section className="hero" id="top"><div><p className="eyebrow">GLOBAL HAZARD × INFRASTRUCTURE SIMULATOR</p><h1>Put a disaster<br/>anywhere on Earth.</h1></div><p className="hero-copy">Explore how hazards could cascade through people, power, health, batteries, and economies. Select an event, then click the map to place it.</p></section>

    <section className="simulator">
      <aside className="toolbox">
        <div className="step"><span>01</span><div><b>CHOOSE A HAZARD</b><small>Natural and environmental events</small></div></div>
        <div className="hazard-grid">{hazards.map(h=><button key={h.id} className={hazardId===h.id?"active":""} style={{"--hazard":h.color} as React.CSSProperties} onClick={()=>setHazardId(h.id)}><i>{h.code}</i><span><b>{h.name}</b><small>{h.category}</small></span></button>)}</div>
        <label className="range"><span><b>Intensity</b><output>{intensity} / 5</output></span><input type="range" min="1" max="5" value={intensity} onChange={e=>setIntensity(Number(e.target.value))}/></label>
        <div className="step"><span>02</span><div><b>PLACE IT ON THE MAP</b><small>Click anywhere or try a preset</small></div></div>
        <div className="presets">{presets.map(p=><button key={p.label} onClick={()=>addEvent(p.x,p.y,p.place,p.hazard)}>+ {p.label}</button>)}</div>
        <div className="event-actions"><button onClick={()=>setEvents(e=>e.slice(0,-1))} disabled={!events.length}>Undo last</button><button onClick={()=>setEvents([])} disabled={!events.length}>Clear map</button></div>
      </aside>

      <div className="world-panel">
        <div className="map-head"><span>LIVE SCENARIO MAP</span><small>{events.length} event{events.length===1?"":"s"} placed</small></div>
        <div className="world-map" ref={mapRef} onClick={placeOnMap} role="application" aria-label="World map. Click to place the selected hazard.">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/BlankMap-Equirectangular.svg" alt="Political map of the world"/>
          <div className="map-grid" aria-hidden="true"/>
          <div className="click-hint">CLICK MAP TO PLACE {hazards.find(h=>h.id===hazardId)?.name.toUpperCase()}</div>
          {events.map(event=>{const h=hazards.find(item=>item.id===event.hazardId)!;return <button className="event-pin" key={event.id} style={{left:`${event.x}%`,top:`${event.y}%`,"--hazard":h.color} as React.CSSProperties} onClick={e=>{e.stopPropagation();setEvents(all=>all.filter(item=>item.id!==event.id));}} title={`Remove ${h.name} — ${event.place}`}><span>{h.code}</span><em>{event.intensity}</em></button>})}
          <div className="coordinates">EVENTS ARE REMOVABLE · CLICK A MARKER</div>
        </div>
        <div className="event-strip">{events.length?events.map(e=>{const h=hazards.find(x=>x.id===e.hazardId)!;return <div key={e.id}><i style={{background:h.color}}/><span><b>{h.name}</b><small>{e.place} · intensity {e.intensity}</small></span></div>}):<p>No events placed. Choose a hazard and click the map.</p>}</div>
      </div>
    </section>

    <section className="resilience">
      <div className="step"><span>03</span><div><b>TEST RESILIENCE</b><small>Change capacity and watch outcomes respond</small></div></div>
      <div className="resilience-controls">
        <label className="range"><span><b>Available grid batteries</b><output>{batteryGwh} GWh</output></span><input type="range" min="0" max="300" step="10" value={batteryGwh} onChange={e=>setBatteryGwh(Number(e.target.value))}/></label>
        <label className="range"><span><b>Emergency medical readiness</b><output>{medical}%</output></span><input type="range" min="0" max="100" step="5" value={medical} onChange={e=>setMedical(Number(e.target.value))}/></label>
        <label className="range"><span><b>Clean-air / filtration coverage</b><output>{filtration}%</output></span><input type="range" min="0" max="100" step="5" value={filtration} onChange={e=>setFiltration(Number(e.target.value))}/></label>
      </div>
    </section>

    <section className="outcomes">
      <div className="outcome-head"><div className="step"><span>04</span><div><b>MODELED OUTCOMES</b><small>Comparative estimates, not predictions</small></div></div><strong>{Math.round(outcome.gridRelief*100)}% <small>grid disruption mitigated</small></strong></div>
      <div className="metrics">
        <article><span>People exposed</span><b>{fmt(outcome.exposed,1)}<small>M</small></b><em>Population exposure proxy</em></article>
        <article><span>Power interruptions</span><b>{fmt(outcome.outage,2)}<small>M</small></b><em>Customers after storage relief</em></article>
        <article><span>Peak grid stress</span><b>{fmt(outcome.stress,1)}<small>GW</small></b><em>Demand and supply disruption</em></article>
        <article className="battery"><span>Batteries discharged</span><b>{fmt(outcome.batterySpent,1)}<small>GWh</small></b><em>Of {batteryGwh} GWh available</em></article>
        <article><span>Injury burden</span><b>{fmt(outcome.injuries)}</b><em>Health-impact proxy</em></article>
        <article><span>Mortality risk</span><b>{fmt(outcome.fatalities)}</b><em>Scenario risk proxy—not a forecast</em></article>
        <article><span>Economic disruption</span><b>${fmt(outcome.damage,1)}<small>B</small></b><em>Direct-loss comparison</em></article>
        <article><span>People displaced</span><b>{fmt(outcome.displaced)}</b><em>Temporary displacement proxy</em></article>
        <article><span>Degraded-air days</span><b>{fmt(outcome.airDays,1)}</b><em>Population-weighted duration</em></article>
        <article><span>Recovery horizon</span><b>{fmt(outcome.recovery)}<small>days</small></b><em>Infrastructure recovery proxy</em></article>
      </div>
    </section>

    <section className="method"><div><p className="eyebrow">SAFE BY DESIGN</p><h2>A simulator for questions,<br/>not authoritative answers.</h2></div><div><p>Weather Model helps people understand cascading risk and resilience tradeoffs. Its coefficients are illustrative and deliberately transparent. It must not be used for evacuation, medical, emergency-management, investment, insurance, or utility-operating decisions.</p><p>Production evolution: calibrate hazards with NOAA, NASA, Copernicus, USGS and WMO data; infrastructure with EIA and OpenStreetMap; population with WorldPop; and losses with peer-reviewed regional vulnerability functions.</p><a href="#top">Reset your thinking ↑</a></div></section>
    <footer><span>WEATHER MODEL / SIMULATOR PROTOTYPE</span><span>Map: Wikimedia Commons · CC0 / public domain</span></footer>
  </main>;
}
