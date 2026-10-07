/**
 * Sundarbans Sentinel - Internationalization (i18n) Engine
 * Full bilingual support: English (en) and Bengali / বাংলা (bn)
 */

export type Language = 'en' | 'bn';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  appTitle: {
    en: 'SUNDARBANS SENTINEL',
    bn: 'সুন্দরবন সেন্টিনেল'
  },
  appSubtitle: {
    en: 'Earth-Observation Intelligence for Mangrove Ecosystems',
    bn: 'ম্যানগ্রোভ বাস্তুতন্ত্রের ভূ-পর্যবেক্ষণ ও কৃত্রিম বুদ্ধিমত্তা'
  },
  nasaSpaceApps: {
    en: 'NASA Space Apps 2026',
    bn: 'নাসা স্পেস অ্যাপস ২০২৬'
  },
  liveNasaData: {
    en: 'LIVE NASA DATA',
    bn: 'লাইভ নাসা ডেটা'
  },
  demoData: {
    en: 'DEMO DATA (CALIBRATED)',
    bn: 'ক্যালিব্রেটেড ডেমো ডেটা'
  },

  // Navigation
  navOverview: {
    en: 'Overview',
    bn: 'সারসংক্ষেপ'
  },
  navSatelliteMap: {
    en: 'Live Satellite Map',
    bn: 'লাইভ স্যাটেলাইট মানচিত্র'
  },
  navAnomalies: {
    en: 'Anomalies Feed',
    bn: 'অস্বাভাবিক পরিবর্তন'
  },
  navCycloneSimulation: {
    en: 'Cyclone Simulation',
    bn: 'ঘূর্ণিঝড় ও জলবায়ু পূর্বাভাস'
  },
  navGroundTruthing: {
    en: 'Ground-Truthing',
    bn: 'মাঠপর্যায়ের পর্যবেক্ষণ'
  },
  navAlertDispatcher: {
    en: 'Alert Dispatcher',
    bn: 'জরুরি সতর্কতা ব্যবস্থা'
  },
  navSalinityTracker: {
    en: 'Salinity Dynamics',
    bn: 'লবণাক্ততা ও স্বাদু পানি'
  },
  navMethodology: {
    en: 'Methodology',
    bn: 'কার্যপ্রণালী'
  },
  navNasaData: {
    en: 'NASA Data',
    bn: 'নাসা ডেটা'
  },
  navReportGenerator: {
    en: 'Report Generator',
    bn: 'প্রতিবেদন প্রস্তুতকারক'
  },

  // Indicators
  vegetation: {
    en: 'Vegetation',
    bn: 'উদ্ভিদ ঘনত্ব (NDVI)'
  },
  water: {
    en: 'Water Extent',
    bn: 'জলীয় বিস্তার (NDWI)'
  },
  thermal: {
    en: 'Thermal State',
    bn: 'ভূ-পৃষ্ঠের তাপমাত্রা (LST)'
  },
  fire: {
    en: 'FIRMS Fire',
    bn: 'নাসা ফায়ার হটস্পট'
  },
  satellite: {
    en: 'Satellite',
    bn: 'স্যাটেলাইট'
  },
  anomalies: {
    en: 'Anomalies',
    bn: 'অসঙ্গতি'
  },

  // Actions
  printSavePdf: {
    en: 'Print / Save PDF',
    bn: 'প্রিন্ট / পিডিএফ সংরক্ষণ'
  },
  saveAsPdf: {
    en: 'Save as PDF',
    bn: 'পিডিএফ হিসেবে সংরক্ষণ'
  },
  exportJson: {
    en: 'Export JSON',
    bn: 'জেসন এক্সপোর্ট'
  },
  compareYears: {
    en: 'Compare 2 Years',
    bn: '২ বছরের তুলনা'
  },
  zoneBuilder: {
    en: 'Zone Builder',
    bn: 'জোন নির্মাতা'
  },
  inspectEvidence: {
    en: 'Inspect Evidence',
    bn: 'প্রমাণ পরীক্ষা করুন'
  },

  // Cyclone Simulation
  simTitle: {
    en: 'Predictive Climate & Cyclone Impact Modeling',
    bn: 'ঘূর্ণিঝড় ও জলবায়ু প্রভাবের পূর্বাভাস মডেল'
  },
  simSubtitle: {
    en: 'Machine learning surge physics & NOAA SST wind-shear impact analysis on Sundarbans mangrove stands',
    bn: 'নাসা ও নোয়া ডেটাভিত্তিক ঘূর্ণিঝড় জলোচ্ছ্বাস ও ম্যানগ্রোভ প্রজাতির ক্ষয়ক্ষতির আগাম পূর্বাভাস'
  },
  cycloneCategory: {
    en: 'Cyclone Category (Saffir-Simpson)',
    bn: 'ঘূর্ণিঝড়ের তীব্রতা বিভাগ'
  },
  stormSurgeHeight: {
    en: 'Storm Surge Height (Meters)',
    bn: 'জলোচ্ছ্বাসের উচ্চতা (মিটার)'
  },
  landfallZone: {
    en: 'Projected Landfall Corridor',
    bn: 'সম্ভাব্য আঘাত হানার অঞ্চল'
  },
  tidalPhase: {
    en: 'Tidal Phase at Landfall',
    bn: 'আঘাত হানার সময় জোয়ারের অবস্থা'
  },
  runSimulation: {
    en: 'Run Predictive Simulation',
    bn: 'সিমুলেশন পরিচালনা করুন'
  },
  speciesImpactTitle: {
    en: 'Mangrove Species Vulnerability & Mortality Projections',
    bn: 'ম্যানগ্রোভ বৃক্ষ প্রজাতির সম্ভাব্য ক্ষয়ক্ষতি ও মৃত্যুর হার'
  },
  sundriLoss: {
    en: 'Sundri (Heritiera fomes) Projected Defoliation',
    bn: 'সুন্দরী গাছের সম্ভাব্য পত্রহীনতা ও ক্ষতি'
  },
  gewaLoss: {
    en: 'Gewa (Excoecaria agallocha) Projected Inundation Impact',
    bn: 'গেওয়া গাছের জলাবদ্ধতাজনিত ক্ষতি'
  },
  goranLoss: {
    en: 'Goran (Ceriops decandra) Salt Stress Risk',
    bn: 'গড়ান গাছের লবণাক্ততা চাপ ঝুঁকি'
  },
  recoveryYears: {
    en: 'Estimated Ecosystem Recovery Time',
    bn: 'বাস্তুতন্ত্রের স্বাভাবিক হতে আনুমানিক সময়'
  },
  tigerDisplacement: {
    en: 'Bengal Tiger & Wildlife Displacement Risk',
    bn: 'রয়্যাল বেঙ্গল টাইগার ও বন্যপ্রাণী স্থানচ্যুতি ঝুঁকি'
  },

  // Ground Truthing
  groundTruthTitle: {
    en: 'Community Science & Ground-Truthing Field Layer',
    bn: 'মাঠপর্যায়ের পর্যবেক্ষণ ও উপগ্রহ উপাত্তের যাচাইকরণ'
  },
  groundTruthSubtitle: {
    en: 'Crowdsourced in-situ observations from forest rangers, researchers, and coastal communities cross-validated against satellite passes',
    bn: 'বনকর্মী, গবেষক ও স্থানীয় নাগরিকদের মাঠপর্যায়ের ডেটার সাথে উপগ্রহের অসঙ্গতি মেলানোর ব্যবস্থা'
  },
  submitObservation: {
    en: 'Submit Field Observation',
    bn: 'নতুন পর্যবেক্ষণ জমা দিন'
  },
  verifiedReports: {
    en: 'Cross-Validated Reports',
    bn: 'উপগ্রহ দ্বারা যাচাইকৃত রিপোর্ট'
  },
  pendingVerification: {
    en: 'Pending Satellite Pass Validation',
    bn: 'উপগ্রহ যাচাইকরণের অপেক্ষায়'
  },
  fieldSalinity: {
    en: 'In-Situ Water Salinity (ppt / PSU)',
    bn: 'পানিতে লবণাক্ততার মাত্রা (পিপিটি)'
  },
  observationType: {
    en: 'Observation Category',
    bn: 'পর্যবেক্ষণের ধরণ'
  },
  wildlifeSighting: {
    en: 'Wildlife Sighting',
    bn: 'বন্যপ্রাণী দর্শন'
  },
  canopyDamage: {
    en: 'Canopy Damage / Dieback',
    bn: 'গাছের ডালপালা ভাঙা বা মৃত্যু'
  },
  waterLogging: {
    en: 'Abnormal Water Inundation',
    bn: 'অস্বাভাবিক জলাবদ্ধতা'
  },
  illegalFelling: {
    en: 'Illegal Tree Felling',
    bn: 'অবৈধ গাছ কাটা'
  },
  fieldNotes: {
    en: 'Field Notes & GPS Description',
    bn: 'মাঠপর্যায়ের বিবরণ ও জিপিএস অবস্থান'
  },

  // Alert Dispatcher
  alertDispatcherTitle: {
    en: 'Automated Policy & Conservation Alert Dispatcher',
    bn: 'স্বয়ংক্রিয় নীতি ও সংরক্ষণ জরুরি সতর্কতা প্রেরক'
  },
  alertDispatcherSubtitle: {
    en: 'Threshold-based incident triggers with mock webhooks, SMS sirens, and BFD/UNESCO dispatch feeds',
    bn: 'পরিবেশগত সীমা লঙ্ঘনে বন বিভাগ, ইউনেস্কো এবং দুর্যোগ কমিটির কাছে স্বয়ংক্রিয় নোটিফিকেশন প্রেরণ'
  },
  activeRules: {
    en: 'Active Alert Threshold Rules',
    bn: 'সক্রিয় সতর্কবার্তা নীতি ও সীমা'
  },
  dispatchLog: {
    en: 'Live Incident & Dispatch Log',
    bn: 'সরাসরি সতর্কবার্তা ও নোটিফিকেশন ইতিহাস'
  },
  configureRule: {
    en: 'Add Threshold Rule',
    bn: 'নতুন সতর্কীকরণ সীমা যুক্ত করুন'
  },
  testWebhook: {
    en: 'Test Webhook Dispatch',
    bn: 'টেস্ট ওয়েবহুক পাঠান'
  },
  recipientAgencies: {
    en: 'Target Recipient Agencies',
    bn: 'প্রাপক সংস্থা ও দফতর'
  },

  // Salinity Dynamics
  salinityTitle: {
    en: 'Salinity Intrusion & Fresh Water Dynamics Tracker',
    bn: 'লবণাক্ততা বৃদ্ধি ও মিঠা পানির প্রবাহ পর্যবেক্ষণ'
  },
  salinitySubtitle: {
    en: 'Upstream Gorai/Ganges river discharge vs Bay of Bengal oceanic intrusion and Sundri top-dying correlation',
    bn: 'উজানের গড়াই-পদ্মা নদীর মিঠা পানির প্রবাহ বনাম বঙ্গোপসাগরের লোনা পানির অনুপ্রবেশ ও সুন্দরী গাছের রোগ বিশ্লেষণ'
  },
  upstreamDischarge: {
    en: 'Upstream Freshwater Discharge (m³/s)',
    bn: 'উজানের মিঠা পানির প্রবাহ (ঘনমিটার/সেকেন্ড)'
  },
  salinityZones: {
    en: 'Ecological Salinity Zones',
    bn: 'বাস্তুতান্ত্রিক লবণাক্ততা অঞ্চলসমূহ'
  },
  freshZone: {
    en: 'Fresh / Oligohaline (< 5 ppt)',
    bn: 'স্বাদু / কম লবণাক্ত (< ৫ পিপিটি)'
  },
  moderateZone: {
    en: 'Moderate / Mesohaline (5 - 18 ppt)',
    bn: 'মাঝারি লবণাক্ত (৫ - ১৮ পিপিটি)'
  },
  polyhalineZone: {
    en: 'High / Polyhaline (> 18 ppt)',
    bn: 'উচ্চ লবণাক্ত (> ১৮ পিপিটি)'
  },
  topDyingRisk: {
    en: 'Sundri Top-Dying Disease Vulnerability Index',
    bn: 'সুন্দরী গাছের আগামরা রোগের সম্ভাব্য ঝুঁকি সূচক'
  }
};

/**
 * Translation helper function
 */
export function getTranslation(key: string, lang: Language): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return translations[key]?.en || key;
}
