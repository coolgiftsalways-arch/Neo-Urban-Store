import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Product from "../models/Product.js";

// ======================================================
// FRONT IMAGE MAP
// Generated from the actual Monster product ZIP.
// ======================================================

const FRONT_IMAGE_MAP = {
  "MONSTER-Energy drink -tea:lemonade-458mL-REHAB - TEA + LEMONA-Canada-2013": "56406L.jpg",
  "MONSTER-Energy drink-500mL-Spain-2012 NS": "48565-1L.jpg",
  "MONSTER-Energy drink -citrus-500mL-THE DOCTOR VALENTINO-Great Britain-2014": "60974L.jpg",
  "MONSTER-Energy drink-473mL-Mexico-2009": "31879L.jpg",
  "MONSTER-Energy drink-473mL-ENERGY : SOCIAL MEDI-United States-2012": "105946L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY BLACK O-Great Britain-2018": "87641-1L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-France-2012 NF": "41558L.jpg",
  "MONSTER-Energy drink -mango-500mL-Great Britain-2018 GB 1": "86436L.jpg",
  "MONSTER-Energy drink -fruit-500mL-PIPELINE PUNCH, ┬ú1.3-Great Britain-2018": "87447L.jpg",
  "MONSTER-Energy drink -orange-355mL-EXTRA STRENGTH - SUP-United States-2013": "53841L.jpg",
  "MONSTER-Energy drink-355mL-United States-2012": "42927L.jpg",
  "MONSTER-Energy drink-355mL-EXTRA STRENGTH - SUP-United States-2013 NEW US 2": "53840L.jpg",
  "MONSTER-Energy drink-500mL-ENERGY DRINK + SUCCO-Italy-2014": "62728L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2015": "73042L.jpg",
  "MONSTER-Energy drink-500mL-ASSASSIN'S CREED ORI-France-2017": "81504-1L.jpg",
  "MONSTER-Energy drink-500mL-ULTRA SUNRISE : PRIC-Great Britain-2017": "83431L.jpg",
  "MONSTER-Energy drink-500mL-Norway-2011 NORWAY 2": "42541L-2.jpg",
  "MONSTER-Energy drink (diet)-473mL-ZERO ULTRA TEXTURED -United States-2012": "47992L.jpg",
  "MONSTER-Energy drink -cherry (diet)-500mL-Great Britain-2021": "115835L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-United States-2019": "98207L.jpg",
  "MONSTER-Energy:coffee drink -espresso-284mL-United States-2010": "47754-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Germany-2012": "42546L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2017 GER 1": "83614L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY GHOSTS -Great Britain-2013": "54156L.jpg",
  "MONSTER-Energy drink (diet)-500mL-LO-CARB MONSTER ENER-Brazil-2013 NB": "49892L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-201": "109344L.jpg",
  "MONSTER-Energy drink -mango-500mL-Germany-2018": "87615L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ASSASSIN'S CREED ORI-France-2017": "83768-1L.jpg",
  "MONSTER-Energy drink-710mL-United States-2007": "66358L.jpg",
  "MONSTER-Energy:coffee drink -mocha-444mL-Canada-2019 cnda 1": "94444L.jpg",
  "MONSTER-Energy drink -fruit-500mL-MIXXD (CAN FOR SPAIN-Spain-2018": "87099L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - BLACK-Germany-2015": "73722-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-(CAN FOR SPAIN & POR-Portugal-2021": "116142L.jpg",
  "MONSTER-Energy drink-500mL-Norway-2014": "57801L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-France-2012": "47918L.jpg",
  "MONSTER-Energy drink:tea -green-500mL-Switzerland-2014": "61859L.jpg",
  "MONSTER-Energy drink -strawberry (diet)-500mL-ULTRA STRAWBERRY DRE-Spain-2025": "152948L.jpg",
  "MONSTER-Energy drink-473mL-United States-2012 NUS": "42932L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Turkey-2016": "78104L.jpg",
  "MONSTER-Energy drink -peach:tangerine-500mL-Great Britain-2025": "152693L.jpg",
  "MONSTER-Energy drink (diet)-355mL-United States-2012": "44915L.jpg",
  "MONSTER-Energy drink-500mL-LEWIS HAMILTON 44 (C-Portugal-2017": "80720L.jpg",
  "MONSTER-Energy:coffee drink United States-2025": "153929-2L.jpg",
  "MONSTER-Energy drink-473mL-Canada-201": "93820L.jpg",
  "MONSTER-Energy drink-553mL-Germany-2017": "83517L.jpg",
  "MONSTER-Energy drink (diet)-355mL-Slovenia-2018": "87036L.jpg",
  "MONSTER-Energy drink-500mL-OFERTA DE ARTIGOS EX-Portugal-2013": "59450L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO : CA-Benelux-2016": "83653L.jpg",
  "MONSTER-Energy drink-500mL-ASSASSIN'S CREED ORI-Great Britain-2017": "81652-1L.jpg",
  "MONSTER-Energy drink-473mL-Hong Kong-2013": "60183L.jpg",
  "MONSTER-Energy drink-473mL-Colombia-2017": "82039-1L.jpg",
  "MONSTER-Energy drink (diet)-355mL-Japan-2019": "124446L.jpg",
  "MONSTER-Energy drink:tea -green-458mL-United States-201?": "44214L.jpg",
  "MONSTER-Energy drink-500mL-EXCLUSIVE TEAM GEAR-Benelux-2014": "66910L-2.jpg",
  "MONSTER-Energy drink-500mL-Great Britain-2017": "80492-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Benelux-2013": "52013L.jpg",
  "MONSTER-Coffee with milk-250mL-ESPRESSO AND MILK : -Germany-2019": "91463L.jpg",
  "MONSTER-Energy drink-553mL-Benelux-2017": "83518L.jpg",
  "MONSTER-Energy drink -fruit (diet)-500mL-ULTRA SUNRISE ZERO S-Portugal-2016": "74211L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2017 GER": "83614L.jpg",
  "MONSTER-Energy drink -citrus-500mL-Germany-2017": "83635-2L.jpg",
  "MONSTER-Energy drink-946mL-MONSTER DUB EDITION -United States-2009 NUS2": "47991L.jpg",
  "MONSTER-Energy drink-946mL-United States-2012 NUS3": "44913L.jpg",
  "MONSTER-Energy drink-550mL-ENERGY BREW : UBERMO-United States-2016": "94051L.jpg",
  "MONSTER-Energy drink-500mL-Great Britain-2026": "162466-1L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Benelux-2016": "87925L.jpg",
  "MONSTER-Energy drink -coffee-285mL-Benelux-2013": "97086L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2004 PICTURE": "19233L.jpg",
  "MONSTER-Energy drink:tea -peach-500mL-Germany-2017": "83515L.jpg",
  "MONSTER-Energy drink-500mL-Denmark-2018 DNMRK 1": "84789L.jpg",
  "MONSTER-Energy drink -blueberry-473mL-United States-2013": "49908L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Slovak Republic-2010": "32722L.jpg",
  "MONSTER-Energy drink-500mL-Spain-2013": "73833L.jpg",
  "MONSTER-Energy drink:tea -peach-500mL-Hungary-2019": "93503L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Great Britain-2020": "109410L.jpg",
  "MONSTER-Energy drink -mocha-285mL-X-PRESSO+MILK MIDNIT-Sweden-2010 NXS2": "42561L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - INFIN-Switzerland-2016": "78929L.jpg",
  "MONSTER-Energy drink -coffee-250mL-ESPRESSO SALTED CARA-Germany-2020": "124462L.jpg",
  "MONSTER-Energy drink:tea -orange-458mL-REHAB - TEA + ORANGE-Canada-2013": "56405L.jpg",
  "MONSTER-Energy drink -fruit-500mL-KHAOS - ENERGY + SUC-Brazil-2013": "49890-1L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Switzerland-2013": "57537L.jpg",
  "MONSTER-Energy drink -tea:lemonade-458mL-REHAB - BLACK TOP AN-United States-2011 NUS": "36111L.jpg",
  "MONSTER-Energy drink (diet)-500mL-VR 46 : VALENTINO RO-Belgium-2025": "156555L.jpg",
  "MONSTER-Energy:coffee drink -salted caramel-473mL-JAVA MONSTER SALTED -United States-2016": "76665L.jpg",
  "MONSTER-Energy drink-250mL-Sweden-2010": "42565L.jpg",
  "MONSTER-Energy drink (diet)-500mL-France-2016 FR 1": "73445L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO - CA-France-2013": "54955L.jpg",
  "MONSTER-Energy drink-500mL-EKSKLUSIVT TEAM UTST-Norway-2013 NN2": "50491L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2015": "68455-1L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2011 NG2": "45233L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Ireland-2014": "66907L.jpg",
  "MONSTER-Energy drink -tea:lemonade-458mL-REHAB PINK LEMONADE-United States-2013": "66184L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2013 NUS5": "53839L.jpg",
  "MONSTER-Energy drink-473mL-United States-2005": "27692L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-201? NUS4": "44217L.jpg",
  "MONSTER-Energy drink-946mL-MONSTER HEAVY METAL-United States-2007 NUS2": "48014L.jpg",
  "MONSTER-Energy drink-553mL-France-2016": "84640L.jpg",
  "MONSTER-Energy drink -fruit (diet)-500mL-Germany-2018": "85668-1L.jpg",
  "MONSTER-Energy drink:tea -cranberry-458mL-Canada-2013": "56404L.jpg",
  "MONSTER-Energy drink -fruit-458mL-United States-2019": "92579L.jpg",
  "MONSTER-Energy drink-500mL-BLACK MONSTER ASSAUL-Russian Federation-2015": "72990L.jpg",
  "MONSTER-Energy drink-710mL-United States-201? NUS": "44205L.jpg",
  "MONSTER-Energy drink -citrus-500mL-Switzerland-2015": "69087L.jpg",
  "MONSTER-Energy drink-500mL GR 1": "83513L.jpg",
  "MONSTER-Energy drink-500mL-Czech Republic-2018": "85988L.jpg",
  "MONSTER-Energy drink -citrus-250mL-Netherlands-2017": "83519L.jpg",
  "MONSTER-Energy drink (diet)-355mL-EXTRA STRENGTH BLACK-United States-2012": "42925L.jpg",
  "MONSTER-Energy drink-500mL-RIPPER : ENERGY + JU-Benelux-2008": "26529L.jpg",
  "MONSTER-Energy drink-250mL-Netherlands-2017 NUS 4": "82182L.jpg",
  "MONSTER-Energy drink -lemon (diet)-500mL-Benelux-2018": "86229L.jpg",
  "MONSTER-Energy drink:tea -green-500mL-Germany-2013": "51596L.jpg",
  "MONSTER-Energy drink-250mL-Italy-2012": "43012L.jpg",
  "MONSTER-Energy drink INFIN-France-2016": "75865-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY BLACK O-Great Britain-2018": "87642-1L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2019": "91451L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2011 NG2": "42447L.jpg",
  "MONSTER-Energy:coffee drink -cream-443mL-JAVA MONSTER MEAN BE-United States-2011": "36108L.jpg",
  "MONSTER-Energy drink -citrus (diet)-473mL-ULTRA FANTASY RUBY R-United States-2024": "145320L.jpg",
  "MONSTER-Energy drink -fruit-500mL-BLACK MONSTER KHAOS-Russian Federation-2016": "73830L.jpg",
  "MONSTER-Water-568mL-TOUR WATER : VANS WA-United States-2023": "135224-3L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Slovak Republic-2010 NS": "32722L.jpg",
  "MONSTER-Energy drink -lime-473mL-United States-2014": "144688L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ULTRA : HALO INFINIT-Poland-2020": "124714-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ASSASSIN'S CREED ORI-Great Britain-2017": "81653-1L.jpg",
  "MONSTER-Water-473mL-TOUR WATER : VANS WA-United States-2025": "153665-3L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Sweden-2012 ": "42545L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY INFINIT-Germany-2016": "82082L.jpg",
  "MONSTER-Coffee -vanilla-250mL-VANILLA & ESPRESSO :-Germany-2019": "91464L.jpg",
  "MONSTER-Energy drink -fruit-473mL-United States-2019": "96890L.jpg",
  "MONSTER-Energy drink (diet)-473mL-Canada-2013": "56410L.jpg",
  "MONSTER-Energy drink-355mL-EXTRA STRENGTH ANTI -United States-2012": "42928L.jpg",
  "MONSTER-Energy drink-473mL-MONSTER ENERGY ULTRA-Brazil-2017": "84007L.jpg",
  "MONSTER-Energy drink (diet)": "44207L.jpg",
  "MONSTER-Energy drink (diet)-500mL-(CAN FOR PORTUGAL & -Portugal-2016": "74387L.jpg",
  "MONSTER-Energy drink -pineapple (diet)-500mL-ULTRA GOLDEN PINEAPP-Finland-2024": "155409L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2018 BLX 1": "85471L.jpg",
  "MONSTER-Energy drink -fruit-458mL-United States-201": "134900-1L.jpg",
  "MONSTER-Energy drink-250mL-Netherlands-2017": "82158L.jpg",
  "MONSTER-Energy drink -fruit-500mL-CALL OF DUTY ADVANCE-Germany-2015": "67531-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Portugal-2012": "59449L.jpg",
  "MONSTER-Energy drink -fruit-473mL-MAD DOG : DUB EDITIO-United States-2012": "47759L.jpg",
  "MONSTER-Energy drink (diet)-710mL-United States-2013 NUS 1": "66192L.jpg",
  "MONSTER-Energy drink -mango-500mL-Great Britain-2018": "86738L.jpg",
  "MONSTER-Energy drink-500mL-France-2012 NF": "44836-1L.jpg",
  "MONSTER-Alc. energy cocktail-500mL-Russian Federation-2010 NUS 3": "72994L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Norway-2011  NP": "42677L.jpg",
  "MONSTER-Energy drink:tea -green-500mL-REHAB TE╠ü VERDE + ENE-Spain-2013": "61447-2L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2011 NG": "42450L.jpg",
  "MONSTER-Energy drink-500mL-France-2011": "36962L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ULTRA (CAN FOR SPAI-Portugal-2016": "74240L.jpg",
  "MONSTER-Energy drink -pineapple:passionfruit-473mL-United States-2012": "44904L.jpg",
  "MONSTER-Energy drink-500mL-Brazil-2012 NB": "53651L.jpg",
  "MONSTER-Energy drink-500mL-Denmark-2018 DENMRK 1": "84789L.jpg",
  "MONSTER-Energy drink -lemon (diet)-500mL-Germany-2017": "83514L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2011 NR": "42446L.jpg",
  "MONSTER-Energy drink (diet)-355mL-EXTRA STRENGTH BLACK-United States-2012 PICTURE": "42925L.jpg",
  "MONSTER-Energy drink-550mL-United States-2009 NUS": "44211L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-JAVA MONSTER KONA BL-United States-2011": "33078L.jpg",
  "MONSTER-Energy drink (diet)-473mL-LO-CARB MONSTER ENER-Peru-2016": "91792L.jpg",
  "MONSTER-Energy drink-500mL-Czech Republic-2018 CZECH 1": "85988L.jpg",
  "MONSTER-Energy drink-500mL-Czech Republic-2018 CZECH RP 1": "85988L.jpg",
  "MONSTER-Energy drink-500mL-Austria-201": "100228-2L.jpg",
  "MONSTER-Energy drink (diet)-710mL-United States-2013": "66193L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2007 PICTURE": "33565L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Poland-2018": "90223L.jpg",
  "MONSTER-Energy drink -fruit-473mL-DUB EDITION - MAD DO-Mexico-2013": "54289-1L.jpg",
  "MONSTER-Alc. energy cocktail-500mL-Russian Federation-2010 NUS 2": "72992L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY (CAN FO-Spain-2016": "77562L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Portugal-2011": "59250-1L.jpg",
  "MONSTER-Energy drink-458mL-REHAB - PROTEAN + EN-Canada-2013": "56407L.jpg",
  "MONSTER-Energy drink-500mL-Czech Republic-2012. CR": "51000L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY - BLACK-Spain-2018": "88661L.jpg",
  "MONSTER-Energy drink-473mL-CALL OF DUTY GHOSTS-United States-2013 NUS2": "53838-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY INFINIT-Great Britain-2016": "78003-1L.jpg",
  "MONSTER-Energy drink -fruit-473mL-Peru-2014": "91810L.jpg",
  "MONSTER-Energy drink -fruit-710mL-United States-2012": "44912L.jpg",
  "MONSTER-Energy drink-500mL-France-2019": "98286L.jpg",
  "MONSTER-Coffee -nitro cold brew-400mL-JAVA MONSTER : COLD -United States-2023": "141820L.jpg",
  "MONSTER-Coffee -vanilla-250mL-VANILLA ESPRESSO : T-Great Britain-2019": "91561-1L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2016 HUG 1": "73440-2L.jpg",
  "MONSTER-Energy drink-500mL-France-2017": "83406L.jpg",
  "MONSTER-Energy drink -mango (diet)-473mL-United States-2022": "125268L.jpg",
  "MONSTER-Energy drink-500mL-POUR TOI - DES EQUIP-France-2014": "69512L.jpg",
  "MONSTER-Energy drink-500mL-France-2010": "32361L.jpg",
  "MONSTER-Energy drink-250mL-Great Britain-2013": "53987L.jpg",
  "MONSTER-Energy drink:tea -cranberry-458mL-United States-201?": "44225L.jpg",
  "MONSTER-Energy drink -citrus (diet)-568mL-Poland-2022": "122388L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO : AS-Germany-2017": "83636L.jpg",
  "MONSTER-Energy drink -mango-500mL-Turkey-2021": "124441L.jpg",
  "MONSTER-Energy drink -watermelon (diet)-473mL-Argentina-2023": "135307-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-MONSTER ENERGY ULTRA-Poland-2025": "156133L.jpg",
  "MONSTER-Energy drink-355mL-Germany-2018": "86551L.jpg",
  "MONSTER-Energy drink-250mL-Benelux-2010": "36990L.jpg",
  "MONSTER-Energy drink -mango-449mL-BLACK MONSTER MANGO -Russian Federation-2021": "124713L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2018": "85471L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Sweden-2016": "77002L.jpg",
  "MONSTER-Energy drink-500mL-Norway-2011": "42542L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - BLACK-Switzerland-2015": "71855L.jpg",
  "MONSTER-Energy drink-473mL-United States-2012 NEW US 4": "42934L.jpg",
  "MONSTER-Energy drink -citrus-500mL-VALENTINO ROSSI - TH-Italy-2014": "64089L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY BLACK O-Great Britain-2015": "71712L.jpg",
  "MONSTER-Energy drink-473mL-Canada-2008": "72995L.jpg",
  "MONSTER-Energy drink -raspberry (diet)-500mL-ULTRA RED (CAN FOR P-Portugal-2016": "74238L.jpg",
  "MONSTER-Energy drink:tea -orange-458mL-United States-201?": "44226L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Czech Republic-2012": "50999-2L.jpg",
  "MONSTER-Energy drink-355mL-Slovenia-2018": "87035L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-United States-2012": "44906L.jpg",
  "MONSTER-Energy drink (diet)-500mL-LANDO NORRIS (STATIE-Netherlands-2025": "156330L.jpg",
    "MONSTER-Energy drink-250mL-Unknown Arabian country-202": "159660-1L.jpg",
  "MONSTER-Energy drink -fruit-473mL-Mexico-201": "49618L.jpg",
  "MONSTER-Energy drink-473mL-SLASH - R&FN'R! FREE-United States-2010led ": "30262-2L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY ADVANCE-Great Britain-2014": "69233L.jpg",
  "MONSTER-Energy drink -fruit-458mL-WHITE TEA : DRAGON T-United States-2019": "98208L.jpg",
  "MONSTER-Energy drink -tea:lemonade-680mL-United States-201?": "44208-1L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2010": "30184L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2017": "80238L.jpg",
  "MONSTER-Energy drink (diet)-355mL-Great Britain-2017": "82184L.jpg",
  "MONSTER-Energy drink -fruit-500mL-PUNCH MIXXD : PRICE -Great Britain-2017": "83654L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Switzerland-2013": "56962L.jpg",
  "MONSTER-Energy drink (diet)-355mL-Benelux-2017": "82183L.jpg",
  "MONSTER-Energy drink -citrus-500mL-Spain-2014": "58377L.jpg",
  "MONSTER-Energy drink -ginger-500mL-Great Britain-2021": "116589L.jpg",
  "MONSTER-Energy drink -fruit-500mL-France-2015": "71628L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2011 ripper": "35023L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY BLACK O-Great Britain-2015 GB 1": "76693L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - BLACK-Spain-2015": "73836L.jpg",
  "MONSTER-Energy drink -fruit-473mL-Canada-2022": "124465L.jpg",
  "MONSTER-Energy drink-500mL-Denmark-2012 ND": "50609L.jpg",
  "MONSTER-Energy drink -fruit-473mL-Mexico-2011": "48077L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Spain-2011  NS": "36416L.jpg",
  "MONSTER-Energy drink-355mL-United States-2012 NEW US": "44914L.jpg",
  "MONSTER-Energy drink-473mL-KHAOS ENERGY + JUICE-Canada-2013": "56408L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Great Britain-2023": "132017L.jpg",
  "MONSTER-Energy drink-500mL-France-2017 FR 1": "83406L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2017": "83614L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2011 NG": "47376L.jpg",
  "MONSTER-Alc. energy cocktail-500mL-Russian Federation-2010": "72993-1L.jpg",
  "untitled untitled folder GB 2": "81654-1L.jpg",
  "MONSTER-Energy drink-500mL-Spain-2010": "36843L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Hungary-201": "93014L.jpg",
  "MONSTER-Energy drink-500mL-Russian Federation-2015": "72991L.jpg",
  "MONSTER-Energy drink -fruit-500mL-RIPPER ENERGY+JUGO-Spain-2010 NR3": "36844L.jpg",
  "MONSTER-Energy drink -citrus-500mL-VALENTINO ROSSI 46 :-Portugal-2015": "66026L.jpg",
  "MONSTER-Soda water-568mL-SPARKLING TOUR WATER-United States-2023": "135225-2L.jpg",
  "MONSTER-Coffee -vanilla-250mL-Spain-2019": "92703L.jpg",
  "MONSTER-Energy drink-473mL-United States-2007": "26083L.jpg",
  "MONSTER-Energy drink (diet)-500mL-MONSTER ENERGY LO-CA-Denmark-2012 ND": "50608L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - GHOST-Spain-2013": "73835L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Benelux-2017": "83974L.jpg",
  "MONSTER-Energy drink -fruit-500mL-JUICED RIPPER (CAN -Portugal-2016": "74241L.jpg",
  "MONSTER-Energy drink-500mL-Turkey-2016": "80719L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Great Britain-2025": "152692-1L.jpg",
  "MONSTER-Energy drink-553mL-MEGA MONSTER (CAN F-Spain-2016": "74237L.jpg",
  "MONSTER-Energy drink -tea:lemonade-458mL-United States-2017": "82354L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - ADVAN-Great Britain-2015": "84000L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Benelux-2017 BNLX 2": "85438L.jpg",
  "MONSTER-Energy drink -lemon-500mL-Czech Republic-2017": "86660L.jpg",
  "MONSTER-Energy drink-250mL-Germany-2011": "86330L.jpg",
  "MONSTER-Energy drink-500mL-Great Britain-2022": "126950L.jpg",
  "MONSTER-Energy drink -pineapple-473mL-RESERVE : WHITE PINE-United States-2022": "127298L.jpg",
  "MONSTER-Energy:coffee drink -vanilla(diet)-443mL-United States-2014": "66186L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Benelux-2010 PICTURE": "29511L.jpg",
  "MONSTER-Lemonade-473mL-AUSSIE STYLE LEMONAD-United States-2022": "124992L.jpg",
  "MONSTER-Coffee with milk-250mL-ESPRESSO AND MILK : -Great Britain-2019": "91562L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2019": "93085L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2013 NUS6": "53837.jpg",
  "MONSTER-Energy:coffee drink -espresso-200mL-United States-2009": "30303L.jpg",
  "MONSTER-Energy drink-550mL-IMPORT WITH SHIELD A-United States-2009": "33079L.jpg",
  "MONSTER-Energy drink-500mL-Germany-2011": "42449L.jpg",
  "MONSTER-Energy drink-550mL-MEGA MONSTER ENERGY-Spain-2015": "73828L.jpg",
  "MONSTER-Energy drink-946mL-United States-201": "92409L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Sweden-2012 NSN": "42545L.jpg",
  "MONSTER-Energy drink-473mL-Colombia-2017 NUS 5": "82040L.jpg",
  "MONSTER-Energy:coffee drink -mocha-443mL-JAVA MONSTER LOCA MO-United States-2011": "36109L.jpg",
  "MONSTER-Energy drink -fruit-473mL-United States-201": "64559L.jpg",
  "MONSTER-Energy drink-458mL-United States-201? NEW US 3": "44216L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO : AS-Great Britain-2017": "83531L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO : AS-Benelux-2017": "85502L.jpg",
  "MONSTER-Energy:coffee drink -toffee-443mL-JAVA MONSTER TOFFEE -United States-2011": "36110L.jpg",
  "MONSTER-Energy drink-355mL-NITROUS - SUPER DRY-United States-2009": "30263L.jpg",
  "MONSTER-Energy drink-473mL-United States-201": "109782L.jpg",
  "MONSTER-Energy:coffee drink -mocha-444mL-Canada-2019": "94444L.jpg",
  "MONSTER-Energy drink -coffee-285mL-Italy-2012": "72350L.jpg",
  "MONSTER-Energy drink (diet)-500mL-APEX LEGENDS : ULTRA-Benelux-2021": "124715-1L.jpg",
  "MONSTER-Energy drink (diet)-500mL-ABSOLUTELY ZERO - CA-France-2017": "80029-1L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY GHOSTS-Switzerland-2013": "54552L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2016": "76171L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2018 GER 1": "85667L.jpg",
  "MONSTER-Energy drink-500mL-Hungary-2011": "37688L.jpg",
  "MONSTER-Energy drink-473mL-KHAOS (C)2008 50% JU-United States-2008": "23736L.jpg",
  "MONSTER-Energy drink-500mL-ASSASSIN'S CREED ORI-Spain-2017": "83506L.jpg",
  "MONSTER-Energy drink-500mL-Portugal-2013": "59251L.jpg",
  "MONSTER-Energy drink-250mL-Sweden-2010  NEW SWEDEN": "44593L.jpg",
  "MONSTER-Energy drink-500mL-Portugal-2014": "59249L.jpg",
  "MONSTER-Energy drink (diet)-473mL-United States-2013": "53839L.jpg",
  "MONSTER-Energy drink-550mL-Canada-2013": "56411L.jpg",
  "MONSTER-Energy drink-500mL-Denmark-2018": "84789L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY BLACK O-Great Britain-2015": "71713L.jpg",
  "MONSTER-Energy drink-500mL-Benelux-2018 BNLX 1": "85471L.jpg",
  "MONSTER-Energy drink-473mL-United States-2012": "66188L.jpg",
  "MONSTER-Energy drink:tea -green-500mL-REHAB GREEN TEA + EN-Great Britain-2013": "52545-1L.jpg",
  "MONSTER-Alc. energy -white-473mL-THE BEAST UNLEASHED -United States-2023": "141853-3L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - BLACK-France-2015": "71627-1L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-REHAB TE╠ü+LIMONADA+EN-Spain-2012": "44968-1L.jpg",
  "MONSTER-Energy drink-500mL-ASSASSIN'S CREED ORI-Benelux-2017": "83520L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-REHAB CHA╠ü+LIMONADA+E-Portugal-2012 NP": "41790-1L.jpg",
  "MONSTER-Energy drink-500mL-Turkey-2016 TK 1": "77001L.jpg",
  "MONSTER-Energy drink (diet)-500mL-CALL OF DUTY - GHOST-Spain-2013": "73834L.jpg",
  "MONSTER-Energy drink (diet)-500mL-International-2013": "58722L.jpg",
  "MONSTER-Energy drink (diet)-500mL-HALO INFINITE UNLOCK-Great Britain-2020": "109558-1L.jpg",
  "MONSTER-Energy drink-500mL-France-2017 FRNC 1": "83406L.jpg",
  "MONSTER-Energy drink-500mL-KEN BLOCK LIMITED ED-Denmark-2012 ND2": "50610-1L.jpg",
  "MONSTER-Energy drink (diet)-946mL-MONSTER LO-CARB BFC -United States-2009 ": "48013L.jpg",
  "MONSTER-Energy drink:tea -orange-500mL-REHAB TEA+ORANGEADE+-Great Britain-2013": "52849L.jpg",
  "MONSTER-Energy drink -lime-355mL-Japan-2018": "85659L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY - INFIN-Spain-2016": "77109L.jpg",
  "MONSTER-Energy drink-355mL-EXTRA STRENGTH SUPER-United States-2012": "42926L.jpg",
  "MONSTER-Energy drink-500mL-RIPPER : PRICE MARKE-Great Britain-2017": "83429L.jpg",
  "MONSTER-Energy drink (diet)-568mL-Germany-2020": "124463L.jpg",
  "MONSTER-Energy drink-500mL-Portugal-2012": "59248L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-France-2012 NF1": "47918L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-MEAN BEAN KILLER BRE-United States-2025": "152016L.jpg",
  "MONSTER-Energy drink (diet)-500mL-France-2016": "73437L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Benelux-2019": "126299L.jpg",
  "MONSTER-Energy drink -fruit (diet)-500mL-France-2016": "78392L.jpg",
  "MONSTER-Energy:coffee drink -coffee-444mL-JAVA MEAN BEAN - COF-Canada-2013": "56412L.jpg",
  "MONSTER-Energy drink-500mL-RIPPER, CALL OF DUTY-Great Britain-2016": "77182-1L.jpg",
  "MONSTER-Energy drink-240mL-United States-2012": "66187L.jpg",
  "MONSTER-Energy drink-500mL-France-2012": "41559L.jpg",
  "MONSTER-Energy drink -citrus-500mL-France-2014": "61861L.jpg",
  "MONSTER-Energy drink -fruit-473mL-DUB EDITION - BALLER-United States-2013": "53947L.jpg",
  "MONSTER-Energy drink-500mL-Slovak Republic-2010": "32721L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-LOCA MOCA KILLER BRE-United States-2025": "152325L.jpg",
  "MONSTER-Energy drink-473mL-Canada-2013": "56409L.jpg",
  "MONSTER-Energy drink-500mL-RIPPER, CALL OF DUTY-Great Britain-2018": "90734-1L.jpg",
  "MONSTER-Energy drink (diet)-355mL-Switzerland-2018": "85499L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Switzerland-2013": "56348L.jpg",
  "MONSTER-Energy drink (diet)-355mL-EXTRA STRENGTH - BLA-United States-2013": "53842L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Poland-2013": "57802L.jpg",
  "MONSTER-Energy:coffee drink -cream-443mL-United States-2012": "44905L.jpg",
  "MONSTER-Energy drink -tea:lemonade-500mL-Germany-2012 NG": "42448L.jpg",
  "MONSTER-Energy drink -rocket pop:red raspberry:blue raspberry (diet)-355mL-ULTRA RED WHITE & BL-United States-2026": "163368L.jpg",
  "MONSTER-Energy drink -mocha-285mL-X-PRESSO HAMMER 285M-Sweden-2010 NSX": "42563L.jpg",
  "MONSTER-Energy drink -ice tea-500mL-Finland-2016": "80718L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY BLACK O-Benelux-2018": "87742L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Hungary-2011 NEW PICTURE": "37704L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2011": "42543L.jpg",
  "MONSTER-Energy drink (diet)-550mL-United States-201?": "44209L.jpg",
  "MONSTER-Energy drink (diet)-500mL-Slovak Republic-2010": "32723L.jpg",
  "MONSTER-Energy drink-710mL-United States-201?": "44206L.jpg",
  "MONSTER-Energy drink (diet)-250mL-Netherlands-2017": "82181L.jpg",
  "MONSTER-Energy drink-500mL-Norway-2013 NN": "53498L.jpg",
  "MONSTER-Energy drink-500mL-CALL OF DUTY GHOSTS-France-2013": "54385L.jpg",
  "MONSTER-Energy drink -lime-473mL-CUBA-LIMA - TEXTURED-United States-2012": "47757L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Norway-2011": "42543L.jpg",
  "MONSTER-Energy drink -fruit-500mL-PUNCH : BALLER'S BLE-Germany-2017": "83516L.jpg",
  "MONSTER-Alc. energy -peach-473mL-THE BEAST UNLEASHED -United States-2023": "141852-1L.jpg",
  "MONSTER-Energy drink-340mL-Canada-201": "96884L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Germany-2018": "85918L.jpg",
  "MONSTER-Energy drink -fruit (diet)-250mL-Netherlands-2018": "86098L.jpg",
  "MONSTER-Energy drink -apple-500mL-BAD APPLE (STATIEGEL-Netherlands-2024": "147569L.jpg",
  "MONSTER-Energy drink-473mL-Brazil-2017": "81440-3L.jpg",
  "MONSTER-Energy drink -lemon-lime-568mL-SUPER FUEL MEAN GREE-Poland-2022": "122386L.jpg",
  "MONSTER-Energy:coffee drink -coffee-443mL-United States-2009": "49241L.jpg",
  "MONSTER-Energy drink -fruit-473mL-United States-2019 untd sts 1": "96890L.jpg",
  "MONSTER-Energy drink -fruit-500mL-Romania-2014": "64158L.jpg"
};
// ======================================================
// PATHS
// ======================================================

