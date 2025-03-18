import { StatusIndicator } from './status-indicator';

export interface ListItem {
    Id: number;
    Name: string;
    StartDate?: Date;
    ExpiryDate?: Date;
    Status?: {
      Value: string;
      StatusIndicator: StatusIndicator;
    };
    Type?: string;
    SubItems: any[];
    isSubItemExpanded?: boolean;
    bidfoodNote?: string;
  }
