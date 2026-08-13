import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./weather-model.tokens.css";
import "./weather-model.theme.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const metadata:Metadata={title:"Weather Model — Climate Risk Intelligence",description:"Explore transparent hazard scenarios, resilience strategies, and portfolio-relevant risk signals in a Magic2U-powered interface."};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>}