const SOURCE_PATH = path.resolve(
  "imports/monster-products"
);

const UPLOAD_PATH = path.resolve(
  "uploads/products"
);

// ======================================================
// NORMALIZE FOLDER NAMES
// ======================================================

const normalizeName = (name = "") => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
};

// ======================================================
// FIND ACTUAL PRODUCT FOLDERS
// ======================================================

const getProductFolders = (dir) => {
  const folders = [];

  if (!fs.existsSync(dir)) {
    return folders;
  }

  const walk = (currentDir) => {
    let entries;

    try {
      entries = fs.readdirSync(
        currentDir,
        {
          withFileTypes: true,
        }
      );
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const fullPath = path.join(
        currentDir,
        entry.name
      );

      folders.push({
        name: entry.name,
        normalized: normalizeName(
          entry.name
        ),
        path: fullPath,
      });

      walk(fullPath);
    }
  };

  walk(dir);

  return folders;
};

// ======================================================
// FIND BEST MATCH
// ======================================================

const findMatchingFolder = (
  sourceFolder,
  folders
) => {
  const normalizedSource =
    normalizeName(sourceFolder);

  // ------------------------------------------
  // EXACT NORMALIZED MATCH
  // ------------------------------------------

  let match = folders.find(
    (folder) =>
      folder.normalized ===
      normalizedSource
  );

  if (match) {
    return match;
  }

  // ------------------------------------------
  // CONTAINS MATCH
  // ------------------------------------------

  match = folders.find(
    (folder) =>
      folder.normalized.includes(
        normalizedSource
      ) ||
      normalizedSource.includes(
        folder.normalized
      )
  );

  return match || null;
};

