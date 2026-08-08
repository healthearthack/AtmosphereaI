import { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/page.tsx
var hazards = [
	{
		id: "hurricane",
		code: "CY",
		name: "Hurricane",
		category: "Wind + surge",
		color: "#ff6438",
		outage: 2.4,
		injuries: 2800,
		fatalities: 46,
		damage: 34,
		stress: 16,
		battery: 48,
		displaced: 18e4,
		airDays: 0,
		recovery: 34
	},
	{
		id: "blizzard",
		code: "BZ",
		name: "Blizzard",
		category: "Snow + extreme cold",
		color: "#88d9ff",
		outage: 1.1,
		injuries: 1700,
		fatalities: 28,
		damage: 8,
		stress: 21,
		battery: 66,
		displaced: 42e3,
		airDays: 0,
		recovery: 16
	},
	{
		id: "wildfire",
		code: "WF",
		name: "Wildfire",
		category: "Fire + smoke",
		color: "#ffad32",
		outage: .72,
		injuries: 920,
		fatalities: 19,
		damage: 13,
		stress: 8,
		battery: 22,
		displaced: 97e3,
		airDays: 16,
		recovery: 52
	},
	{
		id: "heat",
		code: "HT",
		name: "Heat dome",
		category: "Heat + peak demand",
		color: "#f44336",
		outage: 1.5,
		injuries: 7600,
		fatalities: 115,
		damage: 6,
		stress: 29,
		battery: 82,
		displaced: 12e3,
		airDays: 5,
		recovery: 12
	},
	{
		id: "flood",
		code: "FL",
		name: "Flood",
		category: "Rain + inundation",
		color: "#37a7ff",
		outage: .8,
		injuries: 1200,
		fatalities: 31,
		damage: 19,
		stress: 7,
		battery: 18,
		displaced: 23e4,
		airDays: 0,
		recovery: 46
	},
	{
		id: "earthquake",
		code: "EQ",
		name: "Earthquake",
		category: "Ground motion",
		color: "#c290ff",
		outage: 2.8,
		injuries: 14500,
		fatalities: 390,
		damage: 88,
		stress: 19,
		battery: 55,
		displaced: 41e4,
		airDays: 3,
		recovery: 130
	},
	{
		id: "drought",
		code: "DR",
		name: "Drought",
		category: "Water + generation",
		color: "#e4c067",
		outage: .35,
		injuries: 620,
		fatalities: 21,
		damage: 17,
		stress: 13,
		battery: 36,
		displaced: 68e3,
		airDays: 8,
		recovery: 180
	},
	{
		id: "pollution",
		code: "AQ",
		name: "Air pollution",
		category: "PM2.5 + ozone",
		color: "#a6a59a",
		outage: .05,
		injuries: 11800,
		fatalities: 180,
		damage: 4,
		stress: 2,
		battery: 2,
		displaced: 6e3,
		airDays: 27,
		recovery: 24
	}
];
var presets = [
	{
		label: "Florida hurricane",
		hazard: "hurricane",
		x: 24,
		y: 42,
		place: "Florida, USA"
	},
	{
		label: "Alaska blizzard",
		hazard: "blizzard",
		x: 8,
		y: 23,
		place: "Alaska, USA"
	},
	{
		label: "China air event",
		hazard: "pollution",
		x: 78,
		y: 39,
		place: "Eastern China"
	},
	{
		label: "California fire",
		hazard: "wildfire",
		x: 17,
		y: 39,
		place: "California, USA"
	},
	{
		label: "Japan earthquake",
		hazard: "earthquake",
		x: 88,
		y: 40,
		place: "Japan"
	},
	{
		label: "Amazon drought",
		hazard: "drought",
		x: 34,
		y: 66,
		place: "Amazon Basin"
	},
	{
		label: "Australia heat",
		hazard: "heat",
		x: 85,
		y: 75,
		place: "Eastern Australia"
	}
];
var regionAt = (x, y) => {
	if (x < 28 && y < 32) return {
		name: "Northern North America",
		factor: .72
	};
	if (x < 30 && y < 57) return {
		name: "North America",
		factor: 1
	};
	if (x < 42 && y >= 57) return {
		name: "South America",
		factor: .91
	};
	if (x >= 43 && x < 60 && y < 48) return {
		name: "Europe / Mediterranean",
		factor: 1.08
	};
	if (x >= 42 && x < 66 && y >= 48) return {
		name: "Africa",
		factor: 1.18
	};
	if (x >= 60 && x < 84 && y < 57) return {
		name: "Central / East Asia",
		factor: 1.42
	};
	if (x >= 84 && y < 58) return {
		name: "Pacific Asia",
		factor: 1.27
	};
	if (x >= 69 && y >= 58) return {
		name: "Oceania",
		factor: .83
	};
	return {
		name: "Open ocean / remote region",
		factor: .35
	};
};
var fmt = (n, digits = 0) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);
function Home() {
	const mapRef = useRef(null);
	const [hazardId, setHazardId] = useState("hurricane");
	const [intensity, setIntensity] = useState(3);
	const [events, setEvents] = useState([{
		id: 1,
		hazardId: "hurricane",
		x: 24,
		y: 42,
		place: "Florida, USA",
		intensity: 3
	}]);
	const [batteryGwh, setBatteryGwh] = useState(80);
	const [medical, setMedical] = useState(55);
	const [filtration, setFiltration] = useState(40);
	const addEvent = (x, y, place, forcedHazard) => {
		const region = regionAt(x, y);
		setEvents((current) => [...current, {
			id: Date.now() + Math.random(),
			hazardId: forcedHazard || hazardId,
			x,
			y,
			place: place || region.name,
			intensity
		}]);
	};
	const placeOnMap = (event) => {
		if (event.target.closest("button")) return;
		const rect = mapRef.current?.getBoundingClientRect();
		if (!rect) return;
		addEvent(Math.max(1, Math.min(99, (event.clientX - rect.left) / rect.width * 100)), Math.max(2, Math.min(98, (event.clientY - rect.top) / rect.height * 100)));
	};
	const outcome = useMemo(() => {
		const raw = events.reduce((acc, event) => {
			const h = hazards.find((item) => item.id === event.hazardId);
			const regional = regionAt(event.x, event.y).factor;
			const scale = (.34 + event.intensity * .22) * regional;
			acc.outage += h.outage * scale;
			acc.injuries += h.injuries * scale;
			acc.fatalities += h.fatalities * scale;
			acc.damage += h.damage * scale;
			acc.stress += h.stress * scale;
			acc.battery += h.battery * scale;
			acc.displaced += h.displaced * scale;
			acc.airDays += h.airDays * scale;
			acc.recovery = Math.max(acc.recovery, h.recovery * scale);
			acc.exposed += 2.7 * scale * (event.hazardId === "pollution" ? 4.4 : 1);
			return acc;
		}, {
			outage: 0,
			injuries: 0,
			fatalities: 0,
			damage: 0,
			stress: 0,
			battery: 0,
			displaced: 0,
			airDays: 0,
			recovery: 0,
			exposed: 0
		});
		const compound = 1 + Math.max(0, events.length - 1) * .08;
		const batterySpent = Math.min(batteryGwh, raw.battery * compound);
		const gridRelief = raw.battery ? Math.min(.52, batterySpent / raw.battery * .46) : 0;
		const medicalRelief = medical / 100 * .42;
		const airRelief = filtration / 100 * .55;
		return {
			...raw,
			batterySpent,
			gridRelief,
			outage: raw.outage * compound * (1 - gridRelief),
			stress: raw.stress * compound * (1 - gridRelief * .62),
			injuries: raw.injuries * compound * (1 - medicalRelief) * (1 - airRelief * (raw.airDays > 0 ? .45 : 0)),
			fatalities: raw.fatalities * compound * (1 - medicalRelief * .74) * (1 - airRelief * (raw.airDays > 0 ? .36 : 0)),
			damage: raw.damage * compound * (1 - gridRelief * .18),
			displaced: raw.displaced * compound,
			airDays: raw.airDays * (1 - airRelief * .28),
			recovery: raw.recovery * compound * (1 - gridRelief * .16),
			exposed: raw.exposed * compound
		};
	}, [
		events,
		batteryGwh,
		medical,
		filtration
	]);
	return /* @__PURE__ */ jsxs("main", { children: [
		/* @__PURE__ */ jsxs("header", {
			className: "topbar",
			children: [/* @__PURE__ */ jsxs("a", {
				className: "brand",
				href: "#top",
				children: [/* @__PURE__ */ jsx("span", {
					className: "brand-mark",
					children: "W"
				}), /* @__PURE__ */ jsx("span", { children: "WEATHER MODEL" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "status",
				children: [/* @__PURE__ */ jsx("span", { className: "status-dot" }), "Illustrative scenario engine"]
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "hero",
			id: "top",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "GLOBAL HAZARD × INFRASTRUCTURE SIMULATOR"
			}), /* @__PURE__ */ jsxs("h1", { children: [
				"Put a disaster",
				/* @__PURE__ */ jsx("br", {}),
				"anywhere on Earth."
			] })] }), /* @__PURE__ */ jsx("p", {
				className: "hero-copy",
				children: "Explore how hazards could cascade through people, power, health, batteries, and economies. Select an event, then click the map to place it."
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "simulator",
			children: [/* @__PURE__ */ jsxs("aside", {
				className: "toolbox",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "step",
						children: [/* @__PURE__ */ jsx("span", { children: "01" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("b", { children: "CHOOSE A HAZARD" }), /* @__PURE__ */ jsx("small", { children: "Natural and environmental events" })] })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hazard-grid",
						children: hazards.map((h) => /* @__PURE__ */ jsxs("button", {
							className: hazardId === h.id ? "active" : "",
							style: { "--hazard": h.color },
							onClick: () => setHazardId(h.id),
							children: [/* @__PURE__ */ jsx("i", { children: h.code }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: h.name }), /* @__PURE__ */ jsx("small", { children: h.category })] })]
						}, h.id))
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "range",
						children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: "Intensity" }), /* @__PURE__ */ jsxs("output", { children: [intensity, " / 5"] })] }), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "1",
							max: "5",
							value: intensity,
							onChange: (e) => setIntensity(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "step",
						children: [/* @__PURE__ */ jsx("span", { children: "02" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("b", { children: "PLACE IT ON THE MAP" }), /* @__PURE__ */ jsx("small", { children: "Click anywhere or try a preset" })] })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "presets",
						children: presets.map((p) => /* @__PURE__ */ jsxs("button", {
							onClick: () => addEvent(p.x, p.y, p.place, p.hazard),
							children: ["+ ", p.label]
						}, p.label))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "event-actions",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setEvents((e) => e.slice(0, -1)),
							disabled: !events.length,
							children: "Undo last"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setEvents([]),
							disabled: !events.length,
							children: "Clear map"
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "world-panel",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "map-head",
						children: [/* @__PURE__ */ jsx("span", { children: "LIVE SCENARIO MAP" }), /* @__PURE__ */ jsxs("small", { children: [
							events.length,
							" event",
							events.length === 1 ? "" : "s",
							" placed"
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "world-map",
						ref: mapRef,
						onClick: placeOnMap,
						role: "application",
						"aria-label": "World map. Click to place the selected hazard.",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BlankMap-Equirectangular.svg",
								alt: "Political map of the world"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "map-grid",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "click-hint",
								children: ["CLICK MAP TO PLACE ", hazards.find((h) => h.id === hazardId)?.name.toUpperCase()]
							}),
							events.map((event) => {
								const h = hazards.find((item) => item.id === event.hazardId);
								return /* @__PURE__ */ jsxs("button", {
									className: "event-pin",
									style: {
										left: `${event.x}%`,
										top: `${event.y}%`,
										"--hazard": h.color
									},
									onClick: (e) => {
										e.stopPropagation();
										setEvents((all) => all.filter((item) => item.id !== event.id));
									},
									title: `Remove ${h.name} — ${event.place}`,
									children: [/* @__PURE__ */ jsx("span", { children: h.code }), /* @__PURE__ */ jsx("em", { children: event.intensity })]
								}, event.id);
							}),
							/* @__PURE__ */ jsx("div", {
								className: "coordinates",
								children: "EVENTS ARE REMOVABLE · CLICK A MARKER"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "event-strip",
						children: events.length ? events.map((e) => {
							const h = hazards.find((x) => x.id === e.hazardId);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("i", { style: { background: h.color } }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: h.name }), /* @__PURE__ */ jsxs("small", { children: [
								e.place,
								" · intensity ",
								e.intensity
							] })] })] }, e.id);
						}) : /* @__PURE__ */ jsx("p", { children: "No events placed. Choose a hazard and click the map." })
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "resilience",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "step",
				children: [/* @__PURE__ */ jsx("span", { children: "03" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("b", { children: "TEST RESILIENCE" }), /* @__PURE__ */ jsx("small", { children: "Change capacity and watch outcomes respond" })] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "resilience-controls",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "range",
						children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: "Available grid batteries" }), /* @__PURE__ */ jsxs("output", { children: [batteryGwh, " GWh"] })] }), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0",
							max: "300",
							step: "10",
							value: batteryGwh,
							onChange: (e) => setBatteryGwh(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "range",
						children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: "Emergency medical readiness" }), /* @__PURE__ */ jsxs("output", { children: [medical, "%"] })] }), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0",
							max: "100",
							step: "5",
							value: medical,
							onChange: (e) => setMedical(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "range",
						children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("b", { children: "Clean-air / filtration coverage" }), /* @__PURE__ */ jsxs("output", { children: [filtration, "%"] })] }), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0",
							max: "100",
							step: "5",
							value: filtration,
							onChange: (e) => setFiltration(Number(e.target.value))
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "outcomes",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "outcome-head",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "step",
					children: [/* @__PURE__ */ jsx("span", { children: "04" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("b", { children: "MODELED OUTCOMES" }), /* @__PURE__ */ jsx("small", { children: "Comparative estimates, not predictions" })] })]
				}), /* @__PURE__ */ jsxs("strong", { children: [
					Math.round(outcome.gridRelief * 100),
					"% ",
					/* @__PURE__ */ jsx("small", { children: "grid disruption mitigated" })
				] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "metrics",
				children: [
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "People exposed" }),
						/* @__PURE__ */ jsxs("b", { children: [fmt(outcome.exposed, 1), /* @__PURE__ */ jsx("small", { children: "M" })] }),
						/* @__PURE__ */ jsx("em", { children: "Population exposure proxy" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Power interruptions" }),
						/* @__PURE__ */ jsxs("b", { children: [fmt(outcome.outage, 2), /* @__PURE__ */ jsx("small", { children: "M" })] }),
						/* @__PURE__ */ jsx("em", { children: "Customers after storage relief" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Peak grid stress" }),
						/* @__PURE__ */ jsxs("b", { children: [fmt(outcome.stress, 1), /* @__PURE__ */ jsx("small", { children: "GW" })] }),
						/* @__PURE__ */ jsx("em", { children: "Demand and supply disruption" })
					] }),
					/* @__PURE__ */ jsxs("article", {
						className: "battery",
						children: [
							/* @__PURE__ */ jsx("span", { children: "Batteries discharged" }),
							/* @__PURE__ */ jsxs("b", { children: [fmt(outcome.batterySpent, 1), /* @__PURE__ */ jsx("small", { children: "GWh" })] }),
							/* @__PURE__ */ jsxs("em", { children: [
								"Of ",
								batteryGwh,
								" GWh available"
							] })
						]
					}),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Injury burden" }),
						/* @__PURE__ */ jsx("b", { children: fmt(outcome.injuries) }),
						/* @__PURE__ */ jsx("em", { children: "Health-impact proxy" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Mortality risk" }),
						/* @__PURE__ */ jsx("b", { children: fmt(outcome.fatalities) }),
						/* @__PURE__ */ jsx("em", { children: "Scenario risk proxy—not a forecast" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Economic disruption" }),
						/* @__PURE__ */ jsxs("b", { children: [
							"$",
							fmt(outcome.damage, 1),
							/* @__PURE__ */ jsx("small", { children: "B" })
						] }),
						/* @__PURE__ */ jsx("em", { children: "Direct-loss comparison" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "People displaced" }),
						/* @__PURE__ */ jsx("b", { children: fmt(outcome.displaced) }),
						/* @__PURE__ */ jsx("em", { children: "Temporary displacement proxy" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Degraded-air days" }),
						/* @__PURE__ */ jsx("b", { children: fmt(outcome.airDays, 1) }),
						/* @__PURE__ */ jsx("em", { children: "Population-weighted duration" })
					] }),
					/* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsx("span", { children: "Recovery horizon" }),
						/* @__PURE__ */ jsxs("b", { children: [fmt(outcome.recovery), /* @__PURE__ */ jsx("small", { children: "days" })] }),
						/* @__PURE__ */ jsx("em", { children: "Infrastructure recovery proxy" })
					] })
				]
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "method",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "eyebrow",
				children: "SAFE BY DESIGN"
			}), /* @__PURE__ */ jsxs("h2", { children: [
				"A simulator for questions,",
				/* @__PURE__ */ jsx("br", {}),
				"not authoritative answers."
			] })] }), /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("p", { children: "Weather Model helps people understand cascading risk and resilience tradeoffs. Its coefficients are illustrative and deliberately transparent. It must not be used for evacuation, medical, emergency-management, investment, insurance, or utility-operating decisions." }),
				/* @__PURE__ */ jsx("p", { children: "Production evolution: calibrate hazards with NOAA, NASA, Copernicus, USGS and WMO data; infrastructure with EIA and OpenStreetMap; population with WorldPop; and losses with peer-reviewed regional vulnerability functions." }),
				/* @__PURE__ */ jsx("a", {
					href: "#top",
					children: "Reset your thinking ↑"
				})
			] })]
		}),
		/* @__PURE__ */ jsxs("footer", { children: [/* @__PURE__ */ jsx("span", { children: "WEATHER MODEL / SIMULATOR PROTOTYPE" }), /* @__PURE__ */ jsx("span", { children: "Map: Wikimedia Commons · CC0 / public domain" })] })
	] });
}
//#endregion
export { Home as default };
