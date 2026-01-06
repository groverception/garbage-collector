export interface ConcernOption {
  label: string;
  value: string;
}

export const CONCERN_OPTIONS: ConcernOption[] = [
  { label: 'Municipal Corporation', value: 'municipal' },
  { label: 'Ward Office', value: 'ward' },
  { label: 'Resident Welfare Association', value: 'rwa' },
  { label: 'Local MLA/MP Office', value: 'representative' },
  { label: 'Pollution Control Board', value: 'pollution' },
  { label: 'Railway Authority', value: 'railway' },
  { label: 'NHAI / Highway Authority', value: 'highway' },
  { label: 'Other', value: 'other' },
];