// ======================================================
// FIND IMAGE
// ======================================================

const findImage = (
  folderPath,
  fileName
) => {
  if (!fs.existsSync(folderPath)) {
    return null;
  }

  const entries =
    fs.readdirSync(
      folderPath,
      {
        withFileTypes: true,
      }
    );

  for (const entry of entries) {
    const fullPath =
      path.join(
        folderPath,
        entry.name
      );

    if (entry.isDirectory()) {
      const result =
        findImage(
          fullPath,
          fileName
        );

      if (result) {
        return result;
      }
    }

    if (
      entry.isFile() &&
      entry.name.toLowerCase() ===
        fileName.toLowerCase()
    ) {
      return fullPath;
    }
  }

  return null;
};

// ======================================================
// SAFE FILE NAME
// ======================================================

const safeFileName = (name = "") => {
  return name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );
};

// ======================================================
// MAIN
// ======================================================

const run = async () => {
  try {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "🖼️ FRONT IMAGE FIX"
    );
    console.log(
      "======================================"
    );

    await connectDB();

    console.log(
      "✅ MongoDB connected"
    );

    // ------------------------------------------
    // CHECK SOURCE
    // ------------------------------------------

    if (
      !fs.existsSync(
        SOURCE_PATH
      )
    ) {
      throw new Error(
        `Source folder not found:\n${SOURCE_PATH}`
      );
    }

    // ------------------------------------------
    // CREATE UPLOAD FOLDER
    // ------------------------------------------

    if (
      !fs.existsSync(
        UPLOAD_PATH
      )
    ) {
      fs.mkdirSync(
        UPLOAD_PATH,
        {
          recursive: true,
        }
      );
    }

    // ------------------------------------------
    // SCAN ZIP EXTRACTION
    // ------------------------------------------

    console.log("");
    console.log(
      "📂 Scanning extracted product folders..."
    );

    const folders =
      getProductFolders(
        SOURCE_PATH
      );

    console.log(
      `📁 Found ${folders.length} folders`
    );

    // ------------------------------------------
    // GET PRODUCTS
    // ------------------------------------------

    const products =
      await Product.find({});

    console.log(
      `📦 MongoDB products: ${products.length}`
    );

    console.log(
      `🗺️ Image mappings: ${
        Object.keys(
          FRONT_IMAGE_MAP
        ).length
      }`
    );

    // ------------------------------------------
    // COUNTERS
    // ------------------------------------------

    let updated = 0;
    let noMapping = 0;
    let folderMissing = 0;
    let imageMissing = 0;

    // ------------------------------------------
    // PROCESS
    // ------------------------------------------

    for (
      let i = 0;
      i < products.length;
      i++
    ) {
      const product =
        products[i];

      console.log("");
      console.log(
        `[${i + 1}/${products.length}] ${
          product.name
        }`
      );

      const sourceFolder =
        product.sourceFolder;

      if (!sourceFolder) {
        console.log(
          "⚠️ No sourceFolder"
        );

        continue;
      }

      // ----------------------------------------
      // IMAGE MAP
      // ----------------------------------------

      const frontFile =
        FRONT_IMAGE_MAP[
          sourceFolder
        ];

      if (!frontFile) {
        console.log(
          "⚠️ No front-image mapping"
        );

        console.log(
          `   ${sourceFolder}`
        );

        noMapping++;

        continue;
      }

      console.log(
        `🎯 Front image: ${frontFile}`
      );

      // ----------------------------------------
      // FIND ACTUAL FOLDER
      // ----------------------------------------

      const folder =
        findMatchingFolder(
          sourceFolder,
          folders
        );

      if (!folder) {
        console.log(
          "❌ Actual product folder not found"
        );

        console.log(
          `   DB: ${sourceFolder}`
        );

        folderMissing++;

        continue;
      }

      console.log(
        `📁 Matched folder: ${folder.name}`
      );

      // ----------------------------------------
      // FIND IMAGE
      // ----------------------------------------

      const imagePath =
        findImage(
          folder.path,
          frontFile
        );

      if (!imagePath) {
        console.log(
          `❌ Image not found: ${frontFile}`
        );

        imageMissing++;

        continue;
      }

      console.log(
        `🖼️ Found: ${imagePath}`
      );

      // ----------------------------------------
      // CREATE PRODUCT UPLOAD FOLDER
      // ----------------------------------------

      const productFolderName =
        safeFileName(
          sourceFolder
        );

      const destinationFolder =
        path.join(
          UPLOAD_PATH,
          productFolderName
        );

      fs.mkdirSync(
        destinationFolder,
        {
          recursive: true,
        }
      );

      // ----------------------------------------
      // COPY FRONT IMAGE
      // ----------------------------------------

      const destinationPath =
        path.join(
          destinationFolder,
          frontFile
        );

      fs.copyFileSync(
        imagePath,
        destinationPath
      );

      // ----------------------------------------
      // DATABASE URL
      // ----------------------------------------

      const imageUrl =
        `/uploads/products/${productFolderName}/${frontFile}`;

      // ----------------------------------------
      // UPDATE MONGODB
      // ----------------------------------------

      await Product.updateOne(
        {
          _id: product._id,
        },
        {
          $set: {
            image: imageUrl,
          },
        }
      );

      updated++;

      console.log(
        `✅ UPDATED → ${imageUrl}`
      );
    }

    // ------------------------------------------
    // FINAL REPORT
    // ------------------------------------------

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "🎉 IMAGE FIX COMPLETE"
    );
    console.log(
      "======================================"
    );

    console.log(
      `📦 Total products: ${products.length}`
    );

    console.log(
      `✅ Updated: ${updated}`
    );

    console.log(
      `⚠️ No mapping: ${noMapping}`
    );

    console.log(
      `❌ Folder missing: ${folderMissing}`
    );

    console.log(
      `❌ Image missing: ${imageMissing}`
    );

    console.log(
      "======================================"
    );

  } catch (error) {
    console.log("");
    console.log(
      "❌ IMAGE FIX FAILED"
    );

    console.error(error);

  } finally {
    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();
    }

    console.log(
      "🔌 Database connection closed."
    );
  }
};

// ======================================================
// START
// ======================================================

run();