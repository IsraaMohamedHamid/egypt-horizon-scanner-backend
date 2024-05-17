// interfaces/mongoose.gen.ts
import { Document, Model } from 'mongoose';

export interface GovernorateDocument extends Document {
  GovernorateID: number;
  Governorate_Name_EN: string;
  Governorate_Name_AR: string;
  Governorate_PCODE: string;
  Governorate_Capital_Name_EN: string;
  Governorate_Capital_Name_AR: string;
  Governorate_Capital_PCODE: string;
  Locality_Name_EN: string;
  Locality_Name_AR: string;
  Locality_PCODE: string;
  City_Name_EN: string;
  City_Name_AR: string;
  City_PCODE: string;
  District_Name_EN: string;
  District_Name_AR: string;
  District_PCODE: string;
  State_Name_EN: string;
  State_Name_AR: string;
  State_PCODE: string;
  Province_Name_EN: string;
  Province_Name_AR: string;
  Province_PCODE: string;
  Region_Name_EN: string;
  Region_Name_AR: string;
  Region_PCODE: string;
  Country_EN: string;
  Country_AR: string;
  Country_PCODE: string;
  Government_Type: string;
  Government_Chief_Administrator: string;
  Government_Governor: string;
  Population: number;
  Type: string;
  Shape_Area: number;
  Coordinates: number[];
  Most_Intervention_Type: string[];
  Least_Intervention_Type: string[];
  No_Intervention_Type: string[];
  ThemeCounts: Map<string, number>;
}

export interface GovernorateModel extends Model<GovernorateDocument> {}
