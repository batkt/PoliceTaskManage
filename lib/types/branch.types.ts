export type Branch = {
  _id: string;
  name: string;
  isParent?: boolean; // эцэг салбар эсэх
  parent?: string; // эцэг салбар
  path: string;
};
