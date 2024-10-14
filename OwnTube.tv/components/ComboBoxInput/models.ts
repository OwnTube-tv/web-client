export interface DropDownItem {
  label: string;
  value: string;
}

export interface ComboBoxInputProps {
  value?: string;
  onChange: (value: string) => void;
  data?: Array<DropDownItem>;
  testID: string;
  placeholder?: string;
  width?: number;
}
